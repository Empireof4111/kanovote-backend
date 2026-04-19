import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Body,
  UseGuards,
  Query,
  HttpCode,
  HttpStatus,
  Request,
} from '@nestjs/common';
import { SupporterService } from './supporters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';

@Controller('supporters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupporterController {
  constructor(private supporterService: SupporterService) {}

  @Post()
  @Roles(UserRole.FIELD_AGENT, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() createSupporterDto: CreateSupporterDto) {
    return this.supporterService.create(createSupporterDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async findAll(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
    @Query('state') state?: string,
    @Query('lga') lga?: string,
    @Query('status') status?: string,
    @Query('search') search?: string,
  ) {
    const [supporters, total] = await this.supporterService.findAll(
      parseInt(skip),
      parseInt(take),
      { state, lga, status: status as any, search },
    );
    return { supporters, total };
  }

  @Get('statistics')
  @Roles(UserRole.SUPER_ADMIN)
  async getStatistics() {
    return this.supporterService.getStatistics();
  }

  @Get('statistics/:state')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async getStatisticsByLocation(
    @Param('state') state: string,
    @Query('lga') lga?: string,
  ) {
    return this.supporterService.getStatisticsByLocation(state, lga);
  }

  @Get(':id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async findById(@Param('id') id: string) {
    return this.supporterService.findById(id);
  }

  @Put(':id')
  @Roles(UserRole.FIELD_AGENT, UserRole.SUPERVISOR)
  async update(@Param('id') id: string, @Body() updateSupporterDto: UpdateSupporterDto) {
    return this.supporterService.update(id, updateSupporterDto);
  }

  @Put(':id/verify')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async verify(@Request() req: any, @Param('id') id: string, @Body() verifySupporterDto: VerifySupporterDto) {
    return this.supporterService.verify(id, verifySupporterDto, req.user.id);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.supporterService.delete(id);
  }
}
