import {
  Injectable,
  NotFoundException,
  BadRequestException,
  ConflictException,
} from '@nestjs/common';
import { PrismaService } from '@/config/prisma.service';
import { UpdateSetupDto } from './dto/update-setup.dto';
import { AddItemDto, CategoryType } from './dto/add-item.dto';
import { DeleteItemDto } from './dto/delete-item.dto';
import { UpdateItemDto } from './dto/update-item.dto';

@Injectable()
export class SetupService {
  constructor(private prisma: PrismaService) {}

  async getSetup(userId: string) {
    const setup = await this.prisma.setupConfig.findUnique({
      where: { userId },
    });

    if (!setup) {
      return this.createDefaultSetup(userId);
    }

    return setup;
  }

  async updateSetup(userId: string, updateSetupDto: UpdateSetupDto) {
    const setup = await this.prisma.setupConfig.upsert({
      where: { userId },
      update: updateSetupDto,
      create: {
        userId,
        ...updateSetupDto,
      },
    });

    return setup;
  }

  async addItem(userId: string, addItemDto: AddItemDto) {
    const { category, itemName } = addItemDto;

    const setup = await this.getSetup(userId);

    const currentItems = (setup[category] as string[]) || [];

    if (currentItems.includes(itemName)) {
      throw new ConflictException(`Item "${itemName}" already exists in ${category}`);
    }

    const updatedItems = [...currentItems, itemName];

    const updatedSetup = await this.prisma.setupConfig.update({
      where: { userId },
      data: {
        [category]: updatedItems,
      },
    });

    return {
      category,
      itemName,
      items: updatedSetup[category],
    };
  }

  async deleteItem(userId: string, deleteItemDto: DeleteItemDto) {
    const { category, itemName } = deleteItemDto;

    const setup = await this.getSetup(userId);

    const currentItems = (setup[category] as string[]) || [];

    if (!currentItems.includes(itemName)) {
      throw new NotFoundException(`Item "${itemName}" not found in ${category}`);
    }

    const updatedItems = currentItems.filter((item) => item !== itemName);

    const updatedSetup = await this.prisma.setupConfig.update({
      where: { userId },
      data: {
        [category]: updatedItems,
      },
    });

    return {
      category,
      itemName,
      items: updatedSetup[category],
    };
  }

  async updateItem(userId: string, updateItemDto: UpdateItemDto) {
    const { category, oldItemName, newItemName } = updateItemDto;

    const setup = await this.getSetup(userId);
    const currentItems = (setup[category] as string[]) || [];

    if (!currentItems.includes(oldItemName)) {
      throw new NotFoundException(`Item "${oldItemName}" not found in ${category}`);
    }

    if (currentItems.includes(newItemName) && oldItemName !== newItemName) {
      throw new ConflictException(`Item "${newItemName}" already exists in ${category}`);
    }

    const updatedItems = currentItems.map((item) => (item === oldItemName ? newItemName : item));

    const updatedSetup = await this.prisma.setupConfig.update({
      where: { userId },
      data: {
        [category]: updatedItems,
      },
    });

    return {
      category,
      oldItemName,
      newItemName,
      items: updatedSetup[category],
    };
  }

  private async createDefaultSetup(userId: string) {
    return this.prisma.setupConfig.create({
      data: {
        userId,
        accountSummary: [],
        incomeSources: [],
        needs: [],
        wants: [],
        savings: [],
        accountAssets: [],
        paydayDate: 1,
      },
    });
  }
}
