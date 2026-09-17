import { Body, Controller, HttpCode, Post, UseGuards, Req } from '@nestjs/common';
import { AuthService } from './auth.service';
import { SendOtpDto, RegisterDto, LoginDto, ForgotPinDto, ChangePinDto } from './dto/auth.dto';
import { JwtGuard } from '../../common/guards/jwt.guard';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('check-user')
  @HttpCode(200)
  checkUser(@Body() dto: SendOtpDto) {
    return this.authService.checkUser(dto.mobile);
  }

  @Post('send-otp')
  @HttpCode(200)
  sendOtp(@Body() dto: SendOtpDto) {
    return this.authService.sendOtp(dto.mobile, dto.purpose);
  }

  @Post('register')
  @HttpCode(201)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.mobile, dto.otp, dto.pin);
  }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.mobile, dto.pin);
  }

  @Post('forgot-pin')
  @HttpCode(200)
  forgotPin(@Body() dto: ForgotPinDto) {
    return this.authService.forgotPin(dto.mobile, dto.otp, dto.newPin);
  }

  @UseGuards(JwtGuard)
  @Post('change-pin')
  @HttpCode(200)
  changePin(@Req() req: any, @Body() dto: ChangePinDto) {
    // req.user contains the decoded JWT (from JwtStrategy)
    return this.authService.changePin(req.user.sub, dto.oldPin, dto.newPin);
  }
}
