import { Injectable, NotFoundException, BadRequestException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { FindOptionsWhere, Repository } from 'typeorm';
import { Agent } from '@/entities/agent.entity';
import { Supporter, VerificationStatus } from '@/entities/supporter.entity';
import { UserRole } from '@/entities/user-role.enum';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';

@Injectable()
export class SupporterService {
  constructor(
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
  ) {}

  async create(createSupporterDto: CreateSupporterDto, registeredByUserId: string): Promise<Supporter> {
    const normalizedEmail = createSupporterDto.email?.trim().toLowerCase() || null;
    const normalizedPhone = createSupporterDto.phone.trim();
    const normalizedVoterCardNumber = createSupporterDto.voterCardNumber.trim();

    const duplicateConditions: FindOptionsWhere<Supporter>[] = [
      { phone: normalizedPhone },
      { voterCardNumber: normalizedVoterCardNumber },
    ];

    if (normalizedEmail) {
      duplicateConditions.push({ email: normalizedEmail });
    }

    const existingSupporter = await this.supporterRepository.findOne({
      where: duplicateConditions,
    });

    if (existingSupporter) {
      if (existingSupporter.phone === normalizedPhone) {
        throw new BadRequestException('This phone number has already been used to register a supporter');
      }

      if (normalizedEmail && existingSupporter.email === normalizedEmail) {
        throw new BadRequestException('Supporter with this email already exists');
      }

      if (existingSupporter.voterCardNumber === normalizedVoterCardNumber) {
        throw new BadRequestException('Supporter with this voter card number already exists');
      }

      throw new BadRequestException('Supporter already exists');
    }

    const supporter = this.supporterRepository.create({
      ...createSupporterDto,
      email: normalizedEmail,
      phone: normalizedPhone,
      voterCardNumber: normalizedVoterCardNumber,
      registeredByUserId,
    });

    return this.supporterRepository.save(supporter);
  }

  async findById(id: string): Promise<Supporter> {
    const supporter = await this.supporterRepository.findOne({
      where: { id },
      relations: ['registeredByUser'],
    });

    if (!supporter) {
      throw new NotFoundException('Supporter not found');
    }

    return supporter;
  }

  async findAll(
    skip = 0,
    take = 10,
    filters?: {
      state?: string;
      lga?: string;
      status?: VerificationStatus;
      search?: string;
    },
    requester?: { id: string; role: UserRole },
  ) {
    const query = this.supporterRepository.createQueryBuilder('supporter');

    if (requester?.role === UserRole.SUPERVISOR) {
      const supervisorAgent = await this.findSupervisorAgentByUserId(requester.id);
      query
        .innerJoin(Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
        .andWhere('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: UserRole.FIELD_AGENT })
        .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga });
    }

    if (filters?.state) {
      query.andWhere('supporter.state = :state', { state: filters.state });
    }

    if (filters?.lga) {
      query.andWhere('supporter.lga = :lga', { lga: filters.lga });
    }

    if (filters?.status) {
      query.andWhere('supporter.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(supporter.firstName ILIKE :search OR supporter.lastName ILIKE :search OR COALESCE(supporter.email, \'\') ILIKE :search OR supporter.phone ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return query
      .leftJoinAndSelect('supporter.registeredByUser', 'user')
      .skip(skip)
      .take(take)
      .orderBy('supporter.registeredAt', 'DESC')
      .getManyAndCount();
  }

  async update(id: string, updateSupporterDto: UpdateSupporterDto): Promise<Supporter> {
    const supporter = await this.findById(id);
    
    Object.assign(supporter, updateSupporterDto);

    return this.supporterRepository.save(supporter);
  }

  async verify(id: string, verifySupporterDto: VerifySupporterDto, verifiedByUserId: string): Promise<Supporter> {
    const supporter = await this.findById(id);

    supporter.status = verifySupporterDto.status;
    supporter.verificationNotes = verifySupporterDto.notes || '';
    supporter.verifiedByUserId = verifiedByUserId;
    supporter.verifiedAt = new Date();

    return this.supporterRepository.save(supporter);
  }

  async findByIdForRequester(id: string, requester: { id: string; role: UserRole }): Promise<Supporter> {
    const supporter = await this.findById(id);

    if (requester.role === UserRole.SUPERVISOR) {
      await this.assertSupervisorCanAccessSupporter(requester.id, supporter.id);
    }

    return supporter;
  }

  async verifyForRequester(
    id: string,
    verifySupporterDto: VerifySupporterDto,
    requester: { id: string; role: UserRole },
  ): Promise<Supporter> {
    if (requester.role === UserRole.SUPERVISOR) {
      await this.assertSupervisorCanAccessSupporter(requester.id, id);
    }

    return this.verify(id, verifySupporterDto, requester.id);
  }

  async getStatistics() {
    const [total, verified, pending, rejected] = await Promise.all([
      this.supporterRepository.count(),
      this.supporterRepository.count({ where: { status: VerificationStatus.VERIFIED } }),
      this.supporterRepository.count({ where: { status: VerificationStatus.PENDING } }),
      this.supporterRepository.count({ where: { status: VerificationStatus.REJECTED } }),
    ]);

    return {
      total,
      verified,
      pending,
      rejected,
      verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
    };
  }

  async getStatisticsByLocation(state: string, lga?: string) {
    let query = this.supporterRepository.createQueryBuilder('supporter')
      .where('supporter.state = :state', { state });

    if (lga) {
      query = query.andWhere('supporter.lga = :lga', { lga });
    }

    const [total, verified, pending] = await Promise.all([
      query.clone().getCount(),
      query.clone().andWhere('supporter.status = :verified', { verified: VerificationStatus.VERIFIED }).getCount(),
      query.clone().andWhere('supporter.status = :pending', { pending: VerificationStatus.PENDING }).getCount(),
    ]);

    return {
      state,
      lga: lga || null,
      total,
      verified,
      pending,
      verificationRate: total > 0 ? ((verified / total) * 100).toFixed(2) : 0,
    };
  }

  async delete(id: string): Promise<void> {
    const supporter = await this.findById(id);
    await this.supporterRepository.remove(supporter);
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

  private async assertSupervisorCanAccessSupporter(supervisorUserId: string, supporterId: string): Promise<void> {
    const supervisorAgent = await this.findSupervisorAgentByUserId(supervisorUserId);

    const scopedSupporter = await this.supporterRepository
      .createQueryBuilder('supporter')
      .innerJoin(Agent, 'registeredAgent', 'registeredAgent.userId = supporter.registeredByUserId')
      .where('supporter.id = :supporterId', { supporterId })
      .andWhere('registeredAgent.role = :fieldAgentRole', { fieldAgentRole: UserRole.FIELD_AGENT })
      .andWhere('registeredAgent.lga = :supervisorLga', { supervisorLga: supervisorAgent.lga })
      .getOne();

    if (!scopedSupporter) {
      throw new ForbiddenException(
        'You can only access supporters registered by field agents in your local government area',
      );
    }
  }
}
