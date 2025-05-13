import { Controller, Post, Body } from '@nestjs/common';
import { TwilioService } from './twilio.service';

@Controller('notifications')
export class NotificationsController {
  constructor(private readonly twilioService: TwilioService) {}

  @Post('sms')
  async sendSMS(@Body() body: { phone: string; message: string }) {
    return this.twilioService.sendSMS(body.phone, body.message);
  }
}
