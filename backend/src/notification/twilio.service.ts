// src/notifications/twilio.service.ts
import { Injectable } from '@nestjs/common';
import * as twilio from 'twilio';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class TwilioService {
  private client;

  constructor(private config: ConfigService) {
    this.client = twilio(
      this.config.get<string>('TWILIO_ACCOUNT_SID'),
      this.config.get<string>('TWILIO_AUTH_TOKEN'),
    );
  }

  async sendSMS(to: string, body: string) {
    return await this.client.messages.create({
      body,
      to,
      from: this.config.get<string>('TWILIO_PHONE_NUMBER'),
    });
  }
}
