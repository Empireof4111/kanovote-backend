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
import { AgentService } from './agents.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user.entity';
import { CreateAgentDto, UpdateAgentDto, AgentPerformanceDto, RegisterAgentDto, ResetPasswordDto } from './dto';

@Controller('agents')
export class AgentController {
  constructor(private agentService: AgentService) {}

  // Register new agent (with user creation) - accessible without auth
  @Post('register')
  @HttpCode(HttpStatus.CREATED)
  async registerAgent(@Body() registerAgentDto: RegisterAgentDto) {
    const result = await this.agentService.registerAgent(registerAgentDto);
    // Don't return the password hash
    const { password, ...userWithoutPassword } = result.user;
    return { agent: result.agent, user: userWithoutPassword };
  }

  // Create agent from existing user - only Super Admin
  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.CREATED)
  async create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentService.create(createAgentDto);
  }

  // Get all agents - Super Admin and Supervisor
  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async findAll(@Query() query: AgentPerformanceDto) {
    const skip = query.skip || 0;
    const take = query.take || 10;
    const [agents, total] = await this.agentService.findAll(skip, take, query);
    return { agents, total };
  }

  // Get agent by user ID
  @Get('user/:userId')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR, UserRole.FIELD_AGENT)
  async findByUserId(@Param('userId') userId: string) {
    return this.agentService.findByUserId(userId);
  }

  // Get specific agent by ID
  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async findById(@Param('id') id: string) {
    return this.agentService.findById(id);
  }

  // Get agent performance report
  @Get(':id/performance')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async getPerformanceReport(@Param('id') id: string) {
    return this.agentService.getPerformanceReport(id);
  }

  // Update agent details
  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async update(@Param('id') id: string, @Body() updateAgentDto: UpdateAgentDto) {
    return this.agentService.update(id, updateAgentDto);
  }

  // Reset agent password - Super Admin only
  @Put(':id/reset-password')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.OK)
  async resetPassword(@Param('id') id: string, @Body() resetPasswordDto: ResetPasswordDto) {
    // Get agent to get userId
    const agent = await this.agentService.findById(id);
    await this.agentService.resetPassword(agent.userId, resetPasswordDto);
    return { message: 'Password reset successfully' };
  }

  // Activate agent
  @Put(':id/activate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async activate(@Param('id') id: string) {
    return this.agentService.activate(id);
  }

  // Deactivate agent
  @Put(':id/deactivate')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async deactivate(@Param('id') id: string) {
    return this.agentService.deactivate(id);
  }

  // Suspend agent
  @Put(':id/suspend')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  async suspend(@Param('id') id: string) {
    return this.agentService.suspend(id);
  }

  // Delete agent
  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.agentService.delete(id);
  }
}
