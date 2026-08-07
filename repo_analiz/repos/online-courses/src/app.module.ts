import { Module } from '@nestjs/common';
import { UsersModule } from './modules/Userlar_Boshqaruvi/users/users.module';
import { CategoryModule } from './modules/Kurslar_Boshqaruvi/category/category.module';
import { CoreModule } from './core/core.module';
import { ConfigModule } from '@nestjs/config';
import { CoursesModule } from './modules/Kurslar_Boshqaruvi/courses/courses.module';
import { AdminModule } from './modules/Xafvsizlik_Boshqaruvi/admin/admin.module';
import { MentorProfileModule } from './modules/Kurslar_Boshqaruvi/mentor-profile/mentor-profile.module';
import { AssisgnedCoursesModule } from './modules/Kurslar_Boshqaruvi/assisgned_courses/assisgned_courses.module';
import { PurcachedCoursesModule } from './modules/Kurslar_Boshqaruvi/purcached_courses/purcached_courses.module';
import { RatingModule } from './modules/Userlar_Boshqaruvi/rating/rating.module';
import { LessonsModule } from './modules/Darslar_boshqaruvi/lessons/lessons.module';
import { LastActivitiyModule } from './modules/Userlar_Boshqaruvi/last_activitiy/last_activitiy.module';
import { LessonModulsModule } from './modules/Darslar_boshqaruvi/lesson_moduls/lesson_moduls.module';
import { LessonViewsModule } from './modules/Darslar_boshqaruvi/lesson_views/lesson_views.module';
import { LessonFilesModule } from './modules/Darslar_boshqaruvi/lesson_files/lesson_files.module';
import { HomeworksModule } from './modules/Vazifalar_Bosharuvi/homeworks/homeworks.module';
import { HomeworkSubmissionsModule } from './modules/Vazifalar_Bosharuvi/homework_submissions/homework_submissions.module';
import { ExamsModule } from './modules/Darslar_boshqaruvi/exams/exams.module';
import { ExamResultsModule } from './modules/Darslar_boshqaruvi/exam_results/exam_results.module';
import { QuestionsModule } from './modules/Darslar_boshqaruvi/questions/questions.module';
import { QuestionAnswersModule } from './modules/Darslar_boshqaruvi/question_answers/question_answers.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: ['.env'],
    }),
    UsersModule,
    CategoryModule,
    CoreModule,
    CoursesModule,
    AdminModule,
    MentorProfileModule,
    AssisgnedCoursesModule,
    PurcachedCoursesModule,
    RatingModule,
    LessonsModule,
    LastActivitiyModule,
    LessonModulsModule,
    LessonViewsModule,
    LessonFilesModule,
    HomeworksModule,
    HomeworkSubmissionsModule,
    ExamsModule,
    ExamResultsModule,
    QuestionsModule,
    QuestionAnswersModule,
  ],
})
export class AppModule {};
