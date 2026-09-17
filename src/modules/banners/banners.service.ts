import { Injectable, InternalServerErrorException, BadRequestException } from '@nestjs/common';
import { getSupabaseClient } from '../../common/supabase/supabase.client';

@Injectable()
export class BannersService {
  private readonly BUCKET = 'bills'; // Reuse existing bucket
  private readonly FOLDER = 'banners'; // Subfolder for banners

  async uploadBanner(file: any): Promise<string> {
    try {
      const supabase = getSupabaseClient();
      
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
        throw new InternalServerErrorException('Failed to upload banner to storage.');
      }

      return filePath;
    } catch (err) {
      console.error('Error in uploadBanner:', err);
      throw new InternalServerErrorException('An error occurred during banner upload');
    }
  }

  async getBanners(): Promise<any[]> {
    try {
      const supabase = getSupabaseClient();
      
      // List all files in 'banners' folder
      const { data, error } = await supabase.storage
        .from(this.BUCKET)
        .list(this.FOLDER, {
          limit: 100,
          offset: 0,
          sortBy: { column: 'created_at', order: 'desc' },
        });

      if (error) {
        console.error('Supabase list error:', error);
        throw new InternalServerErrorException('Failed to fetch banners.');
      }

      // Filter out a possible dummy '.emptyFolderPlaceholder' if it exists
      const files = data.filter((f) => f.name !== '.emptyFolderPlaceholder');

      // Map to full public URL (assuming public bucket, or we generate signed URLs)
      // Wait, is 'bills' a public bucket? Let's check or use getPublicUrl just in case.
      // Better to generate public URLs. If it's private, publicUrl won't work, we'd need signedUrls.
      // In uploads, we have getSignedUrl.
      // To be safe, we will just use getPublicUrl if it's public. If not, we can change to signed url.
      
      const banners = await Promise.all(
        files.map(async (file) => {
          const filePath = `${this.FOLDER}/${file.name}`;
          const { data: urlData, error: urlError } = await supabase.storage
            .from(this.BUCKET)
            .createSignedUrl(filePath, 31536000); // 1 year expiry

          return {
            id: file.id,
            name: file.name,
            url: urlData?.signedUrl || '',
            created_at: file.created_at,
          };
        })
      );

      return banners;
    } catch (err) {
      console.error('Error in getBanners:', err);
      throw new InternalServerErrorException('An error occurred fetching banners');
    }
  }

  async deleteBanner(name: string): Promise<void> {
    try {
      const supabase = getSupabaseClient();
      const filePath = `${this.FOLDER}/${name}`;
      
      const { error } = await supabase.storage
        .from(this.BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Supabase delete error:', error);
        throw new InternalServerErrorException('Failed to delete banner.');
      }
    } catch (err) {
      console.error('Error in deleteBanner:', err);
      throw new InternalServerErrorException('An error occurred during banner deletion');
    }
  }
}
