import { AuthService } from './auth.service';
import { SendOtpDto, RegisterDto, LoginDto, ForgotPinDto, ChangePinDto } from './dto/auth.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    checkUser(dto: SendOtpDto): Promise<{
        exists: boolean;
    }>;
    sendOtp(dto: SendOtpDto): Promise<{
        message: string;
    }>;
    register(dto: RegisterDto): Promise<{
        access_token: string;
    }>;
    login(dto: LoginDto): Promise<{
        access_token: string;
        user: any;
    }>;
    forgotPin(dto: ForgotPinDto): Promise<{
        access_token: string;
    }>;
    changePin(req: any, dto: ChangePinDto): Promise<{
        message: string;
    }>;
}
