"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BannersService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let BannersService = class BannersService {
    constructor() {
        this.BUCKET = 'bills';
        this.FOLDER = 'banners';
    }
    async uploadBanner(file) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${this.FOLDER}/${fileName}`;
            const { error } = await supabase.storage
                .from(this.BUCKET)
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error) {
                console.error('Supabase upload error:', error);
                throw new common_1.InternalServerErrorException('Failed to upload banner to storage.');
            }
            return filePath;
        }
        catch (err) {
            console.error('Error in uploadBanner:', err);
            throw new common_1.InternalServerErrorException('An error occurred during banner upload');
        }
    }
    async getBanners() {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const { data, error } = await supabase.storage
                .from(this.BUCKET)
                .list(this.FOLDER, {
                limit: 100,
                offset: 0,
                sortBy: { column: 'created_at', order: 'desc' },
            });
            if (error) {
                console.error('Supabase list error:', error);
                throw new common_1.InternalServerErrorException('Failed to fetch banners.');
            }
            const files = data.filter((f) => f.name !== '.emptyFolderPlaceholder');
            const banners = await Promise.all(files.map(async (file) => {
                const filePath = `${this.FOLDER}/${file.name}`;
                const { data: urlData, error: urlError } = await supabase.storage
                    .from(this.BUCKET)
                    .createSignedUrl(filePath, 31536000);
                return {
                    id: file.id,
                    name: file.name,
                    url: urlData?.signedUrl || '',
                    created_at: file.created_at,
                };
            }));
            return banners;
        }
        catch (err) {
            console.error('Error in getBanners:', err);
            throw new common_1.InternalServerErrorException('An error occurred fetching banners');
        }
    }
    async deleteBanner(name) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const filePath = `${this.FOLDER}/${name}`;
            const { error } = await supabase.storage
                .from(this.BUCKET)
                .remove([filePath]);
            if (error) {
                console.error('Supabase delete error:', error);
                throw new common_1.InternalServerErrorException('Failed to delete banner.');
            }
        }
        catch (err) {
            console.error('Error in deleteBanner:', err);
            throw new common_1.InternalServerErrorException('An error occurred during banner deletion');
        }
    }
};
exports.BannersService = BannersService;
exports.BannersService = BannersService = __decorate([
    (0, common_1.Injectable)()
], BannersService);
//# sourceMappingURL=banners.service.js.map