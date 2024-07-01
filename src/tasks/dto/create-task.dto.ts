import { IsNotEmpty, Length, MinLength } from 'class-validator';

export class CreateTaskDto {
  @Length(5, 50)
  title: string;
  @IsNotEmpty()
  @MinLength(50)
  description: string;
}
