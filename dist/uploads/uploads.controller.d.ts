import { UploadsService } from './uploads.service';
export declare class UploadsController {
    private readonly uploadsService;
    constructor(uploadsService: UploadsService);
    uploadFile(file: any): Promise<{
        filePath: string;
    }>;
    getSignedUrl(path: string): Promise<{
        url: string;
    }>;
}
