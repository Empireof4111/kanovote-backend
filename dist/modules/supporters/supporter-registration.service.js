"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var SupporterRegistrationService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SupporterRegistrationService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("typeorm");
const agent_entity_1 = require("../../entities/agent.entity");
const file_upload_entity_1 = require("../../entities/file-upload.entity");
const registration_entity_1 = require("../../entities/registration.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const user_role_enum_1 = require("../../entities/user-role.enum");
const file_upload_service_1 = require("../file-upload/file-upload.service");
const image_validation_1 = require("../file-upload/image-validation");
const supporters_service_1 = require("./supporters.service");
let SupporterRegistrationService = SupporterRegistrationService_1 = class SupporterRegistrationService {
    constructor(dataSource, supporters, uploads) {
        this.dataSource = dataSource;
        this.supporters = supporters;
        this.uploads = uploads;
        this.logger = new common_1.Logger(SupporterRegistrationService_1.name);
    }
    async register(dto, userId, files) {
        const passport = files?.passport?.[0];
        const voterCard = files?.voter_card?.[0];
        if (!passport || !voterCard) {
            throw new common_1.BadRequestException('Both passport photo and voter card image are required');
        }
        // Validate both before creating any row or uploading either file.
        (0, image_validation_1.validateImage)(passport);
        (0, image_validation_1.validateImage)(voterCard);
        const uploaded = [];
        try {
            return await this.dataSource.transaction(async (manager) => {
                const agent = await manager.getRepository(agent_entity_1.Agent).findOne({
                    where: { userId, role: user_role_enum_1.UserRole.FIELD_AGENT, status: agent_entity_1.AgentStatus.ACTIVE },
                });
                if (!agent)
                    throw new common_1.ForbiddenException('An active field-agent profile is required');
                const supporter = await this.supporters.create(dto, userId, manager.getRepository(supporter_entity_1.Supporter));
                uploaded.push(await this.uploads.uploadImageToStorage(passport, supporter.id));
                uploaded.push(await this.uploads.uploadImageToStorage(voterCard, supporter.id));
                const fileRepository = manager.getRepository(file_upload_entity_1.FileUpload);
                await fileRepository.save(uploaded.map((image, index) => fileRepository.create({
                    ...image,
                    supporterId: supporter.id,
                    uploadedByUserId: userId,
                    fileType: index === 0 ? file_upload_entity_1.FileType.PASSPORT : file_upload_entity_1.FileType.VOTER_CARD,
                })));
                supporter.documentUploaded = true;
                supporter.documentUrl = uploaded[0].url;
                await manager.getRepository(supporter_entity_1.Supporter).save(supporter);
                const registrationRepository = manager.getRepository(registration_entity_1.Registration);
                await registrationRepository.save(registrationRepository.create({
                    agentId: agent.id,
                    supporterId: supporter.id,
                    status: registration_entity_1.RegistrationStatus.COMPLETED,
                    completionPercentage: 100,
                    completedAt: new Date(),
                }));
                return supporter;
            });
        }
        catch (error) {
            // A failed upload or database write rolls back all member rows. Remove any
            // images already stored, without hiding the original error if cleanup fails.
            const cleanup = await Promise.allSettled(uploaded.map((image) => this.uploads.deleteStoredImage(image.filePath)));
            cleanup.forEach((result, index) => {
                if (result.status === 'rejected') {
                    this.logger.error(`Could not remove abandoned registration image ${uploaded[index].filePath}`);
                }
            });
            throw error;
        }
    }
};
exports.SupporterRegistrationService = SupporterRegistrationService;
exports.SupporterRegistrationService = SupporterRegistrationService = SupporterRegistrationService_1 = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [typeorm_1.DataSource,
        supporters_service_1.SupporterService,
        file_upload_service_1.FileUploadService])
], SupporterRegistrationService);
//# sourceMappingURL=supporter-registration.service.js.map