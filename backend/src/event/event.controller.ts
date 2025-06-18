import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  Req,
  UseGuards,
  Request,
  BadRequestException,
} from '@nestjs/common';
import { EventService } from './event.service';
import { CreateEventDto } from './dto/create-event.dto';
import { UpdateEventDto } from './dto/update-event.dto';
import { Event } from '@prisma/client';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth/jwt-auth.guard';
import { UserService } from 'src/user/user.service';

@Controller('events')
export class EventController {
  constructor(
    private readonly eventService: EventService,
    private readonly userService: UserService
  ) {}
  @Post(':userId')
  async create(@Param('userId') userId: number, @Body() createEventDto: CreateEventDto) {
    return this.eventService.create(userId, createEventDto);
  }

  @Get('suggested')
  @UseGuards(JwtAuthGuard)
  async getSuggestedEvents(@Req() req) {
    const user = await this.userService.findOne(req.user.id);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.eventService.getSuggestedEvents(user.interests || []);
  }

  @Get(':userId')
  async findAll(@Param('userId') userId: number): Promise<Event[]> {
    return this.eventService.findAll(userId);
  }

  @Get(':userId/event/:id')
  async findOne(@Param('userId') userId: number, @Param('id') id: string): Promise<Event> {
    const event = await this.eventService.findOne(userId, id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  @Put(':userId/:id')
  async update(
    @Param('userId') userId: number,
    @Param('id') id: string,
    @Body() updateEventDto: UpdateEventDto,
  ): Promise<Event> {
    return this.eventService.update(userId, id, updateEventDto);
  }

  @Delete(':userId/:id')
  async remove(@Param('userId') userId: number, @Param('id') id: string): Promise<Event> {
    const event = await this.eventService.remove(userId, id);
    if (!event) throw new NotFoundException('Event not found');
    return event;
  }

  // ✅ NEW: Suggested events based on user interests
  @UseGuards(JwtAuthGuard)
  @Get('suggested')
  async getSuggested(@Req() req) {
    const user = await this.userService.findById(req.user.id);
    if (!user?.interests?.length) return [];
    return this.eventService.getSuggestedEvents(user.interests);
  }
@Post('add-to-planner/:postId')
@UseGuards(JwtAuthGuard)
async addToPlanner(@Param('postId') postId: string, @Request() req: any) {
  const userId = req.user.id;
  console.log('🔥 Reached addToPlanner with:', { userId, postId });

  try {
    const result = await this.eventService.addEventToPlanner(userId, parseInt(postId));
    console.log('✅ Event created:', result);
    return result;
  } catch (error) {
    console.error('❌ Error in controller:', error);
    throw error;
  }
}


}
