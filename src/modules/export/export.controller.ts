import {
  Controller,
  Get,
  UseGuards,
  Query,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { ExportService } from './export.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';

@Controller('export')
@UseGuards(JwtAuthGuard, RolesGuard)
export class ExportController {
  constructor(private exportService: ExportService) {}

  @Get('supporters-csv')
  @Roles(UserRole.SUPER_ADMIN)
  async exportSupportersCSV(
    @Res() res: Response,
    @Query('state') state?: string,
    @Query('lga') lga?: string,
    @Query('status') status?: string,
  ) {
    const csv = await this.exportService.exportSupportersCSV({ state, lga, status });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="supporters.csv"');
    res.send(csv);
  }

  @Get('agents-csv')
  @Roles(UserRole.SUPER_ADMIN)
  async exportAgentsCSV(
    @Res() res: Response,
    @Query('state') state?: string,
    @Query('lga') lga?: string,
  ) {
    const csv = await this.exportService.exportAgentsCSV({ state, lga });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="agents.csv"');
    res.send(csv);
  }

  @Get('registrations-csv')
  @Roles(UserRole.SUPER_ADMIN)
  async exportRegistrationsCSV(
    @Res() res: Response,
    @Query('agentId') agentId?: string,
    @Query('status') status?: string,
  ) {
    const csv = await this.exportService.exportRegistrationsCSV({ agentId, status });
    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="registrations.csv"');
    res.send(csv);
  }
}
