import { IsEnum, IsString, IsNumber, IsDate, IsOptional, Min, IsNotEmpty, MaxLength, IsUUID, Matches, IsISO8601, IsDateString } from 'class-validator';
import { Type } from 'class-transformer';
import { IsDateAfter } from '../../common/validators/date-order.validator';

export class CreateInventoryDto {
  @IsString()
  @IsNotEmpty({ message: 'Item ID is required' })
  @Matches(/^[a-zA-Z0-9-_]+$/, { message: 'Item ID can only contain letters, numbers, hyphens, and underscores' })
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
  ], { message: 'Invalid category. Please select from the available options.' })
  category: string;

  @IsString()
  @IsNotEmpty({ message: 'Subcategory is required' })
  @MaxLength(50, { message: 'Subcategory cannot exceed 50 characters' })
  subCategory: string;

  @IsString()
  @IsNotEmpty({ message: 'Brand is required' })
  @MaxLength(100, { message: 'Brand cannot exceed 100 characters' })
  brand: string;

  @IsString()
  @IsNotEmpty({ message: 'Model is required' })
  @MaxLength(100, { message: 'Model cannot exceed 100 characters' })
  model: string;

  @IsOptional()
  @IsString()
  @MaxLength(500, { message: 'Description cannot exceed 500 characters' })
  description?: string;

  @IsNumber()
  @Min(0, { message: 'Quantity must be a non-negative number' })
  quantity: number;

  @IsNumber()
  @Min(0, { message: 'Unit price must be a non-negative number' })
  unitPrice: number;

  @IsOptional()
  @IsISO8601({ strict: false })
  @Type(() => String)
  productionDate?: string;

  @IsOptional()
  @IsISO8601({ strict: false })
  @Type(() => String)
  @IsDateAfter('productionDate', { message: 'Expiry date must be after production date' })
  expiryDate?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Supplier cannot exceed 100 characters' })
  supplier?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100, { message: 'Storage location cannot exceed 100 characters' })
  storageLocation?: string;

  @IsOptional()
  @IsNumber()
  @Min(0, { message: 'Reorder level must be a non-negative number' })
  reorderLevel?: number;

  @IsOptional()
  @IsString()
  @Matches(/^[0-9]{8,13}$/, { message: 'Barcode must be 8-13 digits' })
  barcode?: string;

  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Notes cannot exceed 1000 characters' })
  notes?: string;
} 