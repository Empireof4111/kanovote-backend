import {
  Controller,
  Get,
  Post,
  Put,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { RegistrationService } from './registrations.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user.entity';
import { RegistrationStatus } from '@/entities/registration.entity';

@Controller('registrations')
@UseGuards(JwtAuthGuard, RolesGuard)
export class RegistrationController {
  constructor(private registrationService: RegistrationService) {}

  @Post()
  @Roles(UserRole.FIELD_AGENT)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() { agentId, supporterId }: { agentId: string; supporterId: string }) {
    return this.registrationService.create(agentId, supporterId);
  }

  @Get('statistics')
  @Roles(UserRole.SUPER_ADMIN)
  async getStatistics() {
    return this.registrationService.getRegistrationStats();
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async findById(@Param('id') id: string) {
    return this.registrationService.findById(id);
  }

  @Get('agent/:agentId')
  @Roles(UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async findByAgent(
    @Param('agentId') agentId: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
  ) {
    const [registrations, total] = await this.registrationService.findByAgentId(
      agentId,
      parseInt(skip),
      parseInt(take),
    );
    return { registrations, total };
  }

  @Get('supporter/:supporterId')
  @Roles(UserRole.SUPER_ADMIN)
  async findBySupporter(@Param('supporterId') supporterId: string) {
    return this.registrationService.findBySupporterId(supporterId);
  }

  @Put(':id/status')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async updateStatus(
    @Param('id') id: string,
    @Body() { status }: { status: RegistrationStatus },
  ) {
    return this.registrationService.updateStatus(id, status);
  }
}
