import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import { Supporter, VerificationStatus } from '@/entities/supporter.entity';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';

@Injectable()
export class SupporterService {
  constructor(
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
  ) {}

  async create(createSupporterDto: CreateSupporterDto, registeredByUserId: string): Promise<Supporter> {
    // Check if supporter with same email or voter card already exists
    const existingSupporter = await this.supporterRepository.findOne({
      where: [
        { email: createSupporterDto.email },
        { voterCardNumber: createSupporterDto.voterCardNumber },
      ],
    });

    if (existingSupporter) {
      throw new BadRequestException('Supporter with this email or voter card number already exists');
    }

    const supporter = this.supporterRepository.create({
      ...createSupporterDto,
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
  ) {
    const query = this.supporterRepository.createQueryBuilder('supporter');

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
        '(supporter.firstName ILIKE :search OR supporter.lastName ILIKE :search OR supporter.email ILIKE :search)',
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
}
