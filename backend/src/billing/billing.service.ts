import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { QueryBillingDto } from './dto/query-billing.dto';
import * as XLSX from 'xlsx';

@Injectable()
export class BillingService {
  constructor(private readonly prisma: PrismaService) {}

  private get include() {
    return {
      order: {
        include: {
          table: true,
          orderItems: { include: { menuItem: true } },
        },
      },
    };
  }

  findAll(restaurantId: number, query: QueryBillingDto) {
    const searchNum = query.search && !isNaN(Number(query.search))
      ? Number(query.search)
      : undefined;

    return this.prisma.invoice.findMany({
      where: {
        order: {
          restaurantId,
          ...(searchNum !== undefined
            ? { OR: [{ id: searchNum }, { table: { number: searchNum } }] }
            : {}),
        },
      },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(id: number, restaurantId: number) {
    const invoice = await this.prisma.invoice.findFirst({
      where: { id, order: { restaurantId } },
      include: this.include,
    });
    if (!invoice) throw new NotFoundException('Invoice not found');
    return invoice;
  }

  async exportXlsx(restaurantId: number): Promise<Buffer> {
    const invoices = await this.prisma.invoice.findMany({
      where: { order: { restaurantId } },
      include: this.include,
      orderBy: { createdAt: 'desc' },
    });

    const rows = invoices.map((inv) => ({
      'Invoice ID': inv.id,
      Date: inv.createdAt.toISOString().slice(0, 10),
      Table: inv.order.table.number,
      Items: inv.order.orderItems.map((i) => `${i.menuItem.name} x${i.quantity}`).join(', '),
      Subtotal: inv.subtotal,
      GST: inv.gstAmount,
      Total: inv.total,
    }));

    const ws = XLSX.utils.json_to_sheet(rows);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'Invoices');
    return XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer;
  }
}
