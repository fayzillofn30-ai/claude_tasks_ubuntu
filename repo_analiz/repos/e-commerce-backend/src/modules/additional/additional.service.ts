import { Injectable } from '@nestjs/common';
import { CreateAdditionalDto } from './dto/create-additional.dto';
import { UpdateAdditionalDto } from './dto/update-additional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { CategoriesService } from '../categories/categories.service';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Additional } from '@prisma/client';

@Injectable()
export class AdditionalService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService,
  ) { }

  async create(data: CreateAdditionalDto) {
    // console.log("Additional service  check propertyId exists ",data)
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.Additional, "propertyId", data.propertyId)
    // console.log("Additional service  check  exists ",data)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PROPERTIES, "id", data.propertyId)
    // console.log("Additional service  check propertyId exists ",data)
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.BuildType, "id", data.buildTypeId)
    // console.log("Additional service  check propertyId exists ",data)

    return {
      message: 'This action adds a new additional',
      newAdditional: await this.prisma.additional.create({ data: { ...data } })
    };
  }

  async findAll() {
    return {
      message: `This action returns all additional`,
      data: await this.prisma.additional.findMany()
    };
  }

  async findOne(id: string) {
    return {
      message: `This action returns a #${id} additional`,
      data: await checkExistsResurs(this.prisma, ModelsEnumInPrisma.Additional, "id", id)
    };
  }

  async update(id: string, data: UpdateAdditionalDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.Additional, "id", id)
    
    const query: Partial<Additional> = {}

    if (data.propertyId) {
      await checkExistsResurs(this.prisma, ModelsEnumInPrisma.PROPERTIES, "id", data.propertyId)
      query.propertyId = data.propertyId
    }
    if (data.buildTypeId) {
      await checkExistsResurs(this.prisma, ModelsEnumInPrisma.BuildType, "id", data.buildTypeId)
      query.buildTypeId = data.buildTypeId
    }
    Object.keys(data).forEach(key => {
      if(!["propertyId","buildTypeId"].includes(key) ){
        (query as any)[key] = data[key]
      }
    })

    return {
      message: `This action updates a #${id} additional`,
      data: await this.prisma.additional.update({
        where: { id: id },
        data: query
      })
    };
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.Additional,"id",id)
    return {
      message : `This action removes a #${id} additional`,
      data : await this.prisma.additional.delete({where : {id : id}})
    };
  }
}
