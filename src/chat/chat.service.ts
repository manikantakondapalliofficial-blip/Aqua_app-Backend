import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../common/supabase/supabase.client';

@Injectable()
export class ChatService {
  async getMessages(userId1: string, userId2: string) {
    const supabase = getSupabaseClient();
    
    // We want to fetch all messages where sender is 1 and receiver is 2 OR sender is 2 and receiver is 1.
    const { data, error } = await supabase
      .from('chat_messages')
      .select('*')
      .or(`and(sender_id.eq.${userId1},receiver_id.eq.${userId2}),and(sender_id.eq.${userId2},receiver_id.eq.${userId1})`)
      .order('created_at', { ascending: true });

    if (error) {
      console.error('Error fetching chat messages:', error);
      throw new InternalServerErrorException('Could not fetch chat messages');
    }

    return data;
  }

  async saveMessage(senderId: string, receiverId: string, content: string, imageUrl?: string) {
    const supabase = getSupabaseClient();
    
    const { data, error } = await supabase
      .from('chat_messages')
      .insert({
        sender_id: senderId,
        receiver_id: receiverId,
        content: content,
        image_url: imageUrl,
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving chat message:', error);
      throw new InternalServerErrorException('Could not save chat message');
    }

    return data;
  }
}
