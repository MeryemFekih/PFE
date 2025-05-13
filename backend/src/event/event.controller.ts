import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Delete,
    Put,
    NotFoundException,
  } from '@nestjs/common';
  import { EventService } from './event.service';
  import { CreateEventDto } from './dto/create-event.dto';
  import { UpdateEventDto } from './dto/update-event.dto';
  import { Event } from '@prisma/client';
  
  @Controller('events')
  export class EventController {
    constructor(private readonly eventService: EventService) {}
  
    @Post(':userId')
  async create(@Param('userId') userId: number, @Body() createEventDto: CreateEventDto) {
  console.log('Received DTO:', createEventDto);
  return this.eventService.create(userId, createEventDto);
}

    @Get(':userId')
    async findAll(@Param('userId') userId: number): Promise<Event[]> {
      return this.eventService.findAll(userId);
    }
  
    @Get(':userId/event/:id')
async findOne(
  @Param('userId') userId: number,
  @Param('id') id: string,
): Promise<Event> {
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
    async remove(
      @Param('userId') userId: number,
      @Param('id') id: string,
    ): Promise<Event> {
      const event = await this.eventService.remove(userId, id);
      if (!event) throw new NotFoundException('Event not found');
      return event;
    }
  }
  