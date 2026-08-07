import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/core/prisma/prisma.service';
import { CreateStaffDto } from './dto/create-staff.dto';
import { checkExistsResurs } from 'src/common/types/check.functions.types';
import { ModelsEnumInPrisma } from 'src/common/types/global.types';
import { User } from '@prisma/client';
import { UserFindEntitiy } from 'src/modules/users/entities/user.entity';
import { StaffsService } from 'src/modules/staffs/staffs.service';

@Injectable()
export class StafssService {

    constructor(
        private readonly prisma: PrismaService,
        private readonly st : StaffsService,
    ) { }

    async createStaff(data: CreateStaffDto) {
        const existsUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
        if (existsUser.isDeleted) throw new BadRequestException("User is Deleted !")
        const newStaff = await this.prisma.staff.create({
            data: {
                userId : data.userId,
                role : data.role
            },
            include  : {
                user : {
                    select : UserFindEntitiy
                }
            }
        })
        return {
            message : "This action create new staff !",
            staff : this.st.flattenStaff(newStaff)
        }
    }

    async updateStaffRole(data : CreateStaffDto,staffId :string){
        const existsUser = await checkExistsResurs<User>(this.prisma, ModelsEnumInPrisma.USERS, "id", data.userId)
        if (existsUser.isDeleted) throw new BadRequestException("User is Deleted !")
        const newStaff = await this.prisma.staff.update({
            where : {id : staffId},
            data: {
                userId : data.userId,
                role : data.role
            },
            include  : {
                user : {
                    select : UserFindEntitiy
                }
            }
        })
        return {
            message : "This action create new staff !",
            staff : newStaff
        }
    }
}
