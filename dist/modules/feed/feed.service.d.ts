import { CreateFeedDto } from './dto/create-feed.dto';
export declare class FeedService {
    findAllForUser(userId: string): Promise<any[]>;
    create(userId: string, dto: CreateFeedDto): Promise<any>;
    updateStatus(userId: string, feedId: string, status: string): Promise<any>;
}
