"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const bcrypt = __importStar(require("bcryptjs"));
const database_1 = require("../database");
const user_entity_1 = require("../entities/user.entity");
const user_role_enum_1 = require("../entities/user-role.enum");
function getArgValue(name) {
    const arg = process.argv.find((item) => item.startsWith(`${name}=`));
    if (arg) {
        return arg.slice(name.length + 1);
    }
    const index = process.argv.indexOf(name);
    if (index >= 0) {
        return process.argv[index + 1];
    }
    return undefined;
}
function requireArg(name) {
    const value = getArgValue(name)?.trim();
    if (!value) {
        throw new Error(`Missing ${name} argument. Example: npx ts-node -r tsconfig-paths/register src/scripts/create-admin.ts ${name}=value`);
    }
    return value;
}
async function main() {
    const firstName = requireArg('--firstName');
    const lastName = requireArg('--lastName');
    const email = requireArg('--email').toLowerCase();
    const username = requireArg('--username');
    const phone = requireArg('--phone');
    const password = requireArg('--password');
    await database_1.AppDataSource.initialize();
    const userRepository = database_1.AppDataSource.getRepository(user_entity_1.User);
    try {
        const existingByEmail = await userRepository.findOne({ where: { email } });
        if (existingByEmail) {
            throw new Error(`A user with email "${email}" already exists.`);
        }
        const existingByUsername = await userRepository.findOne({
            where: { username },
        });
        if (existingByUsername) {
            throw new Error(`A user with username "${username}" already exists.`);
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = userRepository.create({
            firstName,
            lastName,
            email,
            username,
            phone,
            password: hashedPassword,
            role: user_role_enum_1.UserRole.SUPER_ADMIN,
            isActive: true,
            isEmailVerified: true,
            emailVerifiedAt: new Date(),
        });
        const savedUser = await userRepository.save(user);
        console.log('Super admin created successfully.');
        console.log(JSON.stringify({
            id: savedUser.id,
            firstName: savedUser.firstName,
            lastName: savedUser.lastName,
            email: savedUser.email,
            username: savedUser.username,
            role: savedUser.role,
        }, null, 2));
    }
    finally {
        if (database_1.AppDataSource.isInitialized) {
            await database_1.AppDataSource.destroy();
        }
    }
}
main().catch((error) => {
    console.error(error instanceof Error ? error.message : error);
    process.exit(1);
});
//# sourceMappingURL=create-admin.js.map