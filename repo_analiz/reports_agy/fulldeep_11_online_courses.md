# Online Courses Backend — Chuqur (Fulldeep) Tahlil Hisoboti

**Sana:** 2026-08-03  
**Qamrab olingan source fayllar soni:** 154 ta  
**Loyiha joylashuvi:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/online-courses/`  

---

### 1. Noodatiy Yechim: Dynamic HTTP Action-Based Granular Permission System
#### FACT
- Fayl: `prisma/schema.prisma` (L17-L23, L77-L89) va `src/modules/Xafvsizlik_Boshqaruvi/admin/dto/create-permission.dto.ts` (L6-L28)
- Kod parchasi:
```prisma
enum Action { GET POST PUT PATCH DELETE }

model Permission {
  id      String   @id @default(auto()) @map("_id") @db.ObjectId
  model   String
  actions Action[]
  userId  String   @db.ObjectId
  user    User     @relation(fields: [userId], references: [id])
}
```
```typescript
export class CreatePermissionDto {
  @IsNotEmpty()
  @IsEnum(Models)
  model: Models;

  @IsArray()
  @IsEnum(Action, { each: true })
  actions: Action[];

  @IsString()
  @IsNotEmpty()
  userId: string;
}
```

#### OBSERVATION
Dasturchi oddiy darajadagi foydalanuvchi rollari (RBAC) bilan cheklanib qolmasdan, har bir domen modeli (`model`) uchun aniq HTTP verbalar massivini (`actions: Action[]`) biriktirishga mo'ljallangan dinamik ruxsatlar tizimini tuzgan. DTO darajasida `class-validator`ning `@IsEnum(Action, { each: true })` dekoratori orqali massiv ichidagi har bir kiruvchi HTTP metod alohida validatsiya qilinadi.

#### NEGA ODATIY EMAS
Odatda NestJS yoki Express loyihalarida huquqlarni boshqarish uchun statik va tayyor Role-Based Access Control (RBAC) yoki oddiy string formatdagi rollar (masalan, `ADMIN`, `USER`) ishlatiladi. Ushbu loyihada esa har bir model (masalan, `courses`, `users`, `lessons`) kesimida muayyan foydalanuvchiga aynan qaysi HTTP metodlarini (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) bajarish mumkinligini MongoDB enum array va DTO validatsiyasi orqali dinamik boshqarish yo'lga qo'yilgan.

---

### 2. Noodatiy Yechim: Custom Port Binding & Explicit Module Lifecycle Hooks for Redis Client
#### FACT
- Fayl: `src/core/redis/redis.service.ts` (L8-L23)
- Kod parchasi:
```typescript
@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
  private client: RedisClientType;

  async onModuleInit() {
    this.client = createClient({
      url: 'redis://localhost:6380',
    });

    this.client.on('error', (err) => console.error('❌ Redis error:', err));

    await this.client.connect();
    console.log('✅ Redis connected');
  }

  async onModuleDestroy() {
    await this.client.disconnect();
    console.log('❌ Redis disconnected');
  }
}
```

#### OBSERVATION
`RedisService` NestJS ramkasining `OnModuleInit` va `OnModuleDestroy` hayot sikli interfeyslarini amalga oshirib, Redis mijozini standart `6379` portida emas, balki maxsus tayinlangan `6380` porti orqali ishga tushiradi. Ulanish jarayonida xatoliklar console hodisalari orqali tutib olinadi va modul to'xtaganda ulanish toza uziladi.

#### NEGA ODATIY EMAS
Standart NestJS ilovalarida Redis odatda `@nestjs/cache-manager` yoki `ioredis` kabi tayyor NestJS modullari orqali standart `6379` portida va default konfiguratsiyada ulanadi. Bu yerda esa dasturchi Redis v4 mijozini past darajali API yordamida, noshtat custom port `6380` bilan hamda NestJS lifecycle hooklarini qo'lda yozib ulagan.

---

### 3. Noodatiy Yechim: Dual Media Field File Upload Interceptor & Dynamic Unique Suffix Generator
#### FACT
- Fayl: `src/common/types/course.types.ts` (L4-L15) va `src/modules/Kurslar_Boshqaruvi/courses/courses.controller.ts` (L35-L50)
- Kod parchasi:
```typescript
export const FileWriter = diskStorage({
  destination: './uploads/courses',
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, `${file.fieldname}-${uniqueSuffix}${extname(file.originalname)}`);
  },
});

export const filesInPut = [
  { name: 'banner', maxCount: 1 },
  { name: 'introVideo', maxCount: 1 },
];
```

#### OBSERVATION
Kurs yaratish jarayonida bir vaqtning o'zida ikkita har xil turdagi media fayllar — rasm (`banner`) va video (`introVideo`) fayllari bitta HTTP request orqali qabul qilinadi. `FileFieldsInterceptor` va custom `diskStorage` konfiguratsiyasi orqali har bir fayl nomiga unikallik bag'ishlovchi timestamp hamda nanosekundli tasodifiy son biriktirilib saqlanadi va service qatlamida ularning lokal server URL manzili shakllantiriladi.

#### NEGA ODATIY EMAS
Ko'pincha web ilovalarda media fayllar yoki alohida endpointlar orqali birma-bir yuklanadi yoki bitta universal yuklash middleware ishlatiladi. Dasturchi esa bitta form-data so'rovida ham rasm, ham video fayllarni alohida tayinlangan fieldname va dynamic suffix mexanizmi bilan xavfsiz va unikal nomlab saqlashni yo'lga qo'ygan.

---

### 4. Noodatiy Yechim: Multi-Field Composite Duplication Prevention & Cascade Validation
#### FACT
- Fayl: `src/modules/Kurslar_Boshqaruvi/courses/courses.service.ts` (L25-L43)
- Kod parchasi:
```typescript
async checkCreateExists(data : CreateCourseDto){
  const oldCourse = await this.prisma.course.findFirst({
    where : {
      AND : [
        {name : data.name},
        {level : data.level}
      ]
    }
  });
  if(oldCourse){
    throw new BadRequestException(`${data.name} already exists level in : [${data.level}]`)
  }
  if(!(await this.prisma.courseCategory.findFirst({where : {id : data.categoryId}}))){
    throw new NotFoundException(`Category not found by Id : [${data.categoryId}]`)
  }
  if(!(await this.prisma.mentorProfile.findFirst({where : {id : data.mentorId}}))){
    throw new NotFoundException(`Mentor not found by Id [${data.mentorId}]`)
  }
}
```

#### OBSERVATION
Yangi kurs yaratish jarayonida `checkCreateExists` yordamchi metodi chaqirilib, faqat nom boyicha emas, balki kurs nomi (`name`) va kurs darajasi (`level`) birikmasi boyicha `AND` mantiqiy sharti orqali dublikat bor-yo'qligi tekshiriladi. Shu bilan birga, bog'liq kategoriya va mentor IDlarining mavjudligi ham bir joyda bosqichma-bosqich validatsiya qilinadi.

#### NEGA ODATIY EMAS
Odatda takrorlanishni oldini olish uchun ma'lumotlar bazasi darajasida `@@unique([name, level])` parametri ishlatiladi yoki oddiygina kurs nomi tekshiriladi. Bu yerdagi yondashuvda esa service darajasida composite validation va aniq xatolik sabablarini (`already exists level in : [...]`) dinamik shakllantiruvchi yordamchi validator mexanizmi yozilgan.

---

### 5. Noodatiy Yechim: Deep 4-Level Nested Relational Data Hydration & Explicit Detailed Diagnostics
#### FACT
- Fayl: `src/modules/Kurslar_Boshqaruvi/assisgned_courses/assisgned_courses.service.ts` (L30-L53, L81-L97)
- Kod parchasi:
```typescript
// Dublikat biriktirishni tekshirish va batafsil xato shakllantirish (L30-L53)
const oldAssignedCourse = await this.prisma.assignedCourse.findFirst({
  where: { AND: [{userId : data.userId}, {courseId : data.courseId}] },
  include: {
    user: { select: {fullName:true} },
    courses: { select: {name : true} }
  }
});
if(oldAssignedCourse){
  throw new BadRequestException(`Already exists assigned course : 
    by userId [${data.userId}] by courseId [${data.courseId}] , 
    Course name : [${oldAssignedCourse.courses.name}], 
    User fullname : [${oldAssignedCourse.user.fullName}]`
  );
}

// 4-darajali relational query fetching (L81-L97)
include : {
  user : true,
  courses : {
    include : {
      mentor :{ include : { user : true } },
      category : true
    }
  }
}
```

#### OBSERVATION
Foydalanuvchiga biriktirilgan kurs ma'lumotlarini olishda (`findOne`) 4 bosqichli relational zanjir (`AssignedCourse -> Course -> MentorProfile -> User`) bo'yicha bog'liq obyektlar bir so'rovda tortib olinadi. Dublikat kurs biriktirilganda esa oddiy xato emas, balki biriktirilgan kurs nomi va foydalanuvchi to'liq ismini ichki obyektdan ajratib olib, o'ta aniq va tushunarli diagnostik xabar qaytariladi.

#### NEGA ODATIY EMAS
Standart CRUD ilovalarda odatda faqat birinchi darajali bog'lanishlar chaqiriladi yoki umumiy "Kurs allaqachon biriktirilgan" xabari beriladi. Dasturchi esa 4 qavatli relational bog'lanishni to'liq yuklash bilan birga, xatolik berilganda ham Prisma `include` orqali tegishli foydalanuvchi hamda kurs nomlarini chiqarib, dinamik diagnostika matnini hosil qilgan.

---

### 6. Noodatiy Yechim: Client System Metadata Capture via Custom Parameter Injector Decorator (`@Device`)
#### FACT
- Fayl: `src/global/middlewares/device.middleware.ts` (L8-L13) va `src/global/decorators/device.getter.decorator.ts` (L3-L8)
- Kod parchasi:
```typescript
// DeviceMiddleware
use(req: Request, _res: Response, next: NextFunction) {
  const agent = useragent.parse(req.headers['user-agent']);
  req['device'] = {
    ip: req.ip || req.connection.remoteAddress,
    agent: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
  };
  next();
}

// @Device Decorator
export const Device = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.device;
  },
);
```

#### OBSERVATION
Har bir kiruvchi HTTP so'rovidan client brauzeri, OS versiyasi va IP manzilini `useragent` kutubxonasi orqali ajratib oluvchi middleware yaratilgan. Ushbu ma'lumot `req['device']` obyektiga biriktiriladi va NestJS `createParamDecorator` funksiyasi yordamida yasalgan `@Device()` dekoratori orqali controller metodlariga to'g'ridan-to'g'ri injection qilinadi.

#### NEGA ODATIY EMAS
Odatda client metadata ma'lumotlari oddiy logging middleware ichida qoladi yoki controller ichida `req.headers` orqali har safar takroran qo'lda o'qiladi. Bu yerdagi yechim middleware hamda custom parameter decorator arxitekturasini birlashtirib, har qanday controllerga mijoz qurilmasi haqidagi tayyor va formatlangan obyektni uzatishni ta'minlaydi.

---

### 7. Noodatiy Yechim: Strict Role-Gated Domain Entity Creation Guarding
#### FACT
- Fayl: `src/modules/Kurslar_Boshqaruvi/mentor-profile/mentor-profile.service.ts` (L26-L36)
- Kod parchasi:
```typescript
if (user.role !== UserRoles.MENTOR) {
  throw new BadRequestException(`Foydalanuvchi mentor emas`);
}

const existing = await this.prisma.mentorProfile.findUnique({
  where: { userId },
});

if (existing) {
  throw new BadRequestException(`Mentor profili allaqachon mavjud`);
}
```

#### OBSERVATION
Mentor profili (`MentorProfile`) yaratilishidan oldin service qatlamida `User` jadvalidan foydalanuvchi roli o'qiladi va uning roli qat'iy ravishda `UserRoles.MENTOR` ekani tasdiqlanadi. Agar rol mos kelmasa yoki ushbu foydalanuvchida allaqachon profil mavjud bo'lsa, operatsiya rad etiladi.

#### NEGA ODATIY EMAS
Ko'pgina ilovalarda ushbu tekshiruvlar faqat HTTP guard (controller) darajasida o'tkaziladi yoki bazadagi unique indexga topshirib qo'yiladi. Dasturchi esa domen service mantiqi ichida foydalanuvchining bazaviy rolini va 1:1 bog'lanish yaxlitligini qat'iy nazorat ostiga olgan.

---

### 8. Noodatiy Yechim: Custom RegEx Phone Number Validator Constraint Class
#### FACT
- Fayl: `src/common/utils/user.validation.ts` (L7-L16)
- Kod parchasi:
```typescript
@ValidatorConstraint({ name: 'isPhoneNumber', async: false })
export class IsPhoneNumberConstraint implements ValidatorConstraintInterface {
  validate(value: string, args: ValidationArguments) {
    return /^[0-9]+$/.test(value);
  }

  defaultMessage(args: ValidationArguments) {
    return 'Telefon raqam faqat raqamlardan iborat bo‘lishi kerak!';
  }
}
```

#### OBSERVATION
Foydalanuvchi telefon raqamini validatsiya qilish uchun `class-validator` kutubxonasining `ValidatorConstraintInterface` interfeysidan foydalanilgan holda maxsus sinf yozilgan. U kiritilgan qiymatni toza raqamlardan iboratligini regulyar ifoda (`/^[0-9]+$/`) orqali tekshiradi va o'zbek tilidagi xabar qaytaradi.

#### NEGA ODATIY EMAS
Dasturchilar odatda tayyor `@IsPhoneNumber()` yoki `@Matches()` dekoratorlaridan foydalanishadi. Ushbu loyihada esa reusable va xususiylashtirilgan validatsiya sinfi yaratilib, o'zbek tilidagi xatolik xabarini berish yo'lga qo'yilgan.

---

### 9. Noodatiy Yechim: Dynamic Environment Secret & Expiration Resolution Engine
#### FACT
- Fayl: `src/common/config/jwt.secrets.ts` (L26-L35)
- Kod parchasi:
```typescript
export const getJwtOptions = (
  config: ConfigService,
  type: jwtTokenType = jwtTokenTypeEnum.ACCESS,
) => {
  const options: JwtSignOptions = {
    secret: config.get<string>(`JWT_${type.toLocaleUpperCase()}_SECRET`),
    expiresIn: config.get<string>(`JWT_${type.toLocaleUpperCase()}_EXPIRES_IN`),
  };
  return options;
};
```

#### OBSERVATION
`getJwtOptions` funksiyasi uzatilgan token turiga (`ACCESS` yoki `REFRESH`) qarab, `.env` faylidan mos sirli kalit (`JWT_ACCESS_SECRET` / `JWT_REFRESH_SECRET`) va amal qilish muddatini dinamik ravishda string interpolatsiyasi orqali aniqlaydi va JwtSignOptions obyektini hosil qiladi.

#### NEGA ODATIY EMAS
Odatda NestJS loyihalarida har bir token turi uchun alohida funksiya yoki alohida konstantalar yoziladi. Ushbu yondashuvda esa bitta dinamik helper funksiya orqali ixtiyoriy token turi uchun env o'zgaruvchilarini avtomatik modellashtirish amalga oshirilgan.

---

### 10. Noodatiy Yechim: Composite Multi-Entity Navigation & Progress Tracking Model
#### FACT
- Fayl: `prisma/schema.prisma` (L205-L225)
- Kod parchasi:
```prisma
model LastActivity {
  id     String @id @default(auto()) @map("_id") @db.ObjectId
  userId String @db.ObjectId
  user   User   @relation(fields: [userId], references: [id])

  courseId String @db.ObjectId
  courses  Course @relation(fields: [courseId], references: [id])

  lessonModulId String      @db.ObjectId
  lessonModule  LessonModul @relation(fields: [lessonModulId], references: [id])

  lessonId String @db.ObjectId
  lesson   Lesson @relation(fields: [lessonId], references: [id])

  url String

  updatedAt DateTime @default(now())
  createdAt DateTime @default(now())

  @@map("last_activitiy")
}
```

#### OBSERVATION
Foydalanuvchining platformadagi oxirgi harakati hamda o'quv progressini saqlash uchun `LastActivity` modeli loyihalangan. Bu model o'zida `userId`, `courseId`, `lessonModulId`, `lessonId` hamda front-endning aniq `url` manzilini jamlaydi.

#### NEGA ODATIY EMAS
Ko'pchilik LMS (Learning Management System) loyihalarida o'quvchi progressi faqat o'qilgan darslar ID-si va boolean holati bilan cheklanadi. Ushbu model esa kurs -> modul -> dars hamda aynan foydalanuvchi turgan sahifa URL-ini saqlash orqali platformaga qaytgan talabani sekund ichida darsning aniq nuqtasiga yo'naltirish imkoniyatini beradi.

---

## 💡 XULOSA

`online-courses` loyihasi tahlili natijasida jami **10 ta** diqqatga sazovor va noodatiy yechimlar aniqlandi. Ulardan eng muhim 3 tasi:

1. **Dynamic HTTP Action-Based Granular Permission System (`Permission` schema & DTO):** Standart RBAC o'rniga har bir model kesimida HTTP metodlarini (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) dinamik massiv ko'rinishida boshqarish.
2. **Client System Metadata Capture via `@Device` Decorator:** `useragent` middleware va custom parameter decorator sinergiyasi orqali client metadata-ni controller argumentiga injecting qilish.
3. **Deep 4-Level Nested Relational Data Hydration & Explicit Detailed Diagnostics:** 4 bosqichli Prisma relational query hamda dublikat kurs biriktirishda obyekt ichki ma'lumotlarini ajratib olib berilgan o'ta aniq diagnostik xatolar.
