import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notification/notifications.module';
import { TwilioService } from '../notification/twilio.service';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule), NotificationsModule],

  controllers: [EventController],
  providers: [EventService, PrismaService, TwilioService],
  exports: [EventService],
})
export class EventModule {}
