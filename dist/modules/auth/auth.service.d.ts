import { JwtService } from '@nestjs/jwt';
export declare class AuthService {
    private readonly jwtService;
    constructor(jwtService: JwtService);
    checkUser(mobile: string): Promise<{
        exists: boolean;
    }>;
    sendOtp(mobile: string, purpose: string): Promise<{
        message: string;
    }>;
    private verifyOtpInternal;
    register(mobile: string, otp: string, pin: string): Promise<{
        access_token: string;
    }>;
    login(mobile: string, pin: string): Promise<{
        access_token: string;
        user: any;
    }>;
    forgotPin(mobile: string, otp: string, newPin: string): Promise<{
        access_token: string;
    }>;
    changePin(userId: string, oldPin: string, newPin: string): Promise<{
        message: string;
    }>;
}
