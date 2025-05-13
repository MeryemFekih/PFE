import { Test, TestingModule } from '@nestjs/testing';
import { TaskController } from './task.controller';
import { beforeEach, describe, it } from 'node:test';

describe('TaskController', () => {
  let controller: TaskController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TaskController],
    }).compile();

    controller = module.get<TaskController>(TaskController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
function expect(controller: TaskController) {
  throw new Error('Function not implemented.');
}

