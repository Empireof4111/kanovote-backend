import { Injectable, NotFoundException, BadRequestException, ConflictException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { Registration, RegistrationStatus } from '@/entities/registration.entity';
import { User } from '@/entities/user.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';

@Injectable()
export class AgentService {
  constructor(
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
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

    return this.attachRegistrationStats(agent);
  }

  async findByUserId(userId: string): Promise<Agent | null> {
    const agent = await this.agentRepository.findOne({
      where: { userId },
      relations: ['user', 'registrations'],
    });

    if (!agent) {
      return null;
    }

    return this.attachRegistrationStats(agent);
  }

  async findAll(
    skip = 0,
    take = 10,
    filters?: AgentPerformanceDto,
    requester?: { id: string; role: UserRole },
  ) {
    const query = this.agentRepository.createQueryBuilder('agent');

    if (requester?.role === UserRole.SUPERVISOR) {
      const supervisorAgent = await this.findSupervisorAgentByUserId(requester.id);
      query
        .andWhere('agent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga })
        .andWhere('agent.role = :fieldAgentRole', { fieldAgentRole: UserRole.FIELD_AGENT });
    }

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

    const [agents, total] = await query
      .leftJoinAndSelect('agent.user', 'user')
      .skip(skip)
      .take(take)
      .orderBy('agent.joinedAt', 'DESC')
      .getManyAndCount();

    const hydratedAgents = await Promise.all(
      agents.map((agent) => this.attachRegistrationStats(agent)),
    );

    return [hydratedAgents, total] as const;
  }

  async findByIdForRequester(id: string, requester: { id: string; role: UserRole }): Promise<Agent> {
    const agent = await this.findById(id);

    if (requester.role === UserRole.SUPERVISOR) {
      await this.assertSupervisorCanAccessAgent(requester.id, agent);
    }

    return agent;
  }

  async update(id: string, updateAgentDto: UpdateAgentDto): Promise<Agent> {
    const agent = await this.findById(id);
    const {
      firstName,
      lastName,
      email,
      phone,
      state,
      lga,
      ward,
      status,
      notes,
    } = updateAgentDto;

    if (email && email !== agent.user.email) {
      const existingUser = await this.userRepository.findOne({
        where: { email },
      });

      if (existingUser && existingUser.id !== agent.userId) {
        throw new ConflictException('Another user with this email already exists');
      }
    }

    if (firstName !== undefined) {
      agent.user.firstName = firstName;
    }

    if (lastName !== undefined) {
      agent.user.lastName = lastName;
    }

    if (email !== undefined) {
      agent.user.email = email;
    }

    if (phone !== undefined) {
      agent.user.phone = phone;
    }

    if (state !== undefined) {
      agent.state = state;
    }

    if (lga !== undefined) {
      agent.lga = lga;
    }

    if (ward !== undefined) {
      agent.ward = ward;
    }

    if (status !== undefined) {
      agent.status = status;
    }

    if (notes !== undefined) {
      agent.notes = notes;
    }

    agent.lastActivityAt = new Date();

    await this.userRepository.save(agent.user);
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

    const hydratedAgent = await this.attachRegistrationStats(agent);
    await this.agentRepository.save(hydratedAgent);
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

    if ((agent.registrations?.length || 0) > 0) {
      throw new BadRequestException(
        'This field agent cannot be deleted because they already have registration records. Deactivate the agent instead.',
      );
    }

    await this.agentRepository.remove(agent);
  }

  private async findSupervisorAgentByUserId(userId: string): Promise<Agent> {
    const supervisorAgent = await this.agentRepository.findOne({
      where: { userId, role: UserRole.SUPERVISOR },
    });

    if (!supervisorAgent) {
      throw new ForbiddenException('Supervisor profile not found');
    }

    return supervisorAgent;
  }

  private async assertSupervisorCanAccessAgent(supervisorUserId: string, agent: Agent): Promise<void> {
    const supervisorAgent = await this.findSupervisorAgentByUserId(supervisorUserId);

    if (agent.role !== UserRole.FIELD_AGENT || agent.lga !== supervisorAgent.lga) {
      throw new ForbiddenException('You can only access field agents in your local government area');
    }
  }

  private async attachRegistrationStats(agent: Agent): Promise<Agent> {
    const [total, verified, rejected, initiated, inProgress, completed] = await Promise.all([
      this.registrationRepository.count({ where: { agentId: agent.id } }),
      this.registrationRepository.count({
        where: { agentId: agent.id, status: RegistrationStatus.VERIFIED },
      }),
      this.registrationRepository.count({
        where: { agentId: agent.id, status: RegistrationStatus.REJECTED },
      }),
      this.registrationRepository.count({
        where: { agentId: agent.id, status: RegistrationStatus.INITIATED },
      }),
      this.registrationRepository.count({
        where: { agentId: agent.id, status: RegistrationStatus.IN_PROGRESS },
      }),
      this.registrationRepository.count({
        where: { agentId: agent.id, status: RegistrationStatus.COMPLETED },
      }),
    ]);

    agent.totalRegistrations = total;
    agent.verifiedRegistrations = verified;
    agent.rejectedRegistrations = rejected;
    agent.pendingRegistrations = initiated + inProgress + completed;

    return agent;
  }
}
