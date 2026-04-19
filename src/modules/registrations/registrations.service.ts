import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Registration, RegistrationStatus } from '@/entities/registration.entity';

@Injectable()
export class RegistrationService {
  constructor(
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  async create(agentId: string, supporterId: string): Promise<Registration> {
    const registration = this.registrationRepository.create({
      agentId,
      supporterId,
      status: RegistrationStatus.INITIATED,
    });

    return this.registrationRepository.save(registration);
  }

  async findById(id: string): Promise<Registration> {
    const registration = await this.registrationRepository.findOne({
      where: { id },
      relations: ['agent', 'supporter'],
    });

    if (!registration) {
      throw new NotFoundException('Registration not found');
    }

    return registration;
  }

  async findByAgentId(agentId: string, skip = 0, take = 10) {
    return this.registrationRepository.findAndCount({
      where: { agentId },
      relations: ['supporter'],
      skip,
      take,
      order: { createdAt: 'DESC' },
    });
  }

  async findBySupporterId(supporterId: string) {
    return this.registrationRepository.find({
      where: { supporterId },
      relations: ['agent'],
    });
  }

  async updateStatus(id: string, status: RegistrationStatus): Promise<Registration> {
    const registration = await this.findById(id);

    registration.status = status;

    if (status === RegistrationStatus.COMPLETED) {
      registration.completedAt = new Date();
      registration.completionPercentage = 100;
    }

    if (status === RegistrationStatus.VERIFIED) {
      registration.verifiedAt = new Date();
    }

    return this.registrationRepository.save(registration);
  }

  async getRegistrationStats() {
    const [total, initiated, inProgress, completed, verified, rejected] = await Promise.all([
      this.registrationRepository.count(),
      this.registrationRepository.count({ where: { status: RegistrationStatus.INITIATED } }),
      this.registrationRepository.count({ where: { status: RegistrationStatus.IN_PROGRESS } }),
      this.registrationRepository.count({ where: { status: RegistrationStatus.COMPLETED } }),
      this.registrationRepository.count({ where: { status: RegistrationStatus.VERIFIED } }),
      this.registrationRepository.count({ where: { status: RegistrationStatus.REJECTED } }),
    ]);

    return {
      total,
      initiated,
      inProgress,
      completed,
      verified,
      rejected,
    };
  }
}
