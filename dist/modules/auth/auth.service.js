"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthService = void 0;
const common_1 = require("@nestjs/common");
const jwt_1 = require("@nestjs/jwt");
const supabase_client_1 = require("../../common/supabase/supabase.client");
const bcrypt = __importStar(require("bcryptjs"));
let AuthService = class AuthService {
    constructor(jwtService) {
        this.jwtService = jwtService;
    }
    async checkUser(mobile) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data } = await supabase.from('users').select('id').eq('mobile', mobile).maybeSingle();
        return { exists: !!data };
    }
    async sendOtp(mobile, purpose) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
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
    async verifyOtpInternal(mobile, token, purpose) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: otpData, error: otpError } = await supabase
            .from('otps')
            .select('*')
            .eq('mobile', mobile)
            .eq('code', token)
            .maybeSingle();
        if (otpError || !otpData) {
            throw new common_1.UnauthorizedException('Invalid OTP');
        }
        if (new Date(otpData.expires_at) < new Date()) {
            throw new common_1.UnauthorizedException('OTP has expired');
        }
    }
    async register(mobile, otp, pin) {
        await this.verifyOtpInternal(mobile, otp, 'REGISTER');
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: existingUser } = await supabase
            .from('users')
            .select('id')
            .eq('mobile', mobile)
            .maybeSingle();
        if (existingUser) {
            throw new common_1.BadRequestException('User already exists with this mobile number. Please login.');
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
    async login(mobile, pin) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: user, error: userError } = await supabase
            .from('users')
            .select('*')
            .eq('mobile', mobile)
            .maybeSingle();
        if (userError || !user) {
            throw new common_1.UnauthorizedException('Invalid mobile number or PIN');
        }
        if (!user.pin_hash) {
            throw new common_1.UnauthorizedException('PIN not set for this account. Please use Forgot PIN.');
        }
        if (user.account_locked_until && new Date(user.account_locked_until) > new Date()) {
            throw new common_1.UnauthorizedException('Account is locked due to too many failed attempts. Try again later.');
        }
        const isMatch = await bcrypt.compare(pin, user.pin_hash);
        if (!isMatch) {
            const attempts = (user.failed_login_attempts || 0) + 1;
            let lockedUntil = null;
            if (attempts >= 5) {
                lockedUntil = new Date(Date.now() + 15 * 60 * 1000).toISOString();
            }
            await supabase.from('users').update({
                failed_login_attempts: attempts,
                account_locked_until: lockedUntil
            }).eq('id', user.id);
            if (lockedUntil) {
                throw new common_1.UnauthorizedException('Account locked due to 5 failed attempts. Try again in 15 minutes.');
            }
            throw new common_1.UnauthorizedException('Invalid mobile number or PIN');
        }
        await supabase.from('users').update({
            failed_login_attempts: 0,
            account_locked_until: null
        }).eq('id', user.id);
        const accessToken = await this.jwtService.signAsync({ sub: user.id, mobile: user.mobile });
        delete user.pin_hash;
        return { access_token: accessToken, user };
    }
    async forgotPin(mobile, otp, newPin) {
        await this.verifyOtpInternal(mobile, otp, 'FORGOT_PIN');
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: user } = await supabase
            .from('users')
            .select('id, mobile')
            .eq('mobile', mobile)
            .maybeSingle();
        if (!user) {
            throw new common_1.BadRequestException('User not found');
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
    async changePin(userId, oldPin, newPin) {
        const supabase = (0, supabase_client_1.getSupabaseClient)();
        const { data: user } = await supabase
            .from('users')
            .select('id, pin_hash')
            .eq('id', userId)
            .maybeSingle();
        if (!user || !user.pin_hash) {
            throw new common_1.BadRequestException('User or PIN not found');
        }
        const isMatch = await bcrypt.compare(oldPin, user.pin_hash);
        if (!isMatch) {
            throw new common_1.UnauthorizedException('Old PIN is incorrect');
        }
        const pinHash = await bcrypt.hash(newPin, 10);
        await supabase.from('users').update({
            pin_hash: pinHash,
            pin_set_at: new Date().toISOString()
        }).eq('id', userId);
        return { message: 'PIN changed successfully' };
    }
};
exports.AuthService = AuthService;
exports.AuthService = AuthService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [jwt_1.JwtService])
], AuthService);
//# sourceMappingURL=auth.service.js.map