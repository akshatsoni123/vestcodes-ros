// src/menu/menu.service.ts
import { Injectable, NotFoundException } from '@nestjs/common';
import { MenuItem } from './interface/menu-interface';
import { CreateMenuItemDto } from './dto/create-menu-item.dto';
import { UpdateMenuItemDto } from './dto/update-menu-item.dto';

@Injectable()
export class MenuService {
  // Local seed array acting as our database table for the pilot [cite: 146]
  private menuItems: MenuItem[] = [
    {
      id: 'item_1',
      restaurantId: 'rest_alpha',
      name: 'Paneer Tikka Roll',
      description: 'Spiced paneer wrapped in fresh flatbread',
      price: 180,
      category: 'Main Course',
      available: true,
    },
    {
      id: 'item_2',
      restaurantId: 'rest_alpha',
      name: 'Cold Coffee',
      description: 'Blended espresso with vanilla ice cream',
      price: 120,
      category: 'Beverages',
      available: false,
    },
  ];

  findAllPublic(restaurantId: string): MenuItem[] {
    // Customers only see items where available is true [cite: 44]
    return this.menuItems.filter(
      (item) => item.restaurantId === restaurantId && item.available === true,
    );
  }

  findAllManager(restaurantId: string): MenuItem[] {
    // Managers can see every item record, regardless of flags [cite: 15]
    return this.menuItems.filter((item) => item.restaurantId === restaurantId);
  }

  create(restaurantId: string, dto: CreateMenuItemDto): MenuItem {
    const newItem: MenuItem = {
      id: `item_${Date.now()}`,
      restaurantId,
      name: dto.name,
      description: dto.description,
      price: dto.price,
      category: dto.category,
      imageUrl: dto.imageUrl || '',
      available: true, // Default initialization status
    };
    this.menuItems.push(newItem);
    return newItem;
  }

  update(restaurantId: string, id: string, dto: UpdateMenuItemDto): MenuItem {
    const item = this.menuItems.find((i) => i.id === id && i.restaurantId === restaurantId);
    if (!item) {
      throw new NotFoundException('Menu item not found under this restaurant tenant');
    }

    Object.assign(item, dto);
    return item;
  }

  toggleAvailability(restaurantId: string, id: string): MenuItem {
    const item = this.menuItems.find((i) => i.id === id && i.restaurantId === restaurantId);
    if (!item) {
      throw new NotFoundException('Menu item not found under this restaurant tenant');
    }

    item.available = !item.available;
    return item;
  }
}