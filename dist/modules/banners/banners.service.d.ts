export declare class BannersService {
    private readonly BUCKET;
    private readonly FOLDER;
    uploadBanner(file: any): Promise<string>;
    getBanners(): Promise<any[]>;
    deleteBanner(name: string): Promise<void>;
}
