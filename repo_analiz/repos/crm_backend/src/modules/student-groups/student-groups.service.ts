import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateStudentGroupDto } from './dto/create-student-group.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';


@Injectable()
export class StudentGroupsService {

  constructor(
    private readonly prisma: PrismaService
  ) { }

  async check_Student_And_Group(studentId: string, groupId: string) {
    const existsStudent = await this.prisma.staff.findFirst({
      where: { id: studentId },
      include: { user: true }
    })

    if (!existsStudent) {
      throw new NotFoundException(`Student not found by id [${studentId}]`)
    }
    const existsGroup = await this.prisma.group.findFirst({ where: { id: groupId } })

    if (existsStudent.user.isDeleted) throw new BadRequestException("Student isDeleted !")
    if (existsStudent.role !== "STUDENT") throw new BadRequestException(`Role must be student !`)


    if (!existsGroup) throw new NotFoundException(`Group not found by id [${groupId}] !`)
    if (existsGroup?.isEnd) throw new BadRequestException(`Group in ended !`)

    if ((await this.prisma.studentGroup.findFirst({ where: { studentId: studentId, groupId: groupId } }))) {
      throw new BadRequestException(`Student  already registired in group [${existsGroup.name}] `)
    }
  }

  async create(data: CreateStudentGroupDto) {

    await this.check_Student_And_Group(data.studentId, data.groupId)

    const newStudentGroup = await this.prisma.studentGroup.create({
      data: {
        studentId: data.studentId,
        groupId: data.groupId
      },
      include: {
        student: {
          include: {
            user: true
          }
        }
      }
    })

    return {
      message: 'This action adds a new studentGroup',
      studentGroup: newStudentGroup
    };
  }

  async getAllStatistika(roomId : string) {
    const res = await this.prisma.studentGroup.findMany({
      where : {group : {romId : roomId}},
      include: {
        student: {
          include: {
            user: true,
          },
        },
        group: {
          include: {
            course: true,
            rom: true,
            Lesson: true,
            teacher: {
              include: {
                user: true,
              },
            },
          },
        },
      },
    });

    return res.map((s) => {
      const {
        id,
        student,
        group,
      } = s;

      const { user: studentUser } = student;
      const {
        id: groupId,
        name,
        startDate,
        isStart,
        isEnd,
        inActive,
        course,
        rom,
        Lesson,
        teacher,
      } = group;

      const lessons = Lesson.map((l) => ({
        id: l.id,
        groupId: l.groupId,
        lessonNumber: l.lessonNumber,
        startDate: l.startDate,
        endDate: l.endDate,
        teacherId: l.teacherId,
        isDeleted: l.isDeleted,
      }));

      return {
        id, // studentGroup id
        student: {
          id: student.id,
          userId: student.userId,
          firstName: studentUser.firstName,
          lastName: studentUser.lastName,
          phone: studentUser.phone,
          email: studentUser.email,
          birthDay: studentUser.birthDay,
          father: studentUser.father,
          image: studentUser.image,
          createdAt: studentUser.createdAt,
        },
        group: {
          id: groupId,
          name,
          startDate,
          isStart,
          isEnd,
          inActive,
          course: {
            id: course.id,
            name: course.name,
            price: course.price,
          },
          rom: {
            id: rom.id,
            name: rom.name,
            romNumber: rom.romNumber,
          },
          teacher: {
            id: teacher.id,
            userId: teacher.userId,
            isDeleted: teacher.isDeleted,
            role: teacher.role,
            user: {
              firstName: teacher.user.firstName,
              lastName: teacher.user.lastName,
              email: teacher.user.email,
              phone: teacher.user.phone,
            },
          },
          lessons,
        },
      };
    });
  }


  async getidsbyStudenId(studentId: string) {
    return (await this.prisma.studentGroup.findMany({
      where: { studentId: studentId },
      select: { groupId: true }
    })).map(res => res.groupId)
  }
}
