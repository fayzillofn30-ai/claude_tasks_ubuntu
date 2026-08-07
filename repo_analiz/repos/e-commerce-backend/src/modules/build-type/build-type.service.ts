import { Injectable } from '@nestjs/common';
import { CreateBuildTypeDto } from './dto/create-build-type.dto';
import { UpdateBuildTypeDto } from './dto/update-build-type.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';

@Injectable()
export class BuildTypeService {

  constructor(
    private readonly prisma : PrismaService,
    private readonly config : ConfigService
  ){}

  async create(data: CreateBuildTypeDto) {
    await checAlreadykExistsResurs(this.prisma,ModelsEnumInPrisma.BuildType,"name",data.name)
    return {
      message : 'This action adds a new buildType',
      data : await this.prisma.buildType.create({data : {name : data.name}})
    };
  }

  async findAll() {
    return {
      message : `This action returns all buildType`,
      data : await this.prisma.buildType.findMany()
    };
  }

  async findOne(id: string) {
    return {
      message : `This action returns a #${id} buildType`,
      data : await checkExistsResurs(this.prisma,ModelsEnumInPrisma.BuildType,"id",id)
    };
  }

  async update(id: string, data: UpdateBuildTypeDto) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.BuildType,"id",id)
    return {
      message : `This action updates a #${id} buildType`,
      data : await this.prisma.buildType.update({where : {id : id} ,data : {name : data.name}})
    };
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma,ModelsEnumInPrisma.BuildType,"id",id)
    return {
      message : `This action removes a #${id} buildType`,
      data : await this.prisma.buildType.delete({where : {id : id}})
    };
  }
}
