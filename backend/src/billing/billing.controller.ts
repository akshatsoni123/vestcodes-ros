import {
  Controller,
  Get,
  Param,
  Query,
  Res,
  UseGuards,
  ParseIntPipe,
  Request,
} from '@nestjs/common';
import { Response } from 'express';
import { BillingService } from './billing.service';
import { QueryBillingDto } from './dto/query-billing.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';

@Controller('billing')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('manager')
export class BillingController {
  constructor(private readonly billingService: BillingService) {}

  @Get()
  findAll(@Request() req, @Query() query: QueryBillingDto) {
    return this.billingService.findAll(req.user.restaurantId, query);
  }

  /** Declared BEFORE :id — prevents 'export' being parsed as an integer param */
  @Get('export')
  async exportXlsx(
    @Request() req,
    @Res({ passthrough: true }) res: Response,
  ) {
    const buffer = await this.billingService.exportXlsx(req.user.restaurantId);
    res.setHeader(
      'Content-Type',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    );
    res.setHeader('Content-Disposition', 'attachment; filename="invoices.xlsx"');
    return buffer;
  }

  @Get(':id')
  findOne(@Request() req, @Param('id', ParseIntPipe) id: number) {
    return this.billingService.findOne(id, req.user.restaurantId);
  }
}
