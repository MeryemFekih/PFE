import { Module } from '@nestjs/common';
import { TwilioService } from './twilio.service';
import { ConfigModule } from '@nestjs/config';
import { NotificationsController } from './notifications.controller';

@Module({
  imports: [ConfigModule],
  providers: [TwilioService],
  controllers: [NotificationsController],
  exports: [TwilioService],
})
export class NotificationsModule {}
