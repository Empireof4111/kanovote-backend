import { Injectable, NotFoundException, BadRequestException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // Register new agent with user creation
  async registerAgent(registerAgentDto: RegisterAgentDto): Promise<{ agent: Agent; user: User }> {
    const { email, phone, password, firstName, lastName, ...agentData } = registerAgentDto;

    // Check if user with this email already exists
    const existingUser = await this.userRepository.findOne({
      where: { email },
    });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    let savedUser: User;

    if (existingUser) {
      const existingAgent = await this.agentRepository.findOne({
        where: { userId: existingUser.id },
      });

      if (existingAgent) {
        throw new ConflictException('User with this email already exists');
      }

      existingUser.firstName = firstName;
      existingUser.lastName = lastName;
      existingUser.phone = phone;
      existingUser.password = hashedPassword;
      existingUser.role = agentData.role as UserRole;
      existingUser.isActive = true;

      savedUser = await this.userRepository.save(existingUser);
    } else {
      // Generate username from email (take part before @)
      const username = email.split('@')[0] + '_' + Math.random().toString(36).substring(7);

      // Create user
      const user = this.userRepository.create({
        email,
        phone,
        firstName,
        lastName,
        username,
        password: hashedPassword,
        role: agentData.role as UserRole,
        isActive: true,
      });
      savedUser = await this.userRepository.save(user);
    }

    // Create agent
    const agent = this.agentRepository.create({
      userId: savedUser.id,
      ...agentData,
    });
    const savedAgent = await this.agentRepository.save(agent);

    return { agent: savedAgent, user: savedUser };
  }

  async create(createAgentDto: CreateAgentDto): Promise<Agent> {
    const user = await this.userRepository.findOne({
      where: { id: createAgentDto.userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    // Check if agent already exists for this user
    const existingAgent = await this.agentRepository.findOne({
      where: { userId: createAgentDto.userId },
    });

    if (existingAgent) {
      throw new BadRequestException('Agent already exists for this user');
    }

    const agent = this.agentRepository.create(createAgentDto);
    return this.agentRepository.save(agent);
  }

  async findById(id: string): Promise<Agent> {
    const agent = await this.agentRepository.findOne({
      where: { id },
      relations: ['user', 'registrations'],
    });

    if (!agent) {
      throw new NotFoundException('Agent not found');
    }

    return agent;
  }

  async findByUserId(userId: string): Promise<Agent | null> {
    return this.agentRepository.findOne({
      where: { userId },
      relations: ['user', 'registrations'],
    });
  }

  async findAll(skip = 0, take = 10, filters?: AgentPerformanceDto) {
    const query = this.agentRepository.createQueryBuilder('agent');

    if (filters?.state) {
      query.andWhere('agent.state = :state', { state: filters.state });
    }

    if (filters?.lga) {
      query.andWhere('agent.lga = :lga', { lga: filters.lga });
    }

    if (filters?.role) {
      query.andWhere('agent.role = :role', { role: filters.role });
    }

    if (filters?.status) {
      query.andWhere('agent.status = :status', { status: filters.status });
    }

    return query
      .leftJoinAndSelect('agent.user', 'user')
      .skip(skip)
      .take(take)
      .orderBy('agent.joinedAt', 'DESC')
      .getManyAndCount();
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findById(id);
    
    Object.assign(agent, updateAgentDto);
    agent.lastActivityAt = new Date();

    return this.agentRepository.save(agent);
  }

  // Reset agent password
  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto): Promise<void> {
    const user = await this.userRepository.findOne({
      where: { id: userId },
    });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const hashedPassword = await bcrypt.hash(resetPasswordDto.newPassword, 10);
    user.password = hashedPassword;
    await this.userRepository.save(user);
  }

  async updateRegistrationStats(agentId: string): Promise<void> {
    const agent = await this.findById(agentId);
    
    const stats = await this.agentRepository
      .createQueryBuilder('agent')
      .leftJoinAndSelect('agent.registrations', 'registration')
      .select('COUNT(CASE WHEN registration.status = :verified THEN 1 END)', 'verifiedCount')
      .addSelect('COUNT(CASE WHEN registration.status = :pending THEN 1 END)', 'pendingCount')
      .addSelect('COUNT(CASE WHEN registration.status = :rejected THEN 1 END)', 'rejectedCount')
      .addSelect('COUNT(registration.id)', 'totalCount')
      .where('agent.id = :agentId', { agentId })
      .setParameters({
        verified: 'verified',
        pending: 'pending',
        rejected: 'rejected',
      })
      .getRawOne();

    agent.totalRegistrations = parseInt(stats?.totalCount || 0);
    agent.verifiedRegistrations = parseInt(stats?.verifiedCount || 0);
    agent.pendingRegistrations = parseInt(stats?.pendingCount || 0);
    agent.rejectedRegistrations = parseInt(stats?.rejectedCount || 0);

    await this.agentRepository.save(agent);
  }

  async getPerformanceReport(agentId: string) {
    const agent = await this.findById(agentId);

    return {
      agentId: agent.id,
      agentName: `${agent.user.firstName} ${agent.user.lastName}`,
      role: agent.role,
      state: agent.state,
      lga: agent.lga,
      ward: agent.ward,
      totalRegistrations: agent.totalRegistrations,
      verifiedRegistrations: agent.verifiedRegistrations,
      pendingRegistrations: agent.pendingRegistrations,
      rejectedRegistrations: agent.rejectedRegistrations,
      verificationRate: agent.totalRegistrations > 0 
        ? ((agent.verifiedRegistrations / agent.totalRegistrations) * 100).toFixed(2)
        : 0,
      joinedAt: agent.joinedAt,
      lastActivityAt: agent.lastActivityAt,
      status: agent.status,
    };
  }

  async deactivate(id: string): Promise<Agent> {
    const agent = await this.findById(id);
    agent.status = AgentStatus.INACTIVE;
    return this.agentRepository.save(agent);
  }

  async suspend(id: string): Promise<Agent> {
    const agent = await this.findById(id);
    agent.status = AgentStatus.SUSPENDED;
    return this.agentRepository.save(agent);
  }

  async activate(id: string): Promise<Agent> {
    const agent = await this.findById(id);
    agent.status = AgentStatus.ACTIVE;
    agent.lastActivityAt = new Date();
    return this.agentRepository.save(agent);
  }

  async delete(id: string): Promise<void> {
    const agent = await this.findById(id);
    await this.agentRepository.remove(agent);
  }
}
