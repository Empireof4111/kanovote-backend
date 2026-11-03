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
  UseInterceptors,
  UploadedFiles,
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { SupporterService } from './supporters.service';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UserRole } from '@/entities/user-role.enum';
import { CreateSupporterDto, UpdateSupporterDto, VerifySupporterDto } from './dto';
import { RegistrationImages, SupporterRegistrationService } from './supporter-registration.service';
import { maxImageBytes } from '../file-upload/image-validation';

@Controller('supporters')
@UseGuards(JwtAuthGuard, RolesGuard)
export class SupporterController {
  constructor(
    private supporterService: SupporterService,
    private registrationService: SupporterRegistrationService,
  ) {}

  @Post('register-with-images')
  @Roles(UserRole.FIELD_AGENT)
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'passport', maxCount: 1 },
    { name: 'voter_card', maxCount: 1 },
  // Multer stops at its limit; allow one extra byte so exactly 5 MB remains
  // valid. The service enforces the inclusive size limit before any writes.
  ], { limits: { fileSize: maxImageBytes() + 1, files: 2 } }))
  @HttpCode(HttpStatus.CREATED)
  async registerWithImages(
    @Request() req: any,
    @Body() dto: CreateSupporterDto,
    @UploadedFiles() files: RegistrationImages,
  ) {
    return this.registrationService.register(dto, req.user.id, files);
  }

  @Post()
  @Roles(UserRole.FIELD_AGENT, UserRole.SUPERVISOR)
  @HttpCode(HttpStatus.CREATED)
  async create(@Request() req: any, @Body() createSupporterDto: CreateSupporterDto) {
    return this.supporterService.create(createSupporterDto, req.user.id);
  }

  @Get()
  @Roles(UserRole.SUPER_ADMIN, UserRole.SUPERVISOR)
  async findAll(
    @Request() req: any,
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
      req.user,
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
  async findById(@Request() req: any, @Param('id') id: string) {
    if (req.user.role === UserRole.SUPER_ADMIN) {
      return this.supporterService.findById(id);
    }

    if (req.user.role === UserRole.SUPERVISOR) {
      return this.supporterService.findByIdForRequester(id, req.user);
    }

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
    return this.supporterService.verifyForRequester(id, verifySupporterDto, req.user);
  }

  @Delete(':id')
  @Roles(UserRole.SUPER_ADMIN)
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string) {
    await this.supporterService.delete(id);
  }
}
