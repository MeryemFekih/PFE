// notifications.service.ts
import { Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

@Injectable()
export class NotificationsService {
  constructor(private readonly httpService: HttpService) {}

  async sendSMS(phone: string, message: string) {
    // Replace with your actual SMS gateway logic (e.g., Twilio, Nexmo)
    console.log(`📲 Sending SMS to ${phone}: ${message}`);
    return { status: 'sent', phone };
  }
}
