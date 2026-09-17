"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.PostsService = void 0;
const common_1 = require("@nestjs/common");
const supabase_client_1 = require("../../common/supabase/supabase.client");
let PostsService = class PostsService {
    async findAll() {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('posts')
            .select('*')
            .order('created_at', { ascending: false });
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async create(userId, dto) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('posts')
            .insert({ ...dto, user_id: userId })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
    async toggleLike(userId, postId) {
        const db = (0, supabase_client_1.getSupabaseClient)();
        const { data: existing } = await db
            .from('likes')
            .select('id')
            .eq('post_id', postId)
            .eq('user_id', userId)
            .maybeSingle();
        if (existing) {
            await db.from('likes').delete().eq('id', existing.id);
            return { liked: false };
        }
        await db.from('likes').insert({ post_id: postId, user_id: userId });
        return { liked: true };
    }
    async addComment(userId, postId, comment) {
        const { data, error } = await (0, supabase_client_1.getSupabaseClient)()
            .from('comments')
            .insert({ post_id: postId, user_id: userId, comment })
            .select()
            .single();
        if (error)
            throw new common_1.InternalServerErrorException(error.message);
        return data;
    }
};
exports.PostsService = PostsService;
exports.PostsService = PostsService = __decorate([
    (0, common_1.Injectable)()
], PostsService);
//# sourceMappingURL=posts.service.js.map