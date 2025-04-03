import { Controller, Get, Post, Body, Patch, Param, Delete, Query, HttpStatus, HttpCode } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiQuery, ApiParam, ApiBody } from '@nestjs/swagger';
import { InventoryService } from './inventory.service';
import { CreateInventoryDto } from './dto/create-inventory.dto';
import { Inventory } from './schemas/inventory.schema';

@ApiTags('inventory')
@Controller('inventory')
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Create a new inventory item' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'The item has been successfully created.' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Invalid input data.' })
  @ApiBody({ type: CreateInventoryDto })
  create(@Body() createInventoryDto: CreateInventoryDto): Promise<Inventory> {
    return this.inventoryService.create(createInventoryDto);
  }

  @Get()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get all inventory items with optional filtering' })
  @ApiQuery({ name: 'category', required: false, description: 'Filter by category' })
  @ApiQuery({ name: 'subCategory', required: false, description: 'Filter by subcategory' })
  @ApiQuery({ name: 'brand', required: false, description: 'Filter by brand' })
  @ApiQuery({ name: 'supplier', required: false, description: 'Filter by supplier' })
  @ApiQuery({ name: 'minQuantity', required: false, description: 'Filter by minimum quantity' })
  @ApiQuery({ name: 'maxQuantity', required: false, description: 'Filter by maximum quantity' })
  @ApiQuery({ name: 'expiringBefore', required: false, description: 'Filter by expiry date before' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return all inventory items.' })
  findAll(
    @Query('category') category?: string,
    @Query('subCategory') subCategory?: string,
    @Query('brand') brand?: string,
    @Query('supplier') supplier?: string,
    @Query('minQuantity') minQuantity?: number,
    @Query('maxQuantity') maxQuantity?: number,
    @Query('expiringBefore') expiringBefore?: string,
  ): Promise<Inventory[]> {
    const filters: any = {};
    
    if (category) filters.category = category;
    if (subCategory) filters.subCategory = subCategory;
    if (brand) filters.brand = brand;
    if (supplier) filters.supplier = supplier;
    
    if (minQuantity || maxQuantity) {
      filters.quantity = {};
      if (minQuantity) filters.quantity.$gte = Number(minQuantity);
      if (maxQuantity) filters.quantity.$lte = Number(maxQuantity);
    }
    
    if (expiringBefore) {
      filters.expiryDate = { $lte: new Date(expiringBefore) };
    }
    
    return this.inventoryService.findAll(filters);
  }

  @Get('low-stock')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get items with low stock' })
  @ApiQuery({ name: 'threshold', required: false, description: 'Custom threshold for low stock (default: uses reorderLevel)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return items with low stock.' })
  findLowStock(@Query('threshold') threshold?: number): Promise<Inventory[]> {
    return this.inventoryService.findLowStock(threshold);
  }

  @Get('expiring')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get items expiring soon' })
  @ApiQuery({ name: 'days', required: false, description: 'Number of days until expiry (default: 30)' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return items expiring soon.' })
  findExpiringItems(@Query('days') days?: number): Promise<Inventory[]> {
    return this.inventoryService.findExpiringItems(days);
  }

  @Get(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Get a single inventory item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: HttpStatus.OK, description: 'Return the item.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found.' })
  findOne(@Param('id') id: string): Promise<Inventory> {
    return this.inventoryService.findOne(id);
  }

  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update an inventory item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiBody({ type: CreateInventoryDto })
  @ApiResponse({ status: HttpStatus.OK, description: 'The item has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found.' })
  update(
    @Param('id') id: string,
    @Body() updateInventoryDto: Partial<CreateInventoryDto>,
  ): Promise<Inventory> {
    return this.inventoryService.update(id, updateInventoryDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Delete an inventory item' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'The item has been successfully deleted.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found.' })
  remove(@Param('id') id: string): Promise<void> {
    return this.inventoryService.remove(id);
  }

  @Patch(':id/quantity')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Update item quantity' })
  @ApiParam({ name: 'id', description: 'Item ID' })
  @ApiBody({ schema: { type: 'object', properties: { quantity: { type: 'number', minimum: 0 } } } })
  @ApiResponse({ status: HttpStatus.OK, description: 'The quantity has been successfully updated.' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Item not found.' })
  updateQuantity(
    @Param('id') id: string,
    @Body('quantity') quantity: number,
  ): Promise<Inventory> {
    return this.inventoryService.updateQuantity(id, quantity);
  }
} 