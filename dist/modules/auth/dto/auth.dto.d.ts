export declare class SendOtpDto {
    mobile: string;
    purpose: string;
}
export declare class RegisterDto {
    mobile: string;
    otp: string;
    pin: string;
}
export declare class LoginDto {
    mobile: string;
    pin: string;
}
export declare class ForgotPinDto {
    mobile: string;
    otp: string;
    newPin: string;
}
export declare class ChangePinDto {
    oldPin: string;
    newPin: string;
}
