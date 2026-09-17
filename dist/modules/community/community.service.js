"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CommunityService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let CommunityService = class CommunityService {
    async getPosts() {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data, error } = await supabase
            .from('posts')
            .select(`
        id,
        caption,
        image_path,
        audio_path,
        created_at,
        users!inner(name),
        likes(id),
        comments(id)
      `)
            .order('created_at', { ascending: false });
        if (error) {
            throw new common_1.InternalServerErrorException(error.message);
        }
        return data.map((post) => ({
            id: post.id,
            caption: post.caption,
            image_path: post.image_path,
            audio_path: post.audio_path,
            created_at: post.created_at,
            name: post.users?.name,
            likes: post.likes ? post.likes.length : 0,
            comments: post.comments ? post.comments.length : 0,
        }));
    }
    async createPost(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('posts')
            .insert({
            user_id: userId,
            caption: dto.caption,
            image_path: dto.imagePath,
            audio_path: dto.audioPath,
        })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async likePost(userId, postId) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: existingLike } = await supabase
            .from('likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .single();
        if (existingLike) {
            const { error } = await supabase
                .from('likes')
                .delete()
                .eq('id', existingLike.id);
            if (error)
                throw new common_1.InternalServerErrorException(error.message);
            return { liked: false };
        }
        else {
            const { error } = await supabase
                .from('likes')
                .insert({
                post_id: postId,
                user_id: userId,
            });
            if (error)
                throw new common_1.InternalServerErrorException(error.message);
            return { liked: true };
        }
    }
    async commentOnPost(userId, postId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('comments')
            .insert({
            post_id: postId,
            user_id: userId,
            comment: dto.comment,
        })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async uploadImage(file) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const fileExt = file.originalname.split('.').pop();
            const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;
            const { error } = await supabase.storage
                .from('community')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error)
                throw error;
            return `community/${filePath}`;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('An error occurred during file upload: ' + err.message);
        }
    }
    async uploadAudio(file) {
        try {
            const supabase = (0, supabase_client_1.getSupabaseClient)();
            const fileExt = file.originalname.split('.').pop();
            const fileName = `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
            const filePath = `${fileName}`;
            const { error } = await supabase.storage
                .from('community')
                .upload(filePath, file.buffer, {
                contentType: file.mimetype,
                upsert: false,
            });
            if (error)
                throw error;
            return `community/${filePath}`;
        }
        catch (err) {
            throw new common_1.InternalServerErrorException('An error occurred during audio upload: ' + err.message);
        }
    }
};
exports.CommunityService = CommunityService;
exports.CommunityService = CommunityService = __decorate([
    (0, common_1.Injectable)()
], CommunityService);
//# sourceMappingURL=community.service.js.map