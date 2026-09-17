import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { getSupabaseClient } from '../common/supabase/supabase.client';

@Injectable()
export class UploadsService {
  async uploadFile(file: any): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
      // Generate a unique filename
      const fileExt = file.originalname.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `uploads/${fileName}`;

      // Upload file to Supabase Storage bucket named 'bills'
      const { data, error } = await supabase.storage
        .from('bills')
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) {
        console.error('Supabase upload error:', error);
        throw new InternalServerErrorException('Failed to upload file to storage.');
      }

      return filePath;
    } catch (err) {
      console.error('Error in uploadFile:', err);
      throw new InternalServerErrorException('An error occurred during file upload: ' + (err as any).message);
    }
  }

  async getSignedUrl(filePath: string): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
      // 3600 seconds = 1 hour
      const { data, error } = await supabase.storage
        .from('bills')
        .createSignedUrl(filePath, 3600);

      if (error) {
        console.error('Supabase signed URL error:', error);
        throw new InternalServerErrorException('Failed to generate signed URL.');
      }

      return data.signedUrl;
    } catch (err) {
      console.error('Error in getSignedUrl:', err);
      throw new InternalServerErrorException('An error occurred generating signed URL: ' + (err as any).message);
    }
  }
}
