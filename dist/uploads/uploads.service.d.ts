export declare class UploadsService {
    uploadFile(file: any): Promise<string>;
    getSignedUrl(filePath: string): Promise<string>;
}
