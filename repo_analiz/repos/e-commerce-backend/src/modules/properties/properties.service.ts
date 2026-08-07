import { Injectable } from '@nestjs/common';
import { CreatePropertyDto } from './dto/create-property.dto';
import { UpdatePropertyDto } from './dto/update-property.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { propertyEntities } from './entities/property.entity';
import { Property } from '@prisma/client';

@Injectable()
export class PropertiesService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async create(data: CreatePropertyDto, ownerId: string) {
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.PROPERTIES, "title", data.title)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.USERS, "id", ownerId)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.Category, "id", data.categoryId)
    return {
      message: 'This action adds a new property',
      data: await this.prisma.property.create({ data: { ...data, ownerId } })
    };
  }

  async findAll(ownerId?: string | undefined, search?: Partial<Property>) {

    const query: Partial<Omit<Property, "features">> = {}

    if (ownerId) {
      query.ownerId = ownerId
    }

    if (search) {
      Object.keys(search).forEach(key => {
        query[key] = ["price","discount"].includes(search[key]) ? parseInt(search[key]) : search[key]
      })
    }

    const data = Object.values(query) ? await this.prisma.property.findMany({where : {...query}, select : propertyEntities}) : await this.prisma.property.findMany({select : propertyEntities})

    return {
      message: `This action returns all properties`,
      data
    };
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} property`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PROPERTIES, "id", id)
    };
  }

  async update(id: string, data: UpdatePropertyDto) {
    return `This action updates a #${id} property`;
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PROPERTIES, "id", id)

    return {
      message: `This action removes a #${id} property`,
      data: await this.prisma.property.delete({ where: { id: id } })
    };
  }
}
