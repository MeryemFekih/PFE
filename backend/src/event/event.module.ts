import { forwardRef, Module } from '@nestjs/common';
import { EventService } from './event.service';
import { EventController } from './event.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserModule } from 'src/user/user.module';
import { PrismaModule } from 'src/prisma/prisma.module';
import { NotificationsModule } from 'src/notification/notifications.module';

@Module({
  imports: [PrismaModule, forwardRef(() => UserModule), NotificationsModule],

  providers: [EventService, PrismaService],
  controllers: [EventController],
  exports: [EventService], // in case UserModule needs it

})
export class EventModule {}
