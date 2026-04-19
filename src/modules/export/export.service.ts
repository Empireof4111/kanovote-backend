import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Supporter } from '@/entities/supporter.entity';
import { Agent } from '@/entities/agent.entity';
import { Registration } from '@/entities/registration.entity';
import { Parser } from 'json2csv';

@Injectable()
export class ExportService {
  constructor(
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  async exportSupportersCSV(filters?: {
    state?: string;
    lga?: string;
    status?: string;
  }): Promise<string> {
    let query = this.supporterRepository.createQueryBuilder('supporter');

    if (filters?.state) {
      query = query.where('supporter.state = :state', { state: filters.state });
    }

    if (filters?.lga) {
      query = query.andWhere('supporter.lga = :lga', { lga: filters.lga });
    }

    if (filters?.status) {
      query = query.andWhere('supporter.status = :status', { status: filters.status });
    }

    const supporters = await query.getMany();

    const fields = [
      'id',
      'firstName',
      'lastName',
      'email',
      'phone',
      'gender',
      'occupation',
      'state',
      'lga',
      'ward',
      'pollingUnit',
      'voterCardNumber',
      'status',
      'registeredAt',
    ];

    const parser = new Parser({ fields });
    return parser.parse(supporters);
  }

  async exportAgentsCSV(filters?: { state?: string; lga?: string }): Promise<string> {
    let query = this.agentRepository.createQueryBuilder('agent');

    if (filters?.state) {
      query = query.where('agent.state = :state', { state: filters.state });
    }

    if (filters?.lga) {
      query = query.andWhere('agent.lga = :lga', { lga: filters.lga });
    }

    const agents = await query.leftJoinAndSelect('agent.user', 'user').getMany();

    const data = agents.map((agent) => ({
      id: agent.id,
      name: `${agent.user.firstName} ${agent.user.lastName}`,
      email: agent.user.email,
      phone: agent.user.phone,
      role: agent.role,
      state: agent.state,
      lga: agent.lga,
      ward: agent.ward,
      totalRegistrations: agent.totalRegistrations,
      verifiedRegistrations: agent.verifiedRegistrations,
      status: agent.status,
      joinedAt: agent.joinedAt,
    }));

    const fields = [
      'id',
      'name',
      'email',
      'phone',
      'role',
      'state',
      'lga',
      'ward',
      'totalRegistrations',
      'verifiedRegistrations',
      'status',
      'joinedAt',
    ];

    const parser = new Parser({ fields });
    return parser.parse(data);
  }

  async exportRegistrationsCSV(filters?: { agentId?: string; status?: string }): Promise<string> {
    let query = this.registrationRepository.createQueryBuilder('registration');

    if (filters?.agentId) {
      query = query.where('registration.agentId = :agentId', { agentId: filters.agentId });
    }

    if (filters?.status) {
      query = query.andWhere('registration.status = :status', { status: filters.status });
    }

    const registrations = await query
      .leftJoinAndSelect('registration.supporter', 'supporter')
      .leftJoinAndSelect('registration.agent', 'agent')
      .getMany();

    const data = registrations.map((reg) => ({
      id: reg.id,
      supporterName: `${reg.supporter.firstName} ${reg.supporter.lastName}`,
      supporterEmail: reg.supporter.email,
      state: reg.supporter.state,
      lga: reg.supporter.lga,
      status: reg.status,
      completionPercentage: reg.completionPercentage,
      createdAt: reg.createdAt,
      completedAt: reg.completedAt,
    }));

    const fields = [
      'id',
      'supporterName',
      'supporterEmail',
      'state',
      'lga',
      'status',
      'completionPercentage',
      'createdAt',
      'completedAt',
    ];

    const parser = new Parser({ fields });
    return parser.parse(data);
  }
}
