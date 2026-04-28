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
    const registrationCounts = await this.registrationRepository
      .createQueryBuilder('registration')
      .select('registration.agentId', 'agentId')
      .addSelect('COUNT(registration.id)', 'totalRegistrations')
      .addSelect(
        "COUNT(CASE WHEN registration.status = 'verified' THEN 1 END)",
        'verifiedRegistrations',
      )
      .addSelect(
        "COUNT(CASE WHEN registration.status IN ('initiated', 'in_progress', 'completed') THEN 1 END)",
        'pendingRegistrations',
      )
      .addSelect(
        "COUNT(CASE WHEN registration.status = 'rejected' THEN 1 END)",
        'rejectedRegistrations',
      )
      .groupBy('registration.agentId')
      .getRawMany();

    const countsByAgentId = new Map(
      registrationCounts.map((row) => [
        row.agentId,
        {
          totalRegistrations: Number(row.totalRegistrations || 0),
          verifiedRegistrations: Number(row.verifiedRegistrations || 0),
          pendingRegistrations: Number(row.pendingRegistrations || 0),
          rejectedRegistrations: Number(row.rejectedRegistrations || 0),
        },
      ]),
    );

    const data = agents.map((agent) => ({
      ...(countsByAgentId.get(agent.id) || {
        totalRegistrations: 0,
        verifiedRegistrations: 0,
        pendingRegistrations: 0,
        rejectedRegistrations: 0,
      }),
      id: agent.id,
      name: `${agent.user.firstName} ${agent.user.lastName}`,
      email: agent.user.email,
      phone: agent.user.phone,
      role: agent.role,
      state: agent.state,
      lga: agent.lga,
      ward: agent.ward,
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
      'pendingRegistrations',
      'rejectedRegistrations',
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
