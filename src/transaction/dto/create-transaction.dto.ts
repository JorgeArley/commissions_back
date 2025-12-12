import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @IsOptional()
  @IsUUID()
  participantId?: string;

  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;
}
