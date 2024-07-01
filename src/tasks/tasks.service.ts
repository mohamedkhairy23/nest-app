import { Injectable, NotFoundException } from '@nestjs/common';
import { Task, TaskStatus } from './task.model';
import { v4 as uuidv4 } from 'uuid';
import { CreateTaskDto } from './dto/create-task.dto';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';

@Injectable()
export class TasksService {
  private tasks: Task[] = [
    {
      id: '1',
      title: 'test title1',
      description: 'test desc1',
      status: TaskStatus.OPEN,
    },
    {
      id: '2',
      title: 'test title2',
      description: 'test desc2',
      status: TaskStatus.OPEN,
    },
    {
      id: '3',
      title: 'test title3',
      description: 'test desc3',
      status: TaskStatus.OPEN,
    },
  ];

  getAllTasks(): Task[] {
    return this.tasks;
  }

  getTasksWithFilter(filter: GetTasksFilterDto): Task[] {
    const { search, status } = filter;

    let tasks = this.getAllTasks();

    if (status) {
      tasks = tasks.filter((task) => task.status === status);
    }

    if (search) {
      tasks = tasks.filter(
        (task) =>
          task.title.includes(search) || task.description.includes(search),
      );
    }

    return tasks;
  }

  getTaskById(id: string): Task | undefined {
    const task = this.tasks.find((task) => task.id === id);
    if (!task) {
      throw new NotFoundException('Task with id ' + id + ' not found');
    }
    return task;
  }

  createTask(task: CreateTaskDto): Task {
    const { title, description } = task;
    const createdTask: Task = {
      id: uuidv4(),
      title,
      description,
      status: TaskStatus.OPEN,
    };

    this.tasks.push(createdTask);
    return createdTask;
  }

  deleteTask(id: string): { success: boolean } {
    const foundedTask = this.getTaskById(id);

    this.tasks = this.tasks.filter((task) => task.id !== foundedTask.id);

    return { success: true };
  }

  updateTaskStatus(id: string, status: TaskStatus): Task {
    const task = this.getTaskById(id);

    task.status = status;
    return task;
  }
}
