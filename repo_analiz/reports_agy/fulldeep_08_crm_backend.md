# FULLDEEP-08: `crm_backend` Loyihasining Chuqur va Noodatiy Kod Tahlili Hisoboti

- **Sana:** 2026-08-03
- **Qamrab olingan fayllar soni:** 123 ta fayl

---

### 1. Dynamic Canvas-Based User Avatar Generator with YIQ Contrast Engine
#### FACT
- Fayl: `src/common/types/generator.types.ts` (L143-L222)
- Kod parchasi:
```typescript
export class ImageGenerator {
  private readonly width: number = 300;
  private readonly height: number = 300;
  private readonly fontSize: number = 50;

  private getRandomColor(): string {
    const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#DDA0DD', '#98D8C8', '#F7DC6F'];
    return colors[Math.floor(Math.random() * colors.length)];
  }

  private getContrastColor(backgroundColor: string): string {
    const hex = backgroundColor.replace('#', '');
    const r = parseInt(hex.substr(0, 2), 16);
    const g = parseInt(hex.substr(2, 2), 16);
    const b = parseInt(hex.substr(4, 2), 16);
    const brightness = (r * 299 + g * 587 + b * 114) / 1000;
    return brightness > 128 ? '#000000' : '#FFFFFF';
  }

  public generateAvatar(text: string, config: ConfigService): string {
    const initials = text.substring(0, 2).toUpperCase();
    const canvas: Canvas = createCanvas(this.width, this.height);
    const ctx: CanvasRenderingContext2D = canvas.getContext('2d');
    const backgroundColor = this.getRandomColor();
    const textColor = this.getContrastColor(backgroundColor);

    ctx.fillStyle = backgroundColor;
    ctx.fillRect(0, 0, this.width, this.height);
    ctx.fillStyle = textColor;
    ctx.font = `bold ${this.fontSize}px Arial, sans-serif`;
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(initials, this.width / 2, this.height / 2);

    const fileName = `avatar_${initials.toLowerCase()}_${Date.now()}.png`;
    const fullPath = join(getPathInFileType(fileName), fileName);
    writeFileSync(fullPath, canvas.toBuffer('image/png'));
    return urlGenerator(config, fileName);
  }
}
```

#### OBSERVATION
Foydalanuvchi profiliga rasm yuklamaganda, backend `canvas` (HTML Canvas API for Node) kutubxonasidan foydalanib 300x300 hajmdagi avatarni serverning o'zida render qiladi. Yoritilganlik darajasini YIQ RGB formulasi (`(r*299 + g*587 + b*114) / 1000`) orqali dinamik hisoblab, tanlangan tasodifiy fon rangiga mos ravishda matn rangini qora yoki oq deb aniqlaydi va tayyor PNG rasmini fayl tizimiga saqlab URL qaytaradi.

#### NEGA ODATIY EMAS
Standart Web ilovalarda avatar yuklanmagan holda tayyor static SVG ishlatiladi yoki frontend tomonda default initials ko'rsatiladi. Dasturchi esa backend qatlamining o'zida grafik render qilish dvigatelini va kontraslikni matematik hisoblovchi YIQ algoritmini noldan integratsiya qilgan.

---

### 2. Low-Level HTTP 206 Partial Content Video & Document Streaming Streamer
#### FACT
- Fayl: `src/common/types/generator.types.ts` (L68-L140) va `src/core/services/file.stream.service.ts` (L15-L24)
- Kod parchasi:
```typescript
export async function headerDataStream(
  res: Response,
  filePath: string,
  fileName: string
): Promise<void> {
  const fileSize = (await stat(filePath)).size;
  const range = res.req.headers.range;
  const mimeType = getMimeType(fileName);

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;

    if (start >= fileSize || end >= fileSize || start > end) {
      res.status(416).json({ error: 'Range not satisfiable' });
      return;
    }

    const chunkSize = end - start + 1;
    const file = createReadStream(filePath, { start, end });

    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
    });
    file.pipe(res);
  } else {
    const file = createReadStream(filePath);
    res.writeHead(200, { 'Content-Length': fileSize, 'Content-Type': mimeType });
    file.pipe(res);
  }
}
```

#### OBSERVATION
Servis katta hajmli media (video, darsliklar) va hujjatlarni uzatishda HTTP Range sarlavhasini (`bytes=start-end`) o'qiydi. Fayl hajmini `stat(filePath)` orqali tekshirib, kerakli bo'lak (chunk) chegaralarini ajratadi va HTTP status code 206 (Partial Content) bilan faqat so'ralgan baytlar oralig'ini `fs.createReadStream({ start, end })` yordamida uzatadi.

#### NEGA ODATIY EMAS
Katta hajmdagi media fayllar NestJS ilovalarida odatda express static middleware yoki S3/CDN orqali uzatiladi. Dasturchi server operativ xotirasini (RAM) to'ldirmaslik hamda videolarni browserda pause/seek qilish imkoniyatini ta'minlash uchun HTTP Range Streaming protokoli va byte-slice oqimini Express `pipe` yordamida o'zi yozib chiqqan.

---

### 3. Dynamic Prisma Model Reflection Engine (`checkExistsResurs` & `checAlreadykExistsResurs`)
#### FACT
- Fayl: `src/common/types/check.functions.types.ts` (L6-L58)
- Kod parchasi:
```typescript
export async function checAlreadykExistsResurs(
  prisma: PrismaService,
  modelName: ModelsEnumInPrisma,
  field: string,
  value: any
) {
  if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
    const result = await prisma[modelName].findFirst({
      where: { [field]: value },
    });
    if (result) {
      throw new ConflictException(`${modelName} in ${field} already exists ${value}`);
    }
    return result;
  }
}
```

#### OBSERVATION
Model nomi va tekshirilishi kerak bo'lgan maydon dinamik berilganda, Prisma Client obyektidagi modellar kolleksiyasini index rejimida (`prisma[modelName]`) refleksiya qiladi va `findFirst` chaqiruvini bajaradi. Yozuv topilsa avtomatik `ConflictException`, topilmasa generic `NotFoundException` otadi.

#### NEGA ODATIY EMAS
Har bir NestJS CRUD controller va servisida Prisma orqali yozuv mavjudligini alohida `findUnique` yoki `findFirst` buyruqlari bilan tekshirish takrorlanuvchi kod yaratadi. Dasturchi refleksiv universal helper yaratib, barcha Prisma ORM modellarini yagona funksiya orqali dinamik tekshirish mexanizmini joriy qilgan.

---

### 4. In-Memory Anti-Spam Rate-Limited Self-Expiring Cache Engine (`CacheService`)
#### FACT
- Fayl: `src/core/auth/cache.service.ts` (L9-L37)
- Kod parchasi:
```typescript
@Injectable()
export class CacheService {
  private cache: Map<string, UserCacheValue> = new Map();

  set(email: string, data: UserCacheValue, ttlMs: number): void {
    if (this.cache.get(email)) {
      throw new BadRequestException("Sizga oldin code yuborilgan birozdan so'ng urinib ko'ring");
    }
    this.cache.set(email, data);
    setTimeout(() => {
      const exists = this.cache.get(email);
      if (exists) {
        this.cache.delete(email);
      }
    }, ttlMs);
  }

  get(email: string): UserCacheValue | null {
    return this.cache.get(email) || null;
  }
}
```

#### OBSERVATION
OTP (Email tasdiqlash kodi) yuborishda tashqi Redis yoki Cache-Manager kutubxonasini ishlatmasdan, JS `Map` obyektida keshlaydi. Agar foydalanuvchiga kod yuborilgan bo'lsa, spam-blokirovkasi sifatida `BadRequestException` beradi. Shuningdek `setTimeout` yordamida belgilangan TTL muddati o'tgach keshingiz avtomatik o'chirilishini ta'minlaydi.

#### NEGA ODATIY EMAS
NestJS loyihalarida odatda Redis yoki `@nestjs/cache-manager` ishlatiladi. Dasturchi ortiqcha infratuzilmaviy bog'liqliklar va resurs sarfini kamaytirish uchun xotirada (in-memory) ishlaydigan taymerli va anti-spam cheklovli yengil keshlovchi klassni noldan yozgan.

---

### 5. Lesson Room Availability & Overlap Conflict Detection Engine
#### FACT
- Fayl: `src/modules/lessons/lessons.service.ts` (L36-L61)
- Kod parchasi:
```typescript
private async checkRoomAvailability(roomId: string, startDate: Date, endDate: Date, excludeLessonId?: string) {
  const overlappingLesson = await this.prisma.lesson.findFirst({
    where: {
      isDeleted: false,
      id: excludeLessonId ? { not: excludeLessonId } : undefined,
      group: {
        romId: roomId,
        isDeleted: false,
      },
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
```

#### OBSERVATION
Yangi dars jadvali tuzishda yoki mavjud dars vaqtini o'zgartirishda dars xonasi bandligini tekshirish uchun `startDate <= endDate` hamda `endDate >= startDate` sharti bilan vaqt oralig'ining to'qnashishini (overlap collision) Prisma ORM darajasida qidiradi.

#### NEGA ODATIY EMAS
Odatda oddiy CRM tizimlari dars vaqtini tekshirmasdan saqlaydi yoki faqat bitta aniq vaqt tengligini ko'radi. Dasturchi vaqt intervallari kesishishini matematsik mantiq orqali aniqlaydigan va xona band bo'lsa aniq vaqt oralig'i bilan exception qaytaradigan to'liq jadval to'qnashuvi algoritmini tuzgan.

---

### 6. Aggregate Room Usage Metrics Engine (`getLidsStats`)
#### FACT
- Fayl: `src/modules/rom/rom.service.ts` (L18-L69)
- Kod parchasi:
```typescript
async getLidsStats() {
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
          students: { where: { isDeleted: false }, select: { id: true } },
          Lesson: { where: { isDeleted: false }, select: { id: true } }
        }
      }
    }
  });

  const stats = rooms.map((room) => {
    const groupCount = room.Group.length;
    const studentCount = room.Group.reduce((acc, g) => acc + g.students.length, 0);
    const lessonCount = room.Group.reduce((acc, g) => acc + g.Lesson.length, 0);
    return { id: room.id, name: room.name, romNumber: room.romNumber, groupCount, studentCount, lessonCount };
  });

  return { message: "Rooms statistics successfully fetched", count: stats.length, stats };
}
```

#### OBSERVATION
O'quv markazidagi har bir xonaning umumiy bandlik ko'rsatkichini aniqlash uchun Prisma relatsiyalari bo'yicha `Group`, `students` hamda `Lesson` ma'lumotlarini bir marta chuqur SQL so'rovi bilan oladi. So'ngra JavaScript-dagi `reduce` funksiyasi orqali har bir xonaga to'g'ri keladigan guruhlar, talabalar va darslar sonini xotirada tezkor agregatsiya qiladi.

#### NEGA ODATIY EMAS
Ko'pchilik analitik so'rovlarda har bir xona uchun alohida N+1 SQL `COUNT()` so'rovlari chaqiriladi yoki og'ir SQL query tayyorlanadi. Dasturchi minimal SQL so'rovi bilan bog'liq obyektlar daraxtini olib, agregatsiyani in-memory `reduce` orqali bajargan.

---

### 7. Relational Foreign Key Integrity Protection Guard Before Soft Delete
#### FACT
- Fayl: `src/modules/groupes/groupes.service.ts` (L255-L264)
- Kod parchasi:
```typescript
const hasRelations =
  group._count.students > 0 ||
  group._count.Lesson > 0 ||
  group._count.GroupPayment > 0;

if (hasRelations)
  throw new ConflictException(
    `Cannot delete group [${group.name}] because it has related students, lessons, or payments.`,
  );

await this.prisma.group.update({
  where: { id },
  data: { isDeleted: true },
});
```

#### OBSERVATION
Guruhni o'chirishdan (soft delete) oldin, unga biriktirilgan talabalar (`students`), darslar (`Lesson`) va to'lovlar (`GroupPayment`) mavjudligini `_count` obyektidan oladi. Agar bittagina bog'liq yozuv topilsa ham, yetim yozuvlar (orphan records) paydo bo'lishining oldini olish uchun `ConflictException` qaytaradi.

#### NEGA ODATIY EMAS
Prisma ORM-da `update({ data: { isDeleted: true } })` bajarilganda relational integrity avtomatik tekshirilmaydi, chunki SQL darajasida CASCADE delete ishga tushmaydi. Dasturchi tizimda data inconsistency paydo bo'lmasligi uchun soft delete jarayonida qo'lda relatsiya mavjudligini audit qiluvchi mantiqiy guard qo'ygan.

---

### 8. Bulk Attendance Pre-Filtering & Deduplication Engine
#### FACT
- Fayl: `src/modules/attendentionals/attendentionals.service.ts` (L60-L88)
- Kod parchasi:
```typescript
const studentIds = attendances.map((a) => a.studentId);

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
  const dataToInsert = newAttendances.map((a) => ({
    lessonId,
    studentId: a.studentId,
    kelgan: a.kelgan ?? false,
    kelganVaqti: a.kelganVaqti ? new Date(a.kelganVaqti) : null,
    isDeleted: a.isDeleted ?? false,
  }));

  await this.prisma.attendentional.createMany({
    data: dataToInsert,
    skipDuplicates: true,
  });
}
```

#### OBSERVATION
Butun bir sinf/guruh davomatini (bulk create) saqlashda, kelgan studentlar ro'yxatini bazadagi mavjud davomat yozuvlari bilan solishtiradi. `Set` ma'lumotlar tuzilmasidan foydalanib allaqachon belgilangan studentlarni filtrlash va faqat yangilarini `createMany` hamda `skipDuplicates: true` orqali saqlash algoritmini qo'llagan.

#### NEGA ODATIY EMAS
Odatda bulk yozishda yoki takroriy `insert` xatosi chiqib tranzaksiya to'xtaydi, yoki `for-loop` ichida har bir student uchun alohida SQL query chaqiriladi. Dasturchi `Set` ma'lumotlar strukturasidan foydalanib linear $O(N)$ vaqt qiyinchiligida massivni tayyorlab, so'ng yagona batch so'rov bilan yozgan.

---

### 9. Dynamic User-Agent Parsing Middleware & Context Decorator (`DeviceMiddleware`, `@Device`)
#### FACT
- Fayl: `src/global/middlewares/device.middleware.ts` (L6-L15) va `src/global/decorators/device.getter.decorator.ts` (L3-L8)
- Kod parchasi:
```typescript
@Injectable()
export class DeviceMiddleware implements NestMiddleware {
  use(req: Request, _res: Response, next: NextFunction) {
    const agent = useragent.parse(req.headers['user-agent']);
    req['device'] = {
      ip: req.ip || req.connection.remoteAddress,
      agent: `${agent.family} ${agent.major}.${agent.minor}.${agent.patch}`,
    };
    next();
  }
}

export const Device = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request = ctx.switchToHttp().getRequest();
    return request.device;
  },
);
```

#### OBSERVATION
Tizimga kelayotgan har bir HTTP so'rovning `User-Agent` sarlavhasini `useragent` kutubxonasi yordamida parslash orqali brauzer nomi, versiyasi va IP manzilini ajratadi va `req['device']` obyektiga biriktiradi. Controller metodlarida buni olish uchun maxsus `@Device()` custom parametri dekoratorini taqdim etgan.

#### NEGA ODATIY EMAS
Foydalanuvchi qurilmasini kuzatish odatda controller ichida qo'lda request sarlavhalarini tekshirish orqali bajariladi. Dasturchi esa middleware va param decorator kombinatsiyasidan foydalanib, butun loyiha bo'yicha qurilma va IP haqida ma'lumot olishni avtomatlashtirgan.

---

### 10. Multi-Level Normalized DTO Flattening Layer
#### FACT
- Fayl: `src/modules/attendentionals/attendentionals.service.ts` (L16-L41)
- Kod parchasi:
```typescript
private flattenRecord(record: any) {
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
```

#### OBSERVATION
Prisma orqali olingan murakkab relatsion obyektlar daraxtini (`record.student.user...`) frontendga moslashtirish uchun ko'p bosqichli optional chaining (`?.`) hamda nullish coalescing (`??`) operatorlaridan iborat in-house transformatsiya funksiyasini yozgan.

#### NEGA ODATIY EMAS
Odatda Class Transformer (`@Transform()`) yoki NestJS Interceptor ishlatiladi yoki relatsion ichma-ich obyektlar to'g'ridan-to'g'ri JSON ko'rinishida javob sifatida yuboriladi. Dasturchi har bir servis ichida shaxsiy `flattenRecord` klassik metodini qo'llab, ortiqcha ichma-ich tuzilmalarni yassi (flat) ko'rinishga keltirishni ta'minlagan.

---

## YAKUNIY XULOSA

Ushbu tahlilda `crm_backend` repozitoriyasidan umumiy 123 ta manba fayli ko'rib chiqildi hamda andozaviy/boilerplate kodlar chetga surilib, **10 ta diqqatga sazovor va noodatiy backend yechimlar** aniqlandi.

Eng diqqatga sazovor top 3 yechim:
1. **Dynamic Canvas-Based User Avatar Generator with YIQ Contrast Engine (`ImageGenerator`)**: Node.js muhitida HTML Canvas yordamida avatar yaratish va YIQ RGB rang yorqinligi formulasi bo'yicha matn kontrastligini aniqlash kodi (`src/common/types/generator.types.ts`).
2. **Low-Level HTTP 206 Partial Content Video & Document Streamer (`headerDataStream`)**: Media fayllarni oqimli uzatish uchun Range HTTP sarlavhalarini hisoblab, Node.js stream va Express `pipe` yordamida 206 status bilan yuboruvchi algoritm (`src/common/types/generator.types.ts`).
3. **Dynamic Prisma Model Reflection Engine (`checkExistsResurs`)**: Prisma ORM obyekti modellarini enum kalitlari bo'yicha refleksiya qilib, har qanday kolleksiya uchun universal mavjudlik va ziddiyat auditini bajaruvchi dvigatel (`src/common/types/check.functions.types.ts`).
