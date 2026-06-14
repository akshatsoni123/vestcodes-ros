// src/menu/menu.controller.ts
import { Controller, Get, Post, Patch, Body, Param, Headers, UseGuards, Req } from '@nestjs/common';
import { MenuService } from './menu-service';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Controller('api/menu')
@UseGuards(RolesGuard)
export class MenuController {
  constructor(private readonly menuService: MenuService) {}

  // GET /api/menu — public, returns available items for customer page [cite: 44]
  @Get()
  getPublicMenu(@Headers('x-restaurant-id') restaurantId: string) {
    return this.menuService.findAllPublic(restaurantId);
  }

  // GET /api/menu/items — manager only, returns all items [cite: 15]
  @Get('items')
  @Roles('manager')
  getManagerMenu(@Req() req: any) {
    return this.menuService.findAllManager(req.user.restaurantId);
  }

  // POST /api/menu/items — manager only, create a new item [cite: 15]
  @Post('items')
  @Roles('manager')
  createItem(@Req() req: any, @Body() dto: CreateMenuItemDto) {
    return this.menuService.create(req.user.restaurantId, dto);
  }

  // PATCH /api/menu/items/:id — manager only, update item details [cite: 15]
  @Patch('items/:id')
  @Roles('manager')
  updateItem(@Req() req: any, @Param('id') id: string, @Body() dto: UpdateMenuItemDto) {
    return this.menuService.update(req.user.restaurantId, id, dto);
  }

  // PATCH /api/menu/items/:id/toggle — manager only, toggle availability on/off [cite: 44]
  @Patch('items/:id/toggle')
  @Roles('manager')
  toggleItem(@Req() req: any, @Param('id') id: string) {
    return this.menuService.toggleAvailability(req.user.restaurantId, id);
  }
}