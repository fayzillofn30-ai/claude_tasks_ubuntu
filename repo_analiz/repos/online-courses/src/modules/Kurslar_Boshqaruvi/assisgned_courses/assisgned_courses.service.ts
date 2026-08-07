import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateAssisgnedCourseDto } from './dto/create-assisgned_course.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AssisgnedCoursesService {
  constructor(
    private readonly prisma : PrismaService
  ){}
  async create(data : CreateAssisgnedCourseDto) {
    await this.checkExistsUser(data)
    await this.checkExistsCourse(data)
    await this.checkOldExistsAssignedCourse(data)
    const newAssignedCourse = await this.prisma.assignedCourse.create({data:data})
    return {
      message : 'This action adds a new assisgnedCourse',
      data : newAssignedCourse
    };
  }
  async checkExistsUser(data : CreateAssisgnedCourseDto){
    if(!(await this.prisma.user.findFirst({where :{id: data.userId}}))){
      throw new NotFoundException(`User not found by id : [${data.userId}]`)
    }
  }
  async checkExistsCourse(data : CreateAssisgnedCourseDto){
    if(!(await this.prisma.course.findFirst({where : {id : data.courseId}}))){
      throw new NotFoundException(`Course not found by CourseId : [${data.courseId}]`)
    }
  }
  async checkOldExistsAssignedCourse(data : CreateAssisgnedCourseDto){
    const oldAssignedCourse = await this.prisma.assignedCourse.findFirst({
      where: {
        AND : [
          {userId : data.userId},
          {courseId : data.courseId}
        ]
      },
      include : {
        user : {
          select : {fullName:true}
        },
        courses : {
          select : {name : true}
        }
      }
    });
    if(oldAssignedCourse){
      throw new BadRequestException(`Already exists assigned course : 
        by userId [${data.userId}] by courseId [${data.courseId}] , 
        Course name : [${oldAssignedCourse.courses.name}], 
        User fullname : [${oldAssignedCourse.user.fullName}]`
      );
    }
  }
  async findAll() {
    const assignedCourses = await this.prisma.assignedCourse.findMany({
      include : {
        courses : {
          select : {
            name : true,
            banner : true,
            introVideo : true,
            level : true,
            category : {
              select : {
                id : true,
                name : true,
              }
            },
            mentor : true
          }
        }
      }
    })
    return {
      message : `This action returns all assisgnedCourses`,
      data : assignedCourses
    };
  }

  async findOne(id: string) {
    const oldAssignedCourse = await this.prisma.assignedCourse.findFirst({
      where: {id : id},
      include : {
        user : true,
        courses : {
          include : {
            mentor :{
              include : {
                user : true
              }
            },
            category : true
          }
        }
      }
    });
    if(!oldAssignedCourse){
      throw new NotFoundException(`This action find a #${id} assisgnedCourse not found`)
    }
    return {
      message : `This action returns a #${id} assisgnedCourse`,
      data:oldAssignedCourse
    };
  }

  async remove(id: string) {
    const oldAssignedCourse = await this.prisma.assignedCourse.findFirst({where : {id :id}})
    if(!oldAssignedCourse) throw new NotFoundException("Assigned Course not found !")
    const result = await this.prisma.assignedCourse.delete({where : {id: id}})
    return {
      message  : `This action removes a #${id} assisgnedCourse`,
      data : result
    };
  }
}
