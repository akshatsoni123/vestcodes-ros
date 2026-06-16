import { IsOptional, IsString } from 'class-validator';

export class QueryBillingDto {
  @IsOptional()
  @IsString()
  search?: string;
}
