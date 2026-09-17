import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsService {
    findAll(): Promise<any[]>;
    create(userId: string, dto: CreatePostDto): Promise<any>;
    toggleLike(userId: string, postId: string): Promise<{
        liked: boolean;
    }>;
    addComment(userId: string, postId: string, comment: string): Promise<any>;
}
