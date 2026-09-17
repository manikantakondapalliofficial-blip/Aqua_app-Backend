import { CommunityService } from './community.service';
import { CreatePostDto } from './dto/create-post.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
export declare class CommunityController {
    private readonly communityService;
    constructor(communityService: CommunityService);
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
    uploadImage(file: any): Promise<{
        imagePath: string;
    }>;
    uploadAudio(file: any): Promise<{
        audioPath: string;
    }>;
    createPost(user: {
        sub: string;
    }, dto: CreatePostDto): Promise<any>;
    likePost(user: {
        sub: string;
    }, id: string): Promise<{
        liked: boolean;
    }>;
    commentOnPost(user: {
        sub: string;
    }, id: string, dto: CreateCommentDto): Promise<any>;
}
