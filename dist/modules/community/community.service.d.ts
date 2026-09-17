import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommunityService {
    getPosts(): Promise<{
        id: any;
        caption: any;
        image_path: any;
        audio_path: any;
        created_at: any;
        name: any;
        likes: any;
        comments: any;
    }[]>;
    createPost(userId: string, dto: CreatePostDto): Promise<any>;
    likePost(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
    commentOnPost(userId: string, postId: string, dto: CreateCommentDto): Promise<any>;
    uploadImage(file: any): Promise<string>;
    uploadAudio(file: any): Promise<string>;
}
