import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber, IsOptional, IsUUID } from 'class-validator';

export class CreateTransactionDto {
  @ApiPropertyOptional({
    example: '550e8400-e29b-41d4-a716-446655440000',
    description: 'ID del participante que realiza la transacción',
  })
  @IsOptional()
  @IsUUID()
  participantId?: string;

  @ApiPropertyOptional({
    example: 100000,
    description: 'Monto de la transacción',
  })
  @IsOptional()
  @IsNumber()
  @Type(() => Number)
  amount?: number;
}
