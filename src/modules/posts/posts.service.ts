import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreatePostDto } from './dto/create-post.dto';

@Injectable()
export class PostsService {
  async findAll() {
    const { data, error } = await getSupabaseClient()
      .from('posts')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async create(userId: string, dto: CreatePostDto) {
    const { data, error } = await getSupabaseClient()
      .from('posts')
      .insert({ ...dto, user_id: userId })
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async toggleLike(userId: string, postId: string) {
    const db = getSupabaseClient();
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

  async addComment(userId: string, postId: string, comment: string) {
    const { data, error } = await getSupabaseClient()
      .from('comments')
      .insert({ post_id: postId, user_id: userId, comment })
      .select()
      .single();
    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }
}
