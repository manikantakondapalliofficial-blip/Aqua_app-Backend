import { PostsService } from './posts.service';
import { CreatePostDto } from './dto/create-post.dto';
export declare class PostsController {
    private readonly postsService;
    constructor(postsService: PostsService);
    getAll(): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreatePostDto): Promise<any>;
    like(user: {
        sub: string;
    }, postId: string): Promise<{
        liked: boolean;
    }>;
    comment(user: {
        sub: string;
    }, postId: string, comment: string): Promise<any>;
}
