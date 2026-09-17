import { BannersService } from './banners.service';
export declare class BannersController {
    private readonly bannersService;
    constructor(bannersService: BannersService);
    getBanners(): Promise<any[]>;
    uploadBanner(file: any): Promise<{
        filePath: string;
    }>;
    deleteBanner(name: string): Promise<{
        success: boolean;
    }>;
}
