import {
  ConflictException,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { CreateAttendentionalDto,AttendanceDto } from './dto/create-attendentional.dto';
import { UpdateAttendentionalDto } from './dto/update-attendentional.dto';
import { PrismaService } from 'src/core/prisma/prisma.service';

@Injectable()
export class AttendentionalsService {
  constructor(private readonly prisma: PrismaService) {}

  // 🔹 Helper — normalize / flatten function
  private flattenRecord(record: any) {
    // safety checks for nested relations
    const student = record?.student ?? null;
    const user = student?.user ?? null;

    const studentFirstName = user?.firstName ?? student?.firstName ?? null;
    const studentLastName = user?.lastName ?? student?.lastName ?? null;
    const studentFullName =
      studentFirstName && studentLastName
        ? `${studentFirstName} ${studentLastName}`
        : studentFirstName ?? studentLastName ?? record.studentName ?? null;

    return {
      id: record.id,
      lessonId: record.lessonId,
      lessonName: record.lesson?.name ?? null,
      studentId: record.studentId,
      studentName: studentFullName,
      studentEmail: user?.email ?? record.studentEmail ?? null,
      studentPhone: user?.phone ?? record.studentPhone ?? null,
      kelganVaqti: record.kelganVaqti ?? null,
      kelgan: record.kelgan ?? false,
      isDeleted: record.isDeleted ?? false,
      createdAt: record.createdAt ?? null,
    };
  }

  // 🟢 CREATE (bulk create with attendances[])
  async create(data: CreateAttendentionalDto) {
    const { lessonId, attendances } = data;

    if (!attendances || !Array.isArray(attendances) || attendances.length === 0) {
      throw new BadRequestException('attendances array must be provided and non-empty.');
    }

    // 1. Dars borligini tekshir
    const lesson = await this.prisma.lesson.findUnique({
      where: { id: lessonId },
    });
    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    // 2. Student ID larni ajratib olamiz
    const studentIds = attendances.map((a) => a.studentId);

    // 3. Mavjud yozuvlarni tekshir
    const existingRecords = await this.prisma.attendentional.findMany({
      where: {
        lessonId,
        studentId: { in: studentIds },
        isDeleted: false,
      },
      select: { studentId: true },
    });

    const existingIds = new Set(existingRecords.map((r) => r.studentId));
    const newAttendances = attendances.filter((a) => !existingIds.has(a.studentId));

    if (newAttendances.length > 0) {
      // 4. createMany uchun tayyorlash
      const dataToInsert = newAttendances.map((a) => ({
        lessonId,
        studentId: a.studentId,
        kelgan: a.kelgan ?? false,
        kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
        isDeleted: a.isDeleted ?? false,
      }));

      // 5. Bazaga yozish
      await this.prisma.attendentional.createMany({
        data: dataToInsert,
        skipDuplicates: true,
      });
    }

    // 6. Shu bilan birga — agar serverga update qilish kerak bo'lsa, mavjudlarini yangilashni ham qo'shsa bo'ladi.
    // (Agar siz create endpoint orqali update ham kutmoqchi bo'lsangiz, shu yerda existinglarni update qiling.)

    return {
      message: `${newAttendances.length} attendance record(s) successfully created.`,
      createdCount: newAttendances.length,
      skippedCount: existingRecords.length,
    };
  }

  // 🟡 FIND ALL
  async findAll() {
    const records = await this.prisma.attendentional.findMany({
      where: { isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'desc' },
    });

    return {
      message: 'All attendance records retrieved',
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔵 FIND ONE
  async findOne(id: string) {
    const record = await this.prisma.attendentional.findUnique({
      where: { id },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
    });

    if (!record || record.isDeleted)
      throw new NotFoundException(`Attendance not found by id [#${id}]`);

    return {
      message: `Attendance record #${id} retrieved successfully`,
      attendentional: this.flattenRecord(record),
    };
  }

  // 🟠 UPDATE
  async update(id: string, data: UpdateAttendentionalDto) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: { include: { user: true } } },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    if (
      (data.lessonId && data.lessonId !== exist.lessonId) ||
      (data.studentId && data.studentId !== exist.studentId)
    ) {
      const conflict = await this.prisma.attendentional.findFirst({
        where: {
          lessonId: data.lessonId ?? exist.lessonId,
          studentId: data.studentId ?? exist.studentId,
          isDeleted: false,
        },
      });
      if (conflict && conflict.id !== id)
        throw new ConflictException(`This student already has attendance for this lesson.`);
    }

    const updated = await this.prisma.attendentional.update({
      where: { id },
      data: {
        lessonId: data.lessonId ?? exist.lessonId,
        studentId: data.studentId ?? exist.studentId,
        kelgan: data.kelgan ?? exist.kelgan,
        kelganVaqti: data.kelganVaqti ? new Date(data.kelganVaqti) : exist.kelganVaqti,
        isDeleted: data.isDeleted ?? exist.isDeleted,
      },
      include: { lesson: true, student: { include: { user: true } } },
    });

    return {
      message: `Attendance record #${id} updated successfully`,
      attendentional: this.flattenRecord(updated),
    };
  }

  /** 🔸 Get all attendance records by LESSON ID */
  async getAll_ByLessonId(lessonId: string) {
    const lesson = await this.prisma.lesson.findFirst({
      where: { id: lessonId, isDeleted: false },
    });

    if (!lesson) throw new NotFoundException(`Lesson not found by id [#${lessonId}]`);

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for lesson [#${lessonId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  /** 🔸 Get all attendance records by GROUP ID */
  async getAll_ByGroupId(groupId: string) {
    const group = await this.prisma.group.findFirst({
      where: { id: groupId, isDeleted: false },
      include: { Lesson: true },
    });

    if (!group) throw new NotFoundException(`Group not found by id [#${groupId}]`);

    // barcha lesson ID larni olish
    const lessonIds = group.Lesson.map((l) => l.id);

    if (lessonIds.length === 0)
      return { message: 'No lessons found for this group', count: 0, attendentionals: [] };

    const records = await this.prisma.attendentional.findMany({
      where: { lessonId: { in: lessonIds }, isDeleted: false },
      include: {
        lesson: true,
        student: { include: { user: true } },
      },
      orderBy: { kelganVaqti: 'asc' },
    });

    return {
      message: `All attendance records for group [#${groupId}]`,
      count: records.length,
      attendentionals: records.map((r) => this.flattenRecord(r)),
    };
  }

  // 🔴 REMOVE (soft delete)
  async remove(id: string) {
    const exist = await this.prisma.attendentional.findUnique({
      where: { id },
      include: { lesson: true, student: { include: { user: true } } },
    });

    if (!exist || exist.isDeleted)
      throw new NotFoundException(`Attendance record not found by id [#${id}]`);

    const deleted = await this.prisma.attendentional.update({
      where: { id },
      data: { isDeleted: true },
      include: { lesson: true, student: { include: { user: true } } },
    });

    return {
      message: `Attendance record #${id} soft-deleted successfully`,
      attendentional: this.flattenRecord(deleted),
    };
  }
}
