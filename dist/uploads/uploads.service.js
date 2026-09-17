"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../common/supabase/supabase.client");
let UploadsService = class UploadsService {
    async uploadFile(file) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `uploads/${fileName}`;
            const { data, error } = await supabase.storage
                .from('bills')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                throw new common_1.InternalServerErrorException('Failed to upload file to storage.');
            }
            return filePath;
        }
        catch (err) {
            console.error('Error in uploadFile:', err);
            throw new common_1.InternalServerErrorException('An error occurred during file upload: ' + err.message);
        }
    }
    async getSignedUrl(filePath) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const { data, error } = await supabase.storage
                .from('bills')
                .createSignedUrl(filePath, 3600);
            if (error) {
                console.error('Supabase signed URL error:', error);
                throw new common_1.InternalServerErrorException('Failed to generate signed URL.');
            }
            return data.signedUrl;
        }
        catch (err) {
            console.error('Error in getSignedUrl:', err);
            throw new common_1.InternalServerErrorException('An error occurred generating signed URL: ' + err.message);
        }
    }
};
exports.UploadsService = UploadsService;
exports.UploadsService = UploadsService = __decorate([
    (0, common_1.Injectable)()
], UploadsService);
//# sourceMappingURL=uploads.service.js.map