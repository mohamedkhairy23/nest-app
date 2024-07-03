import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
  Req,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { Task } from './task.entity';
import { TaskStatus } from './task-status.enum';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';

@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
  private logger = new Logger('TasksController');

  constructor(private tasksService: TasksService) {}

  @Get()
  @UsePipes(ValidationPipe)
  getAllTasks(
    @Query() filterDto: GetTasksFilterDto,
    @Req() req,
    user: User,
  ): Promise<Task[]> {
    user = req.user;

    this.logger.verbose(
      `User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`,
    );

    return this.tasksService.getTasks(filterDto, user);
  }

  @Get('/:id')
  getTaskById(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    user: User,
  ): Promise<Task> {
    user = req.user;

    this.logger.verbose(
      `User "${user.username}" retrieving a task with id ${id}.`,
    );

    return this.tasksService.getTaskById(id, user);
  }

  @Post()
  @UsePipes(ValidationPipe)
  createTask(
    @Body() createTaskDto: CreateTaskDto,
    @Req() req,
    user: User,
  ): Promise<Task> {
    user = req.user;

    this.logger.verbose(
      `User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`,
    );

    return this.tasksService.createTask(createTaskDto, user);
  }

  @Delete('/:id')
  deleteTask(
    @Param('id', ParseIntPipe) id: number,
    @Req() req,
    user: User,
  ): { msg: string } {
    user = req.user;

    this.logger.verbose(
      `User "${user.username}" deleting a task with id ${id}.`,
    );

    this.tasksService.deleteTask(id, user);
    return { msg: 'Task deleted successfully' };
  }

  @Patch('/:id/status')
  updateTaskStatus(
    @Param('id', ParseIntPipe) id: number,
    @Body('status', TaskStatusValidationPipe) status: TaskStatus,
    @Req() req,
    user: User,
  ): Promise<Task> {
    user = req.user;

    this.logger.verbose(
      `User "${user.username}" updating a task status with id ${id}. Status now is ${status}`,
    );

    return this.tasksService.updateTaskStatus(id, status, user);
  }
}
