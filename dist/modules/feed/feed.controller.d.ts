import { FeedService } from './feed.service';
import { CreateFeedDto } from './dto/create-feed.dto';
export declare class FeedController {
    private readonly feedService;
    constructor(feedService: FeedService);
    getAll(user: {
        sub: string;
    }): Promise<any[]>;
    create(user: {
        sub: string;
    }, dto: CreateFeedDto): Promise<any>;
    updateStatus(user: {
        sub: string;
    }, id: string, status: string): Promise<any>;
}
