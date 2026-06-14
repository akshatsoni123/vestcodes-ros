import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { PrismaService } from '../prisma/prisma.service';
import { TableTokenService } from './table-token.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwtService: JwtService,
    private readonly tableToken: TableTokenService,
  ) {}

  async login(email: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { email } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    const payload = {
      sub: user.id,
      role: user.role,
      restaurantId: user.restaurantId,
    };

    return {
      accessToken: this.jwtService.sign(payload),
      user: {
        id: user.id,
        email: user.email,
        role: user.role,
        restaurantId: user.restaurantId,
      },
    };
  }

  /**
   * Validates that a table QR token is authentic.
   * Looks up the table, verifies the HMAC token, and returns the table.
   * Throws if the table doesn't exist or the token is forged.
   */
  async verifyTableToken(tableId: number, token: string) {
    const table = await this.prisma.table.findUnique({
      where: { id: tableId },
      include: { restaurant: true },
    });
    if (!table) throw new UnauthorizedException('Table not found');

    const valid = this.tableToken.verify(token, table.id, table.restaurantId);
    if (!valid) throw new UnauthorizedException('Invalid table token');

    return table;
  }
}
