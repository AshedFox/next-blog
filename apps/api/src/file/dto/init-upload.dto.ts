import { IsMimeType, IsNumber, Length, Max, Min } from 'class-validator';

export class InitUploadDto {
  @Length(1, 255)
  name!: string;

  @IsMimeType()
  mimetype!: string;

  @IsNumber()
  @Min(1)
  @Max(10_485_760)
  size!: number;
}
