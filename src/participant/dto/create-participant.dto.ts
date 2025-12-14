import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  IsUUID,
  MinLength,
} from 'class-validator';

export class CreateParticipantDto {
  @ApiProperty({
    example: 'Juan Pérez',
    description: 'Nombre completo del participante',
  })
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty({
    example: 'juan@email.com',
    description: 'Correo electrónico único',
  })
  @IsEmail()
  email: string;

  @ApiProperty({
    example: '123456',
    description: 'Contraseña (mínimo 6 caracteres)',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password: string;

  @ApiPropertyOptional({
    example: 'c1b2a3d4-e123-4567-890a-bcdef1234567',
    description: 'ID del participante padre (referido)',
  })
  @IsOptional()
  @IsUUID()
  parentId?: string;
}
