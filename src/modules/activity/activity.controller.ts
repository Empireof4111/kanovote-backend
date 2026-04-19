import {
  Controller,
  Get,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ActivityService } from './activity.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';
import { ActivityAction } from '@/entities/activity-log.entity';

@Controller('activity')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ActivityController {
  constructor(private activityService: ActivityService) {}

  @Get('recent')
  @Roles(UserRole.SUPER_ADMIN)
  async getRecentActivity(@Query('limit') limit: string = '20') {
    return this.activityService.getRecentActivity(parseInt(limit));
  }

  @Get('audit-log')
  @Roles(UserRole.SUPER_ADMIN)
  async getAuditLog(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
    @Query('userId') userId?: string,
    @Query('action') action?: ActivityAction,
  ) {
    const [logs, total] = await this.activityService.getAuditLog(
      parseInt(skip),
      parseInt(take),
      { userId, action },
    );
    return { logs, total };
  }

  @Get('user/:userId')
  @Roles(UserRole.SUPER_ADMIN)
  async findByUser(
    @Param('userId') userId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    const [logs, total] = await this.activityService.findByUser(userId, parseInt(skip), parseInt(take));
    return { logs, total };
  }

  @Get('entity/:entityType/:entityId')
  @Roles(UserRole.SUPER_ADMIN)
  async findByEntity(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.activityService.findByEntity(entityType, entityId);
  }
}
