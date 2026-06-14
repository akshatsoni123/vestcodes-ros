import { Injectable } from '@nestjs/common';
import { createHmac } from 'crypto';

@Injectable()
export class TableTokenService {
  private readonly secret = process.env.JWT_SECRET ?? 'change_me_in_production';

  /** Produce a short HMAC token for a given table + restaurant pair. */
  sign(tableId: number, restaurantId: number): string {
    return createHmac('sha256', this.secret)
      .update(`${tableId}:${restaurantId}`)
      .digest('hex')
      .slice(0, 24);
  }

  /**
   * Verify the token matches the tableId + restaurantId.
   * Returns false if the token was tampered with, preventing a customer
   * from swapping to a different table number.
   */
  verify(token: string, tableId: number, restaurantId: number): boolean {
    const expected = this.sign(tableId, restaurantId);
    return token === expected;
  }
}
