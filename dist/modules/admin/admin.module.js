"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdminModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const user_entity_1 = require("../../entities/user.entity");
const agent_entity_1 = require("../../entities/agent.entity");
const lga_entity_1 = require("../../entities/lga.entity");
const ward_entity_1 = require("../../entities/ward.entity");
const polling_unit_entity_1 = require("../../entities/polling-unit.entity");
const supporter_entity_1 = require("../../entities/supporter.entity");
const registration_entity_1 = require("../../entities/registration.entity");
const admin_service_1 = require("./admin.service");
const admin_controller_1 = require("./admin.controller");
let AdminModule = class AdminModule {
};
exports.AdminModule = AdminModule;
exports.AdminModule = AdminModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([
                user_entity_1.User,
                agent_entity_1.Agent,
                lga_entity_1.LocalGovernmentArea,
                ward_entity_1.Ward,
                polling_unit_entity_1.PollingUnit,
                supporter_entity_1.Supporter,
                registration_entity_1.Registration,
            ]),
        ],
        providers: [admin_service_1.AdminService],
        controllers: [admin_controller_1.AdminController],
        exports: [admin_service_1.AdminService],
    })
], AdminModule);
//# sourceMappingURL=admin.module.js.map