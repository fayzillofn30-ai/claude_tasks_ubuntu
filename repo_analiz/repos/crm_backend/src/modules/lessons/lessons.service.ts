import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLessonDto } from './dto/create-lesson.dto';
import { UpdateLessonDto } from './dto/update-lesson.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class LessonsService {
  constructor(private readonly prisma: PrismaService) { }

  private flattenLesson(lesson: any) {
    if (!lesson) return null;
    return {
      id: lesson.id,
      lessonNumber: lesson.lessonNumber,
      startDate: lesson.startDate,
      endDate: lesson.endDate,
      isDeleted: lesson.isDeleted,

      groupId: lesson.groupId,
      groupName: lesson.group?.name,
      roomName: lesson.group?.rom?.name,
      roomNumber: lesson.group?.rom?.romNumber,

      teacherId: lesson.teacherId,
      teacherName:
        `${lesson.teacher?.user?.firstName || ''} ${lesson.teacher?.user?.lastName || ''}`.trim(),

      studentsCount: lesson.group?.students?.length || 0,
      attendCount: lesson.Attendentionals?.length || 0,
    };
  }

  /**
   * ✅ ROOM BANDLIGINI TEKSHIRISH
   */
  private async checkRoomAvailability(roomId: string, startDate: Date, endDate: Date, excludeLessonId?: string) {
    const overlappingLesson = await this.prisma.lesson.findFirst({
      where: {
        isDeleted: false,
        id: excludeLessonId ? { not: excludeLessonId } : undefined,
        group: {
          romId: roomId,
          isDeleted: false,
        },
        // vaqt oraliqlarini to‘qnashishini tekshirish
        OR: [
          {
            startDate: { lte: endDate },
            endDate: { gte: startDate },
          },
        ],
      },
      include: { group: true },
    });

    if (overlappingLesson) {
      throw new BadRequestException(
        `Xona [${overlappingLesson.group.romId}] bu vaqtda band! (${overlappingLesson.startDate.toISOString()} - ${overlappingLesson.endDate.toISOString()})`,
      );
    }
  }




  /**
   * CREATE LESSON
   */
  async create(data: CreateLessonDto) {
    const { groupId, startDate, teacherId } = data;

    const existsTeacher = await this.prisma.staff.findFirst({
      where: { id: teacherId, role: 'TEACHER', isDeleted: false },
      include: { user: true },
    });
    if (!existsTeacher || existsTeacher.user.isDeleted)
      throw new BadRequestException('Teacher not found or deleted!');

    const oldGroup = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { course: true, rom: true },
    });
    if (!oldGroup) throw new BadRequestException(`Group not found by id [${groupId}]`);
    if (oldGroup.isEnd) throw new BadRequestException(`Group [${oldGroup.name}] is ended!`);
    if (!oldGroup.isStart) throw new BadRequestException(`Group not started!`);

    // === END DATE ===
    const endDate = new Date(startDate);
    endDate.setMinutes(endDate.getMinutes() + oldGroup.course.durationMinut);

    // ✅ XONA BANDLIGINI TEKSHIRISH
    await this.checkRoomAvailability(oldGroup.romId, startDate, endDate);

    // === LAST LESSON ===
    const lastLesson = await this.prisma.lesson.findFirst({
      where: { groupId },
      orderBy: { lessonNumber: 'desc' },
    });
    const lessonNumber = lastLesson ? lastLesson.lessonNumber + 1 : 1;

    const newLesson = await this.prisma.lesson.create({
      data: {
        groupId,
        teacherId,
        startDate,
        endDate,
        lessonNumber,
      },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: 'Lesson created successfully',
      lesson: this.flattenLesson(newLesson),
    };
  }

  /**
   * UPDATE LESSON
   */
  async update(id: string, data: UpdateLessonDto) {
    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: { group: { include: { rom: true, course: true } } },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or deleted!');

    // vaqt o‘zgartirilgan bo‘lsa, bandlikni tekshiramiz
    const startDate = data.startDate ? new Date(data.startDate) : oldLesson.startDate;
    const endDate = new Date(new Date(startDate).getTime() + oldLesson.group.course.durationMinut * 60000);

    await this.checkRoomAvailability(oldLesson.group.romId, startDate, endDate, id);

    const updatedLesson = await this.prisma.lesson.update({
      where: { id },
      data: { ...data, startDate, endDate },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    return {
      message: `Lesson [${id}] updated successfully`,
      lesson: this.flattenLesson(updatedLesson),
    };
  }


  /**
   * FIND ALL LESSONS
   */
  async findAll() {
    const lessons = await this.prisma.lesson.findMany({
      where: { isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'desc' },
    });

    return {
      message: 'All active lessons',
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * FIND ONE BY LESSON ID
   */
  async findOneByLessonId(id: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found or deleted!');

    return {
      message: `Lesson [${id}] details`,
      lesson: this.flattenLesson(lesson),
    };
  }

  /**
   * GET ALL LESSONS BY GROUP ID
   */
  async getAll_Lesson_byGroupId(groupId: string) {
    const lessons = await this.prisma.lesson.findMany({
      where: { groupId, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
      orderBy: { startDate: 'asc' },
    });

    return {
      message: `Lessons by group [${groupId}]`,
      count: lessons.length,
      lessons: lessons.map((l) => this.flattenLesson(l)),
    };
  }

  /**
   * GET LESSON BY START DATE
   */
  async getLesson_ByStartDate(startDate: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { startDate, isDeleted: false },
      include: {
        group: { include: { rom: true, students: true } },
        teacher: { include: { user: true } },
        Attendentionals: true,
      },
    });

    if (!lesson) throw new NotFoundException('Lesson not found for given startDate');

    return {
      message: `Lesson found by startDate [${startDate}]`,
      lesson: this.flattenLesson(lesson),
    };
  }


  /**
   * SOFT DELETE LESSON
   */
  async remove(id: string) {
    const oldLesson = await this.prisma.lesson.findFirst({
      where: { id, isDeleted: false },
    });
    if (!oldLesson) throw new NotFoundException('Lesson not found or already deleted!');

    await this.prisma.lesson.update({
      where: { id },
      data: { isDeleted: true },
    });

    return {
      message: `Lesson [${id}] soft deleted successfully`,
    };
  }

}
