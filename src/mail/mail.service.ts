import { Injectable } from '@nestjs/common';
import { MailerService } from '@nestjs-modules/mailer';

@Injectable()
export class MailService {
  constructor(private mailerService: MailerService) {}

  async sendEmailVerification(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Verify your email',
      template: 'verify', // verify.hbs
      context: {
        otp,
        email,
      },
    });
  }

  async sendPasswordReset(email: string, otp: string) {
    await this.mailerService.sendMail({
      to: email,
      subject: 'Reset your password',
      template: 'reset-password', // reset-password.hbs
      context: {
        otp,
        email,
      },
    });
  }
}