import { IsEnum, IsString, IsNumber, IsDate, IsOptional, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateInventoryDto {
  @IsString()
  itemId: string;

  @IsEnum([
    'Implant & Abutment Components',
    'Consumables & Disposables',
    'Impression & Matrix Materials',
    'Local Anesthetics & Pharmaceuticals',
    'Restorative Materials & Bonding Agents',
    'Endodontic & Irrigation Supplies',
    'Etching, Polishing & Bleaching Agents',
    'Surgical & Sterilization Supplies',
    'Dental Instruments & Accessories',
    'Cleaning, Disinfection & Maintenance Supplies',
    'Office & Miscellaneous Supplies'
  ])
  category: string;

  @IsString()
  subCategory: string;

  @IsString()
  brand: string;

  @IsString()
  model: string;

  @IsOptional()
  @IsString()
  description?: string;

  @IsNumber()
  @Min(0)
  quantity: number;

  @IsNumber()
  @Min(0)
  unitPrice: number;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  productionDate?: Date;

  @IsOptional()
  @IsDate()
  @Type(() => Date)
  expiryDate?: Date;

  @IsOptional()
  @IsString()
  supplier?: string;

  @IsOptional()
  @IsString()
  storageLocation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  reorderLevel?: number;

  @IsOptional()
  @IsString()
  barcode?: string;

  @IsOptional()
  @IsString()
  notes?: string;
} 