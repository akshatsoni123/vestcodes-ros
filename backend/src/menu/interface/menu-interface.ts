// src/menu/interfaces/menu.interface.ts

export type OrderStatus = 'PENDING' | 'APPROVED' | 'PREPARING' | 'READY' | 'SERVED' | 'REJECTED';

export interface MenuItem {
  id: string;
  restaurantId: string; // Scoped mapping rule per PRD [cite: 98, 146]
  name: string;
  description: string;
  price: number;
  category: string; // Free-text field [cite: 61]
  imageUrl?: string;
  available: boolean;
}