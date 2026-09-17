import { IsString, IsNotEmpty, Length, Matches, IsIn } from 'class-validator';

export class SendOtpDto {
  @IsString()
  @IsNotEmpty()
  @Matches(/^[0-9+]+$/, { message: 'Mobile number must contain only digits and optional + sign' })
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @IsIn(['REGISTER', 'FORGOT_PIN'])
  purpose: string;
}

export class RegisterDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  pin: string;
}

export class LoginDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'PIN must be exactly 4 digits' })
  pin: string;
}

export class ForgotPinDto {
  @IsString()
  @IsNotEmpty()
  mobile: string;

  @IsString()
  @IsNotEmpty()
  @Length(6, 6, { message: 'OTP must be exactly 6 digits' })
  otp: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'New PIN must be exactly 4 digits' })
  newPin: string;
}

export class ChangePinDto {
  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'Old PIN must be exactly 4 digits' })
  oldPin: string;

  @IsString()
  @IsNotEmpty()
  @Length(4, 4, { message: 'New PIN must be exactly 4 digits' })
  newPin: string;
}
