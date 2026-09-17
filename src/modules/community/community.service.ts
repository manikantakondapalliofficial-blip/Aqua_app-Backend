import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';

@Injectable()
export class CommunityService {
  
  async getPosts() {
    const supabase = getSupabaseClient();
    
    // We run raw SQL via rpc if possible, but since we may not have RPC setup for this query,
    // we can use Supabase's relational querying which translates to joins.
    // However, the user specifically provided a raw SQL query.
    // In Supabase JS, to execute raw SQL that groups counts, we usually need an RPC function.
    // If an RPC function is not created, we can fetch posts with relations.
    
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
      throw new InternalServerErrorException(error.message);
    }

    // Format the response to match the expected structure
    return data.map((post: any) => ({
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

  async createPost(userId: string, dto: CreatePostDto) {
    const { data, error } = await getSupabaseClient()
      .from('posts')
      .insert({
        user_id: userId,
        caption: dto.caption,
        image_path: dto.imagePath,
        audio_path: dto.audioPath,
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async likePost(userId: string, postId: string) {
    const supabase = getSupabaseClient();
    
    // Check if already liked
    const { data: existingLike } = await supabase
      .from('likes')
      .select('id')
      .eq('post_id', postId)
      .eq('user_id', userId)
      .single();

    if (existingLike) {
      // Unlike
      const { error } = await supabase
        .from('likes')
        .delete()
        .eq('id', existingLike.id);
      if (error) throw new InternalServerErrorException(error.message);
      return { liked: false };
    } else {
      // Like
      const { error } = await supabase
        .from('likes')
        .insert({
          post_id: postId,
          user_id: userId,
        });
      if (error) throw new InternalServerErrorException(error.message);
      return { liked: true };
    }
  }

  async commentOnPost(userId: string, postId: string, dto: CreateCommentDto) {
    const { data, error } = await getSupabaseClient()
      .from('comments')
      .insert({
        post_id: postId,
        user_id: userId,
        comment: dto.comment,
      })
      .select()
      .single();

    if (error) throw new InternalServerErrorException(error.message);
    return data;
  }

  async uploadImage(file: any): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to public 'community' bucket
      const { error } = await supabase.storage
        .from('community')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;
      return `community/${filePath}`;
    } catch (err) {
      throw new InternalServerErrorException('An error occurred during file upload: ' + (err as any).message);
    }
  }

  async uploadAudio(file: any): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
      const fileExt = file.originalname.split('.').pop();
      const fileName = `audio-${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `${fileName}`;

      // Upload to public 'community' bucket
      const { error } = await supabase.storage
        .from('community')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;
      return `community/${filePath}`;
    } catch (err) {
      throw new InternalServerErrorException('An error occurred during audio upload: ' + (err as any).message);
    }
  }
}
