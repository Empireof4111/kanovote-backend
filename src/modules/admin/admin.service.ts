import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User, UserRole } from '@/entities/user.entity';
import { Agent, AgentStatus } from '@/entities/agent.entity';
import { LocalGovernmentArea } from '@/entities/lga.entity';
import { Ward } from '@/entities/ward.entity';
import { PollingUnit } from '@/entities/polling-unit.entity';
import { Supporter } from '@/entities/supporter.entity';
import { Registration } from '@/entities/registration.entity';
import {
  CreateLgaDto,
  CreateWardDto,
  CreatePollingUnitDto,
  UpdateLgaDto,
  UpdateWardDto,
  UpdatePollingUnitDto,
  UpdateUserRoleDto,
} from './dto';

@Injectable()
export class AdminService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Agent)
    private agentRepository: Repository<Agent>,
    @InjectRepository(LocalGovernmentArea)
    private lgaRepository: Repository<LocalGovernmentArea>,
    @InjectRepository(Ward)
    private wardRepository: Repository<Ward>,
    @InjectRepository(PollingUnit)
    private pollingUnitRepository: Repository<PollingUnit>,
    @InjectRepository(Supporter)
    private supporterRepository: Repository<Supporter>,
    @InjectRepository(Registration)
    private registrationRepository: Repository<Registration>,
  ) {}

  // USER MANAGEMENT
  async getAllUsers(skip = 0, take = 10, role?: UserRole) {
    let query = this.userRepository.createQueryBuilder('user');

    if (role) {
      query = query.where('user.role = :role', { role });
    }

    return query
      .skip(skip)
      .take(take)
      .orderBy('user.createdAt', 'DESC')
      .getManyAndCount();
  }

  async getUserStats() {
    const [total, superAdmins, supervisors, fieldAgents] = await Promise.all([
      this.userRepository.count(),
      this.userRepository.count({ where: { role: UserRole.SUPER_ADMIN } }),
      this.userRepository.count({ where: { role: UserRole.SUPERVISOR } }),
      this.userRepository.count({ where: { role: UserRole.FIELD_AGENT } }),
    ]);

    return {
      total,
      superAdmins,
      supervisors,
      fieldAgents,
    };
  }

  async updateUserRole(userId: string, updateUserRoleDto: UpdateUserRoleDto): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.role = updateUserRoleDto.role;
    return this.userRepository.save(user);
  }

  async blockUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = false;
    return this.userRepository.save(user);
  }

  async unblockUser(userId: string): Promise<User> {
    const user = await this.userRepository.findOne({ where: { id: userId } });

    if (!user) {
      throw new NotFoundException('User not found');
    }

    user.isActive = true;
    return this.userRepository.save(user);
  }

  // AGENT STATS
  async getAgentStats() {
    const [total, active, inactive, suspended] = await Promise.all([
      this.agentRepository.count(),
      this.agentRepository.count({ where: { status: AgentStatus.ACTIVE } }),
      this.agentRepository.count({ where: { status: AgentStatus.INACTIVE } }),
      this.agentRepository.count({ where: { status: AgentStatus.SUSPENDED } }),
    ]);

    return {
      total,
      active,
      inactive,
      suspended,
    };
  }

  // LOCAL GOVERNMENT AREA (LGA) MANAGEMENT
  async createLga(createLgaDto: CreateLgaDto): Promise<LocalGovernmentArea> {
    // Check if LGA with this code already exists
    const existingLga = await this.lgaRepository.findOne({
      where: { code: createLgaDto.code },
    });

    if (existingLga) {
      throw new ConflictException('LGA with this code already exists');
    }

    const lga = this.lgaRepository.create(createLgaDto);
    return this.lgaRepository.save(lga);
  }

  async getAllLgas(skip = 0, take = 100): Promise<[LocalGovernmentArea[], number]> {
    return this.lgaRepository.findAndCount({
      skip,
      take,
      relations: ['wards'],
      order: { name: 'ASC' },
    });
  }

  async getLgaById(id: string): Promise<LocalGovernmentArea> {
    const lga = await this.lgaRepository.findOne({
      where: { id },
      relations: ['wards'],
    });

    if (!lga) {
      throw new NotFoundException('LGA not found');
    }

    return lga;
  }

  async updateLga(id: string, updateLgaDto: UpdateLgaDto): Promise<LocalGovernmentArea> {
    const lga = await this.getLgaById(id);

    // Check if new code conflicts with existing LGA
    if (updateLgaDto.code && updateLgaDto.code !== lga.code) {
      const existingLga = await this.lgaRepository.findOne({
        where: { code: updateLgaDto.code },
      });
      if (existingLga) {
        throw new ConflictException('LGA with this code already exists');
      }
    }

    Object.assign(lga, updateLgaDto);
    return this.lgaRepository.save(lga);
  }

  async deleteLga(id: string): Promise<void> {
    const lga = await this.getLgaById(id);
    await this.lgaRepository.remove(lga);
  }

  // WARD MANAGEMENT
  async createWard(createWardDto: CreateWardDto): Promise<Ward> {
    // Verify LGA exists
    const lga = await this.getLgaById(createWardDto.lgaId);

    // Check if Ward with this code already exists in this LGA
    const existingWard = await this.wardRepository.findOne({
      where: {
        lgaId: createWardDto.lgaId,
        code: createWardDto.code,
      },
    });

    if (existingWard) {
      throw new ConflictException('Ward with this code already exists in this LGA');
    }

    const ward = this.wardRepository.create({
      ...createWardDto,
      lga,
    });
    return this.wardRepository.save(ward);
  }

  async getAllWards(lgaId?: string, skip = 0, take = 100): Promise<[Ward[], number]> {
    let query = this.wardRepository.createQueryBuilder('ward');

    if (lgaId) {
      query = query.where('ward.lgaId = :lgaId', { lgaId });
    }

    return query
      .leftJoinAndSelect('ward.lga', 'lga')
      .skip(skip)
      .take(take)
      .orderBy('ward.name', 'ASC')
      .getManyAndCount();
  }

  async getWardById(id: string): Promise<Ward> {
    const ward = await this.wardRepository.findOne({
      where: { id },
      relations: ['lga', 'pollingUnits'],
    });

    if (!ward) {
      throw new NotFoundException('Ward not found');
    }

    return ward;
  }

  async updateWard(id: string, updateWardDto: UpdateWardDto): Promise<Ward> {
    const ward = await this.getWardById(id);

    // Check if new code conflicts with existing Ward in same LGA
    if (updateWardDto.code && updateWardDto.code !== ward.code) {
      const existingWard = await this.wardRepository.findOne({
        where: {
          lgaId: ward.lgaId,
          code: updateWardDto.code,
        },
      });
      if (existingWard) {
        throw new ConflictException('Ward with this code already exists in this LGA');
      }
    }

    Object.assign(ward, updateWardDto);
    return this.wardRepository.save(ward);
  }

  async deleteWard(id: string): Promise<void> {
    const ward = await this.getWardById(id);
    await this.wardRepository.remove(ward);
  }

  // POLLING UNIT MANAGEMENT
  async createPollingUnit(createPollingUnitDto: CreatePollingUnitDto): Promise<PollingUnit> {
    // Verify Ward and LGA exist
    const ward = await this.getWardById(createPollingUnitDto.wardId);
    const lga = await this.getLgaById(createPollingUnitDto.lgaId);

    // Check if code already exists
    const existingPu = await this.pollingUnitRepository.findOne({
      where: { code: createPollingUnitDto.code },
    });

    if (existingPu) {
      throw new ConflictException('Polling Unit with this code already exists');
    }

    const pollingUnit = this.pollingUnitRepository.create({
      ...createPollingUnitDto,
      ward,
      lga,
    });
    return this.pollingUnitRepository.save(pollingUnit);
  }

  async getAllPollingUnits(
    wardId?: string,
    lgaId?: string,
    skip = 0,
    take = 100,
  ): Promise<[PollingUnit[], number]> {
    let query = this.pollingUnitRepository.createQueryBuilder('pu');

    if (wardId) {
      query = query.where('pu.wardId = :wardId', { wardId });
    }

    if (lgaId) {
      query = query.andWhere('pu.lgaId = :lgaId', { lgaId });
    }

    return query
      .leftJoinAndSelect('pu.ward', 'ward')
      .leftJoinAndSelect('pu.lga', 'lga')
      .skip(skip)
      .take(take)
      .orderBy('pu.name', 'ASC')
      .getManyAndCount();
  }

  async getPollingUnitById(id: string): Promise<PollingUnit> {
    const pu = await this.pollingUnitRepository.findOne({
      where: { id },
      relations: ['ward', 'lga'],
    });

    if (!pu) {
      throw new NotFoundException('Polling Unit not found');
    }

    return pu;
  }

  async updatePollingUnit(id: string, updatePollingUnitDto: UpdatePollingUnitDto): Promise<PollingUnit> {
    const pu = await this.getPollingUnitById(id);

    // Check if new code conflicts
    if (updatePollingUnitDto.code && updatePollingUnitDto.code !== pu.code) {
      const existingPu = await this.pollingUnitRepository.findOne({
        where: { code: updatePollingUnitDto.code },
      });
      if (existingPu) {
        throw new ConflictException('Polling Unit with this code already exists');
      }
    }

    Object.assign(pu, updatePollingUnitDto);
    return this.pollingUnitRepository.save(pu);
  }

  async deletePollingUnit(id: string): Promise<void> {
    const pu = await this.getPollingUnitById(id);
    await this.pollingUnitRepository.remove(pu);
  }

  // SUPPORTER STATS
  async getSupporterStats() {
    const [total, verified, pending, rejected] = await Promise.all([
      this.supporterRepository.count(),
      this.registrationRepository.count({ where: { status: 'verified' } }),
      this.registrationRepository.count({ where: { status: 'pending' } }),
      this.registrationRepository.count({ where: { status: 'rejected' } }),
    ]);

    return {
      total,
      verified,
      pending,
      rejected,
    };
  }

  // DASHBOARD STATS
  async getDashboardStats() {
    const [userStats, agentStats, supporterStats, lgaCount, wardCount, puCount] = await Promise.all([
      this.getUserStats(),
      this.getAgentStats(),
      this.getSupporterStats(),
      this.lgaRepository.count(),
      this.wardRepository.count(),
      this.pollingUnitRepository.count(),
    ]);

    return {
      users: userStats,
      agents: agentStats,
      supporters: supporterStats,
      geography: {
        lgas: lgaCount,
        wards: wardCount,
        pollingUnits: puCount,
      },
    };
  }

  // GET LOCATION DATA IN HIERARCHICAL FORMAT
  async getLocationHierarchy() {
    const lgas = await this.lgaRepository.find({
      relations: ['wards'],
      order: { name: 'ASC' },
    });

    const wards = await this.wardRepository.find({
      relations: ['lga', 'pollingUnits'],
      order: { name: 'ASC' },
    });

    const pollingUnits = await this.pollingUnitRepository.find({
      relations: ['ward', 'lga'],
      order: { name: 'ASC' },
    });

    return {
      lgas,
      wards,
      pollingUnits,
    };
  }
}
