import { Injectable, UnauthorizedException, BadRequestException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { getSupabaseClient } from '../../common/supabase/supabase.client';
import * as bcrypt from 'bcryptjs';

@Injectable()
export class AuthService {
  constructor(private readonly jwtService: JwtService) {}

  async checkUser(mobile: string): Promise<{ exists: boolean }> {
    const supabase = getSupabaseClient();
    const { data } = await supabase.from('users').select('id').eq('mobile', mobile).maybeSingle();
    return { exists: !!data };
  }

  async sendOtp(mobile: string, purpose: string): Promise<{ message: string }> {
    const supabase = getSupabaseClient();
    
    const code = Math.floor(100000 + Math.random() * 900000).toString();
    
    console.log('------------------------------------');
    console.log(`🚀 TEST OTP for ${mobile} [${purpose}]: ${code}`);
    console.log('------------------------------------');

    await supabase.from('otps').delete().eq('mobile', mobile);
    const { error: insertError } = await supabase.from('otps').insert({
        mobile,
        code,
        expires_at: new Date(Date.now() + 5 * 60 * 1000).toISOString()
    });

    if (insertError) {
      console.error('Supabase Error:', insertError);
      throw new Error(`Database Error: ${insertError.message}`);
    }

    return { message: 'OTP sent (Check server logs)' };
  }

  private async verifyOtpInternal(mobile: string, token: string, purpose: string): Promise<void> {
    const supabase = getSupabaseClient();

    const { data: otpData, error: otpError } = await supabase
      .from('otps')
      .select('*')
      .eq('mobile', mobile)
      .eq('code', token)
      .maybeSingle();

    if (otpError || !otpData) {
      throw new UnauthorizedException('Invalid OTP');
    }

    if (new Date(otpData.expires_at) < new Date()) {
      throw new UnauthorizedException('OTP has expired');
    }
  }

  async register(mobile: string, otp: string, pin: string): Promise<{ access_token: string }> {
    await this.verifyOtpInternal(mobile, otp, 'REGISTER');

    const supabase = getSupabaseClient();

    // Check if user already exists
    const { data: existingUser } = await supabase
      .from('users')
      .select('id')
      .eq('mobile', mobile)
      .maybeSingle();

    if (existingUser) {
      throw new BadRequestException('User already exists with this mobile number. Please login.');
    }

    const pinHash = await bcrypt.hash(pin, 10);

    const { data: newUser, error: createError } = await supabase
      .from('users')
      .insert({ 
        mobile,
        pin_hash: pinHash,
        pin_set_at: new Date().toISOString()
      })
      .select()
      .single();
    
    if (createError) {
      console.error('User Creation Error:', createError);
      throw new Error(`User Creation Error: ${createError.message}`);
    }

    await supabase.from('otps').delete().eq('mobile', mobile);

    const accessToken = await this.jwtService.signAsync({ sub: newUser.id, mobile: newUser.mobile });
    return { access_token: accessToken };
  }

  async login(mobile: string, pin: string): Promise<{ access_token: string, user: any }> {
    const supabase = getSupabaseClient();

    const { data: user, error: userError } = await supabase
      .from('users')
      .select('*')
      .eq('mobile', mobile)
      .maybeSingle();

    if (userError || !user) {
      throw new UnauthorizedException('Invalid mobile number or PIN');
    }

    if (!user.pin_hash) {
      throw new UnauthorizedException('PIN not set for this account. Please use Forgot PIN.');
    }

    // Check lockout
    if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
      throw new UnauthorizedException('Account is locked due to too many failed attempts. Try again later.');
    }

    const isMatch = await bcrypt.compare(pin, user.pin_hash);

    if (!isMatch) {
      const attempts = (user.failed_login_attempts || 0) + 1;
      let lockedUntil = null;
      if (attempts >= 5) {
        lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString(); // 15 mins
      }
      
      await supabase.from('users').update({
        failed_login_attempts: attempts,
        account_locked_until: lockedUntil
      }).eq('id', user.id);

      if (lockedUntil) {
        throw new UnauthorizedException('Account locked due to 5 failed attempts. Try again in 15 minutes.');
      }
      throw new UnauthorizedException('Invalid mobile number or PIN');
    }

    // Successful login: reset failed attempts
    await supabase.from('users').update({
      failed_login_attempts: 0,
      account_locked_until: null
    }).eq('id', user.id);

    const accessToken = await this.jwtService.signAsync({ sub: user.id, mobile: user.mobile });
    
    // Omit sensitive data before returning user profile
    delete user.pin_hash;
    
    return { access_token: accessToken, user };
  }

  async forgotPin(mobile: string, otp: string, newPin: string): Promise<{ access_token: string }> {
    await this.verifyOtpInternal(mobile, otp, 'FORGOT_PIN');

    const supabase = getSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('id, mobile')
      .eq('mobile', mobile)
      .maybeSingle();

    if (!user) {
      throw new BadRequestException('User not found');
    }

    const pinHash = await bcrypt.hash(newPin, 10);

    await supabase.from('users').update({
      pin_hash: pinHash,
      pin_set_at: new Date().toISOString(),
      failed_login_attempts: 0,
      account_locked_until: null
    }).eq('id', user.id);

    await supabase.from('otps').delete().eq('mobile', mobile);

    const accessToken = await this.jwtService.signAsync({ sub: user.id, mobile: user.mobile });
    return { access_token: accessToken };
  }

  async changePin(userId: string, oldPin: string, newPin: string): Promise<{ message: string }> {
    const supabase = getSupabaseClient();

    const { data: user } = await supabase
      .from('users')
      .select('id, pin_hash')
      .eq('id', userId)
      .maybeSingle();

    if (!user || !user.pin_hash) {
      throw new BadRequestException('User or PIN not found');
    }

    const isMatch = await bcrypt.compare(oldPin, user.pin_hash);
    if (!isMatch) {
      throw new UnauthorizedException('Old PIN is incorrect');
    }

    const pinHash = await bcrypt.hash(newPin, 10);

    await supabase.from('users').update({
      pin_hash: pinHash,
      pin_set_at: new Date().toISOString()
    }).eq('id', userId);

    return { message: 'PIN changed successfully' };
  }
}
