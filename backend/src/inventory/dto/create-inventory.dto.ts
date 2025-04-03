import { IsEnum, IsString, IsNumber, IsDate, IsOptional, ValidateIf, IsObject, ValidateNested, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class SpecificParametersDto {
  @IsString()
  d: string;

  @IsString()
  g: string;

  @IsString()
  h: string;
}

export class CreateInventoryDto {
  @IsEnum(['IMPLANT', 'ABUTMENT', 'COMPOSITE', 'LAMINATE'])
  category: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsDate()
  @Type(() => Date)
  productionDate: Date;

  @IsDate()
  @Type(() => Date)
  expiryDate: Date;

  @IsOptional()
  @ValidateIf(o => o.category === 'IMPLANT')
  @IsString()
  size?: string;

  @IsOptional()
  @ValidateIf(o => o.category === 'ABUTMENT')
  @IsObject()
  @ValidateNested()
  @Type(() => SpecificParametersDto)
  specificParameters?: SpecificParametersDto;
} 