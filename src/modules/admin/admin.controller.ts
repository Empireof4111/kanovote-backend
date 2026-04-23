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
import { AdminService } from './admin.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';
import {
  CreateLgaDto,
  CreateWardDto,
  CreatePollingUnitDto,
  UpdateLgaDto,
  UpdateWardDto,
  UpdatePollingUnitDto,
  UpdateUserRoleDto,
} from './dto';

@Controller('admin')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(UserRole.SUPER_ADMIN)
export class AdminController {
  constructor(private adminService: AdminService) {}

  // DASHBOARD & STATS
  @Get('dashboard')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getDashboard(@Request() req: any) {
    return this.adminService.getDashboardStats(req.user);
  }

  // USER MANAGEMENT
  @Get('users')
  async getAllUsers(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '10',
    @Query('role') role?: UserRole,
  ) {
    const [users, total] = await this.adminService.getAllUsers(parseInt(skip), parseInt(take), role);
    return { users, total };
  }

  @Get('users/stats')
  async getUserStats() {
    return this.adminService.getUserStats();
  }

  @Put('users/:id/role')
  @HttpCode(HttpStatus.OK)
  async updateUserRole(@Param('id') userId: string, @Body() updateUserRoleDto: UpdateUserRoleDto) {
    return this.adminService.updateUserRole(userId, updateUserRoleDto);
  }

  @Put('users/:id/block')
  @HttpCode(HttpStatus.OK)
  async blockUser(@Param('id') userId: string) {
    return this.adminService.blockUser(userId);
  }

  @Put('users/:id/unblock')
  @HttpCode(HttpStatus.OK)
  async unblockUser(@Param('id') userId: string) {
    return this.adminService.unblockUser(userId);
  }

  // AGENT STATS
  @Get('agents/stats')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getAgentStats() {
    return this.adminService.getAgentStats();
  }

  // LOCAL GOVERNMENT AREA (LGA) MANAGEMENT
  @Post('locations/lga')
  @HttpCode(HttpStatus.CREATED)
  async createLga(@Body() createLgaDto: CreateLgaDto) {
    return this.adminService.createLga(createLgaDto);
  }

  @Get('locations/lga')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getAllLgas(
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const [lgas, total] = await this.adminService.getAllLgas(parseInt(skip), parseInt(take));
    return { lgas, total };
  }

  @Get('locations/lga/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getLgaById(@Param('id') id: string) {
    return this.adminService.getLgaById(id);
  }

  @Put('locations/lga/:id')
  @HttpCode(HttpStatus.OK)
  async updateLga(@Param('id') id: string, @Body() updateLgaDto: UpdateLgaDto) {
    return this.adminService.updateLga(id, updateLgaDto);
  }

  @Delete('locations/lga/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteLga(@Param('id') id: string) {
    await this.adminService.deleteLga(id);
  }

  // WARD MANAGEMENT
  @Post('locations/ward')
  @HttpCode(HttpStatus.CREATED)
  async createWard(@Body() createWardDto: CreateWardDto) {
    return this.adminService.createWard(createWardDto);
  }

  @Get('locations/ward')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getAllWards(
    @Query('lgaId') lgaId?: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const [wards, total] = await this.adminService.getAllWards(lgaId, parseInt(skip), parseInt(take));
    return { wards, total };
  }

  @Get('locations/ward/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getWardById(@Param('id') id: string) {
    return this.adminService.getWardById(id);
  }

  @Put('locations/ward/:id')
  @HttpCode(HttpStatus.OK)
  async updateWard(@Param('id') id: string, @Body() updateWardDto: UpdateWardDto) {
    return this.adminService.updateWard(id, updateWardDto);
  }

  @Delete('locations/ward/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deleteWard(@Param('id') id: string) {
    await this.adminService.deleteWard(id);
  }

  // POLLING UNIT MANAGEMENT
  @Post('locations/polling-unit')
  @HttpCode(HttpStatus.CREATED)
  async createPollingUnit(@Body() createPollingUnitDto: CreatePollingUnitDto) {
    return this.adminService.createPollingUnit(createPollingUnitDto);
  }

  @Get('locations/polling-unit')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getAllPollingUnits(
    @Query('wardId') wardId?: string,
    @Query('lgaId') lgaId?: string,
    @Query('skip') skip: string = '0',
    @Query('take') take: string = '100',
  ) {
    const [pollingUnits, total] = await this.adminService.getAllPollingUnits(
      wardId,
      lgaId,
      parseInt(skip),
      parseInt(take),
    );
    return { pollingUnits, total };
  }

  @Get('locations/polling-unit/:id')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getPollingUnitById(@Param('id') id: string) {
    return this.adminService.getPollingUnitById(id);
  }

  @Put('locations/polling-unit/:id')
  @HttpCode(HttpStatus.OK)
  async updatePollingUnit(@Param('id') id: string, @Body() updatePollingUnitDto: UpdatePollingUnitDto) {
    return this.adminService.updatePollingUnit(id, updatePollingUnitDto);
  }

  @Delete('locations/polling-unit/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async deletePollingUnit(@Param('id') id: string) {
    await this.adminService.deletePollingUnit(id);
  }

  // GET LOCATION HIERARCHY
  @Get('locations/hierarchy')
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async getLocationHierarchy() {
    return this.adminService.getLocationHierarchy();
  }
}
