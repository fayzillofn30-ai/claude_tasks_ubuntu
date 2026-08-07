import { BadGatewayException, BadRequestException, Injectable } from '@nestjs/common';
import { CreateRomDto } from './dto/create-rom.dto';
import { UpdateRomDto } from './dto/update-rom.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { ConfigService } from '@nestjs/config';
import { checAlreadykExistsResurs, checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { Rom } from '@prisma/client';

@Injectable()
export class RomService {

  constructor(
    private readonly prisma: PrismaService,
    private readonly config: ConfigService
  ) { }

  async getLidsStats() {
    try {
      const rooms = await this.prisma.rom.findMany({
        where: { isDeleted: false },
        select: {
          id: true,
          name: true,
          romNumber: true,
          Group: {
            where: { isDeleted: false },
            select: {
              id: true,
              students: {
                where: { isDeleted: false },
                select: { id: true }
              },
              Lesson: {
                where: { isDeleted: false },
                select: { id: true }
              }
            }
          }
        }
      })

      // 📊 Statistikani formatlash
      const stats = rooms.map((room) => {
        const groupCount = room.Group.length
        const studentCount = room.Group.reduce((acc, g) => acc + g.students.length, 0)
        const lessonCount = room.Group.reduce((acc, g) => acc + g.Lesson.length, 0)

        return {
          id: room.id,
          name: room.name,
          romNumber: room.romNumber,
          groupCount,
          studentCount,
          lessonCount,
        }
      })

      return {
        message: "Rooms statistics successfully fetched",
        count: stats.length,
        stats
      }

    } catch (error) {
      console.error(error)
      throw new BadGatewayException("Failed to load room statistics")
    }
  }

  async create(data: CreateRomDto) {
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "romNumber", data.romNumber)
    await checAlreadykExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "name", data.name)
    const newRom = await this.prisma.rom.create({
      data: data
    })
    return {
      message: 'This action adds a new rom',
      rom: newRom
    };
  }

  async findAll() {
    return {
      message: `This action returns all rom`,
      roms: await this.prisma.rom.findMany()
    };
  }

  async findOne(id: string) {
    let rom = await this.prisma.rom.findFirst({ where: { id: id } })
    if (!rom) {
      throw new BadRequestException(`Rom not found by id [${id}] `)
    }
    return {
      message: `This action returns a #${id} rom`,
      rom: rom
    };
  }

  async update(id: string, data: UpdateRomDto) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "id", id)
    if (data.romNumber) {
      const OLdROm = await this.prisma.rom.findFirst({ where: { romNumber: data.romNumber } })
      if (OLdROm && OLdROm.id !== id) throw new BadGatewayException(`Already exists rom by romNumber [${data.romNumber}]`)
    }
    if (data.name) {
      const OLdROm = await this.prisma.rom.findFirst({ where: { name: data.name } })
      if (OLdROm && OLdROm.id !== id) throw new BadGatewayException(`Already exists rom by name [${data.name}]`)
    }
    const updatedRom = await this.prisma.rom.update({
      where: { id: id },
      data: { ...data }
    })
    return {
      message: `This action updates a #${id} rom`,
      rom: updatedRom
    };
  }

  async remove(id: string) {
    await checkExistsResurs(this.prisma, ModelsEnumInPrisma.ROM, "id", id)

    if ((await this.prisma.group.findFirst({ where: { romId: id } }))) {
      throw new BadRequestException(`Reference exists by romId [${id}] in group `)
    }

    const deletedRom = await this.prisma.rom.delete({
      where: { id: id }
    })

    return {
      message: `This action removes a #${id} rom`,
      rom: deletedRom
    };
  }
}
