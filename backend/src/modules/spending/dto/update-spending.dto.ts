import { PartialType } from '@nestjs/swagger';
import { CreateSpendingDto } from './create-spending.dto';

export class UpdateSpendingDto extends PartialType(CreateSpendingDto) {}
