"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.maxImageBytes = maxImageBytes;
exports.validateImage = validateImage;
const common_1 = require("@nestjs/common");
function maxImageBytes() {
    const configured = Number(process.env.MAX_FILE_SIZE);
    return Number.isSafeInteger(configured) && configured > 0 ? configured : 5 * 1024 * 1024;
}
function validateImage(file) {
    if (!file || file.size <= 0) {
        throw new common_1.BadRequestException('A non-empty image is required');
    }
    if (file.size > maxImageBytes()) {
        throw new common_1.BadRequestException(`Image exceeds the maximum size of ${maxImageBytes() / 1024 / 1024} MB`);
    }
    if (!['image/jpeg', 'image/png'].includes(file.mimetype)) {
        throw new common_1.BadRequestException('Invalid file type. Only JPEG and PNG images are allowed');
    }
}
//# sourceMappingURL=image-validation.js.map