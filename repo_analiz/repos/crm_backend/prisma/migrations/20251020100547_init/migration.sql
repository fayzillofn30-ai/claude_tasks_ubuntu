-- CreateEnum
CREATE TYPE "RoleStafs" AS ENUM ('ADMIN', 'TEACHER', 'ASISTANT', 'STUDENT');

-- CreateEnum
CREATE TYPE "PaymentStatus" AS ENUM ('PENDING', 'SUCCESS', 'CANCEL');

-- CreateEnum
CREATE TYPE "Days" AS ENUM ('Monday', 'Sunday', 'Wensday', 'Thusday');

-- CreateTable
CREATE TABLE "Rom" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "romNumber" INTEGER NOT NULL,
    "pleaces" INTEGER NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT true,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Rom_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "courses" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "published" BOOLEAN NOT NULL DEFAULT false,
    "durationMont" INTEGER NOT NULL DEFAULT 3,
    "weekDays" INTEGER[] DEFAULT ARRAY[1, 3, 5]::INTEGER[],
    "durationMinut" INTEGER NOT NULL,
    "image" TEXT,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "courses_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "groupes" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "courseId" TEXT NOT NULL,
    "romId" TEXT NOT NULL,
    "inActive" BOOLEAN NOT NULL,
    "isEnd" BOOLEAN NOT NULL DEFAULT false,
    "isStart" BOOLEAN NOT NULL DEFAULT false,
    "startDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "groupes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "staffs" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" "RoleStafs" NOT NULL DEFAULT 'STUDENT',
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "staffs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "password" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "birthDay" TIMESTAMP(3) NOT NULL,
    "father" TEXT,
    "image" TEXT,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "student_group" (
    "id" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "student_group_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "lessons" (
    "id" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "teacherId" TEXT NOT NULL,
    "lessonNumber" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "lessons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "attendentionals" (
    "id" TEXT NOT NULL,
    "lessonId" TEXT NOT NULL,
    "studentId" TEXT NOT NULL,
    "kelganVaqti" TIMESTAMP(3),
    "kelgan" BOOLEAN NOT NULL DEFAULT false,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "attendentionals_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "group_payments" (
    "id" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'PENDING',
    "paymentMonth" INTEGER NOT NULL,
    "paymentDate" TIMESTAMP(3) NOT NULL,
    "studentId" TEXT NOT NULL,
    "groupId" TEXT NOT NULL,
    "isDeleted" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "group_payments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "groupes" ADD CONSTRAINT "groupes_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupes" ADD CONSTRAINT "groupes_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "groupes" ADD CONSTRAINT "groupes_romId_fkey" FOREIGN KEY ("romId") REFERENCES "Rom"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "staffs" ADD CONSTRAINT "staffs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_group" ADD CONSTRAINT "student_group_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "student_group" ADD CONSTRAINT "student_group_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groupes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_teacherId_fkey" FOREIGN KEY ("teacherId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "lessons" ADD CONSTRAINT "lessons_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groupes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendentionals" ADD CONSTRAINT "attendentionals_lessonId_fkey" FOREIGN KEY ("lessonId") REFERENCES "lessons"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "attendentionals" ADD CONSTRAINT "attendentionals_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_payments" ADD CONSTRAINT "group_payments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "staffs"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "group_payments" ADD CONSTRAINT "group_payments_groupId_fkey" FOREIGN KEY ("groupId") REFERENCES "groupes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
