export interface PostEntity {
  id: string;
  user_id: string;
  content: string;
  image_url?: string;
  video_url?: string;
  audio_url?: string;
  created_at: string;
}
