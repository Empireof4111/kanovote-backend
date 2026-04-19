import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ActivityLog, ActivityAction } from '@/entities/activity-log.entity';

@Injectable()
export class ActivityService {
  constructor(
    @InjectRepository(ActivityLog)
    private activityRepository: Repository<ActivityLog>,
  ) {}

  async log(
    userId: string,
    action: ActivityAction,
    entityType?: string,
    entityId?: string,
    details?: string,
    ipAddress?: string,
    userAgent?: string,
  ): Promise<ActivityLog> {
    const log = this.activityRepository.create({
      userId,
      action,
      entityType,
      entityId,
      details,
      ipAddress,
      userAgent,
    });

    return this.activityRepository.save(log);
  }

  async findByUser(userId: string, skip = 0, take = 10) {
    return this.activityRepository.findAndCount({
      where: { userId },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByAction(action: ActivityAction, skip = 0, take = 10) {
    return this.activityRepository.findAndCount({
      where: { action },
      skip,
      take,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async findByEntity(entityType: string, entityId: string) {
    return this.activityRepository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getRecentActivity(limit = 20) {
    return this.activityRepository.find({
      take: limit,
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }

  async getAuditLog(skip = 0, take = 10, filters?: { userId?: string; action?: ActivityAction }) {
    let query = this.activityRepository.createQueryBuilder('log');

    if (filters?.userId) {
      query = query.where('log.userId = :userId', { userId: filters.userId });
    }

    if (filters?.action) {
      query = query.andWhere('log.action = :action', { action: filters.action });
    }

    return query
      .leftJoinAndSelect('log.user', 'user')
      .skip(skip)
      .take(take)
      .orderBy('log.createdAt', 'DESC')
      .getManyAndCount();
  }
}
