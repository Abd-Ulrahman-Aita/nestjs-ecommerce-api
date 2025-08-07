import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { generateOTP, otpExpiry } from 'src/utils/otp';
import { VerifyEmailDto } from './dto/verify-email.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { MailService } from 'src/mail/mail.service';
import { I18nService } from 'nestjs-i18n';

@Injectable()
export class AuthService {
  constructor(
    private readonly prismaService: PrismaService,
    private readonly jwtService: JwtService,
    private readonly mailService: MailService,
    private readonly i18nService: I18nService
  ) {}

  async register(dto: RegisterDto) {
    const exists = await this.prismaService.user.findUnique({ where: { email: dto.email } });

    if (exists) {
      throw new BadRequestException('auth.email_exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 10);

    const otpCode = generateOTP();
    const otpExpires = otpExpiry(); // valid for 10 minutes

    await this.prismaService.user.create({
      data: {
        name: dto.name,
        email: dto.email,
        password: hashedPassword,
        email_verification_otp: otpCode,
        email_verification_expires: otpExpires,
      },
    });

    console.log(`📧 Email verification OTP for ${dto.email}: ${otpCode}`);
    await this.mailService.sendEmailVerification(dto.email, otpCode);

    return { message: 'auth.register_success' };
  }

  async verifyEmail(dto: VerifyEmailDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('auth.user_not_found'));
    }

    if (user.is_verified) {
      throw new BadRequestException(this.i18nService.t('auth.already_verified'));
    }

    if (!user.email_verification_otp || !user.email_verification_expires) {
      throw new BadRequestException(this.i18nService.t('auth.otp_invalid_or_expired'));
    }

    const isExpired = new Date() > user.email_verification_expires;
    if (isExpired) {
      throw new BadRequestException(this.i18nService.t('auth.otp_expired'));
    }

    if (dto.otp !== user.email_verification_otp) {
      throw new BadRequestException(this.i18nService.t('auth.otp_invalid'));
    }

    await this.prismaService.user.update({
      where: { email: dto.email },
      data: {
        is_verified: true,
        email_verification_otp: null,
        email_verification_expires: null,
      },
    });

    return { message: 'auth.verified_success' };
  }

  async login(dto: LoginDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new UnauthorizedException(this.i18nService.t('auth.invalid_credentials'));
    
    if (!user.is_verified) throw new ForbiddenException(this.i18nService.t('auth.not_verified'));

    const passwordMatch = await bcrypt.compare(dto.password, user.password);
    if (!passwordMatch) throw new UnauthorizedException(this.i18nService.t('auth.invalid_credentials'));

    const payload = { sub: user.id, email: user.email, role: user.role };
    const token = this.jwtService.sign(payload);

    return {
      access_token: token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
    };
  }

  async getProfile(userId: number) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        name: true,
        email: true,
        is_verified: true,
        role: true,
        created_at: true,
      },
    });

    if (!user) throw new NotFoundException(this.i18nService.t('auth.user_not_found'));
    return user;
  }

  async forgotPassword(dto: ForgotPasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });

    if (!user) throw new NotFoundException(this.i18nService.t('auth.user_not_found'));

    const otpCode = generateOTP();
    const otpExpires = otpExpiry();

    await this.prismaService.user.update({
      where: { email: dto.email },
      data: {
        password_reset_otp: otpCode,
        password_reset_otp_expires: otpExpires,
      },
    });

    console.log(`🔐 Password Reset OTP for ${dto.email}: ${otpCode}`);
    await this.mailService.sendPasswordReset(dto.email, otpCode);

    return { message: this.i18nService.t('auth.otp_sent') };
  }

  async resetPassword(dto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({ where: { email: dto.email } });

    if (!user) {
      throw new NotFoundException(this.i18nService.t('auth.user_not_found'));
    }

    if (!user.password_reset_otp || !user.password_reset_otp_expires) {
      throw new BadRequestException(this.i18nService.t('auth.invalid_request'));
    }

    const isExpired = new Date() > user.password_reset_otp_expires;
    if (isExpired) {
      throw new BadRequestException(this.i18nService.t('auth.otp_expired'));
    }

    if (dto.otp !== user.password_reset_otp) {
      throw new BadRequestException(this.i18nService.t('auth.otp_invalid'));
    }

    const hashedPassword = await bcrypt.hash(dto.newPassword, 10);

    await this.prismaService.user.update({
      where: { email: dto.email },
      data: {
        password: hashedPassword,
        password_reset_otp: null,
        password_reset_otp_expires: null,
      },
    });

    return { message: this.i18nService.t('auth.password_reset_success') };
  }

}