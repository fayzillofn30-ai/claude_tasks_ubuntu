# FULLDEEP-06: `e-commerce-backend` Loyihasining Chuqur va Noodatiy Kod Tahlili Hisoboti

- **Sana:** 2026-08-03
- **Qamrab olingan fayllar soni:** 69 ta fayl

---

### 1. Deploy Post-Processing Real-Time Memory Monitoring Engine
#### FACT
- Fayl: `src/core/memory.manitoring_functions.ts` (L10-L34, L82-L106, L212-L237)
- Kod parchasi:
```typescript
export function showTop10RamConsumers() {
  if (process.platform === 'linux') {
    const output = execSync('ps aux --sort=-%mem --no-headers | head -10', { encoding: 'utf8' });
    const lines = output.trim().split('\n');
    lines.forEach((line, index) => {
      const parts = line.trim().split(/\s+/);
      const pid = parts[1];
      const memPercent = parts[3];
      const rss = Math.round(parseInt(parts[5]) / 1024);
      console.log('%s %-7s %-8s %-10s %s', prefix, pid, memPercent + '%', rss + 'MB', command);
    });
  }
}
export function setupMemoryAlert(thresholdMB = 500, intervalMs = 30000) {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    if (Math.round(memUsage.rss / 1024 / 1024) > thresholdMB) {
      console.warn('⚠️ YUQORI XOTIRA SARFI OGOHLANTIRUVI!');
    }
  }, intervalMs);
}
```
#### OBSERVATION
Dasturchi backend ilovasida platformani (`linux`, `darwin`, `win32`) dynamic ajratgan holda Linux shell buyruqlari (`ps aux --sort=-%mem`) va Cgroup `/sys/fs/cgroup/memory/memory.limit_in_bytes` fayllarini `execSync` orqali to'g'ridan-to'g'ri o'qish mexanizmini yaratgan. Bundan tashqari `setupMemoryAlert` orqali `setInterval` taymeri yordamida har 30 soniyada ilovaning RSS va Heap xotira sarfini nazorat qilib turadi.

#### NEGA ODATIY EMAS
Standart NestJS/Express dasturlarida xotira monitoringi uchun tashqi APM utilitasi (masalan PM2, Datadog, Prometheus, New Relic) ishlatiladi yoki ilova kodiga aralashilmaydi. Dasturchi esa hech qanday tashqi monitoring agentisiz operatsion tizim (OS) darajasidagi `child_process.execSync` va Linux cgroup fayllari bilan integratsiya qilingan in-house RAM va Process Health Watchdog logikasini backend loyihaning o'ziga o'rnatgan.

---

### 2. Multer Exception Handling Automatic Disk Sweeper (`MulterValidationExceptionFilter`)
#### FACT
- Fayl: `src/core/error/validation.filter.ts` (L4-L55)
- Kod parchasi:
```typescript
@Catch(BadRequestException, NotFoundException, ConflictException)
export class MulterValidationExceptionFilter implements ExceptionFilter {
  catch(exception: BadRequestException | NotFoundException | ConflictException, host: ArgumentsHost) {
    const request = host.switchToHttp().getRequest();
    const file = request.file || request.files;
    try {
      if (Array.isArray(file)) {
        file.map(f => fs.unlink(f.path, (err) => { if (err) console.log(err); }));
      }
      if (file && file['banner'] && Array.isArray(file['banner'])) {
        fs.unlink(file['banner'][0].path, (err) => { ... });
      }
      if (file && file.path) {
        fs.unlink(file.path, (err) => { ... });
      }
    } catch (error) { ... }
  }
}
```
#### OBSERVATION
NestJS loyihasida validation (masalan `BadRequestException`, `ConflictException`) yuz berganda, so'rov HTTP filterga tushadi. Filter So'rov obyekti (`request.file` yoki `request.files`) ichidagi vaqtincha diskka yozilgan fayllar (`banner`, `introVideo`, `video` va boshqalar) ro'yxatini tahlil qiladi va xatolik ro'y berganda ularni sinxron/asinxron ravishda `fs.unlink` orqali darhol diskdan o'chirib tashlaydi.

#### NEGA ODATIY EMAS
Standart web freymvorklarda agar controller yoki Pipe bo'g'inida validation xatoligi yuz bersa, Multer allaqachon yuklab bo'lgan fayllar server diskida yetim (orphaned temporary file) bo'lib qoladi va vaqt o'tishi bilan server diskini to'ldirib tashlaydi. Dasturchi buni oldini olish uchun global Exception Filter bosqichida disk sweeping (tashlab ketilgan fayllarni avtomatik tozalash) mantiqiy tutqichini ishlab chiqqan.

---

### 3. HTTP 206 Range-Based Partial Streaming & File Type Path Engine
#### FACT
- Fayl: `src/common/types/generator.types.ts` (L32-L79) hamda `src/core/services/file.stream.service.ts` (L9-L18)
- Kod parchasi:
```typescript
export async function headerDataStream(res: Response, filePath: string, fileName: string) {
  const fileSize = (await stat(filePath)).size;
  const range = res.req.headers.range;
  const mimeType = getMymtype(fileName);

  if (range) {
    const parts = range.replace(/bytes=/, '').split('-');
    const start = parseInt(parts[0], 10);
    const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
    const chunkSize = end - start + 1;
    const file = createReadStream(filePath, { start, end });
    res.writeHead(206, {
      'Content-Range': `bytes ${start}-${end}/${fileSize}`,
      'Accept-Ranges': 'bytes',
      'Content-Length': chunkSize,
      'Content-Type': mimeType,
    });
    file.pipe(res);
  } else { ... }
}
```
#### OBSERVATION
Video va katta media fayllarni mijozga uzatishda client taqdim etgan `Range: bytes=start-end` HTTP sarlavhasi tahlil qilinadi. HTTP `206 Partial Content` javob kodi hamda `createReadStream(filePath, { start, end })` yordamida fayl faqat talab qilingan bayt oralig'ida bo'laklab stream qilinadi.

#### NEGA ODATIY EMAS
Standart holatda NestJS ishlab chiquvchilari `res.sendFile()` yoki static asset provider ishlatadi, bu esa butun faylni xotiraga yuklashga yoki pauza/seek funksiyasi ishlamasligiga olib keladi. Dasturchi bu yerda brauzerlarning video scroll / seek mexanizmi uchun HTTP 206 Partial Content protokoli va Node.js stream kassetasini custom tarzda o'zi implement qilgan.

---

### 4. In-Memory Map-Based TTL Expiring Cache Engine (`CacheService`)
#### FACT
- Fayl: `src/core/auth/cache.service.ts` (L11-L26)
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
}
```
#### OBSERVATION
Tizimda foydalanuvchini ro'yxatdan o'tkazish yoki parolni tiklashdagi OTP kodingni saqlash uchun tashqi kesh bazasi (Redis, Memcached) o'rniga toza JavaScript `Map` obyekti va `setTimeout` vaqt taymeridan foydalanilgan. `set` usulida agar elektron pochtaga allaqachon kod yuborilgan bo'lsa, qayta yuborish darhol taqiqlanadi (`BadRequestException`).

#### NEGA ODATIY EMAS
Standart yondashuvda ishlab chiquvchilar Redis kutubxonasini ulaydi yoki DB jadvalida temporary OTP jadvalini ochadi. Dasturchi esa qo'shimcha infratuzilma xarajatisiz va ortiqcha dependency-larsiz toza in-memory `Map` va `setTimeout` callback-i yordamida o'zining tejamkor hamda Spam-prevention (qayta kod yuborishni to'suvchi) kesh engine-ini yaratgan.

---

### 5. Universal Prisma Model Dynamic Resource Existence Resolver
#### FACT
- Fayl: `src/common/types/check.functions.types.ts` (L5-L25)
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
Dasturchi Prisma serviceni dynamic reflection obyekt sifatida ishlatgan (`prisma[modelName].findFirst`). Har bir service va controllerda `findFirst` va `if (exists) throw ConflictException` yozib o'tirmasdan, ixtiyoriy model va ixtiyoriy maydon (field & value) uchun yagona universal validator funksiyasini yaratgan.

#### NEGA ODATIY EMAS
Odatda NestJS loyihalarida har bir servis alohida DB so'rovi yozadi yoki custom validator pipe-lar tayyorlaydi. Ushbu yechim esa dynamic model string indexing (`prisma[modelName]`) orqali har qanday resursni (User, Property, Category, BuildType) 1 qator kod bilan avtomatik va universal tekshirish imkonini beradi.

---

### 6. Extension & Field-Aware Multer Storage Pipeline
#### FACT
- Fayl: `src/common/types/upload_types.ts` (L14-L59)
- Kod parchasi:
```typescript
export const fileStorages = (allowedMimes: string[]) => ({
  storage: diskStorage({
    destination: (req, file, cb) => {
      const filePath = getPathInFileType(file.originalname);
      cb(null, filePath);
    },
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
      cb(null, `${uniqueSuffix}${extname(file.originalname)}`);
    },
  }),
  fileFilter: fileFilters(allowedMimes),
});
```
#### OBSERVATION
Multer disk storage konfiguratsiyasida static papka ko'rsatilmasdan, har bir kelgan fayl uchun `destination` ichida `getPathInFileType(file.originalname)` chaqiriladi. Fayl kengaytmasiga ko'ra u `uploads/images`, `uploads/videos`, `uploads/docs`, `uploads/axrchive` papkalariga yo'naltiriladi va papka yo'q bo'lsa `mkdirSync` bilan dinamik yaratiladi.

#### NEGA ODATIY EMAS
Odatda freymvorklarda barcha yuklangan fayllar bitta umumiy `uploads/` papkasiga tashlanadi va keyin ajratiladi. Dasturchi esa Multer faylni diska yozish jarayonining o'zida extension boyicha avtomatik tartiblovchi va fieldname (`banner` -> image, `introVideo` -> video) boyicha turini strict validation qiluvchi custom middleware pipeline qurgan.

---

### 7. Cascading Disk Unlink on User Avatar Updates
#### FACT
- Fayl: `src/common/types/file.cotroller.typpes.ts` (L6-L14) va `src/modules/users/users.service.ts` (L54-L59, L121-L126)
- Kod parchasi:
```typescript
export function unlinkFile(filename: string) {
  try {
    const fullPath = join(getPathInFileType(filename), filename);
    if (fullPath) unlinkSync(fullPath);
  } catch (error) { ... }
}

// users.service.ts
if (oldUser.avatar) {
  const filename = oldUser.avatar.split("/").at(-1);
  unlinkFile(filename || "");
}
```
#### OBSERVATION
Foydalanuvchi o'z profil rasmini yangilaganda, ma'lumotlar bazasida yangi URL saqlanishi bilan birga eski rasm faylining URL manzilidan fayl nomi ajratib olinadi va `getPathInFileType` orqali fayl joylashgan papka topilib, `unlinkSync` orqali sinxron ravishda diskdan o'chiriladi.

#### NEGA ODATIY EMAS
Kopchilik backend dasturchilar foydalanuvchi profil rasmini yangilaganda eski rasmlarni diskda unutib qoldirishadi, natijada disk to'lib boradi. Fayzillo esa rasm yangilanishi (`update` / `updateavatar` / `updateImage`) hamda o'chirilishi bilanoq diskdagi mos keluvchi fayl yo'lini aniqlab, eski rasmni zudlik bilan yo'q qiluvchi fayl tizimi tozalagichini joriy qilgan.

---

### 8. Multi-Criteria Granular Property Rating Model
#### FACT
- Fayl: `prisma/schema.prisma` (L161-L180)
- Kod parchasi:
```prisma
model Reviw {
    id         String  @id @default(uuid())
    userId     String
    propertyId String
    comment    String?

    Cleanliness   Float
    Communication Float
    Check_in      Float
    Accuracy      Float
    Location      Float
    Value         Float

    user     User     @relation(fields: [userId], references: [id])
    property Property @relation(fields: [propertyId], references: [id])
    createdAt DateTime @default(now())
    @@map("reviw")
}
```
#### OBSERVATION
Ko'chmas mulk obyekti uchun sharh (Review) qoldirish modelida yagona bitta `rating: Int` (masalan 1 dan 5 gacha) ustuni saqlash o'rniga, baholash 6 ta alohida float mezonlarga bo'lingan: Tozalik (`Cleanliness`), Muloqot (`Communication`), Joylashuv jarayoni (`Check_in`), Aniqlik (`Accuracy`), Joylashuv (`Location`), va Narx muvofiqligi (`Value`).

#### NEGA ODATIY EMAS
Odatdagi e-commerce loyihalarida faqat 1 ta umumiy baholash bali (1-5 yulduz) ishlatiladi. Bu yerda esa Airbnb platformasi standartlariga mos keluvchi ko'p mezonli (multi-dimensional metric) ko'chmas mulk analitikasi uchun granular Prisma schema strukturasi shakllantirilgan.

---

### 9. Idempotent State Toggle Controller Pattern (`FavoriteService.create`)
#### FACT
- Fayl: `src/modules/favorite/favorite.service.ts` (L9-L27)
- Kod parchasi:
```typescript
async create(propertyId: string, userId: string) {
  const exists = await this.prisma.favorite.findFirst({
    where: { propertyId, userId },
  });

  if (exists) {
    await this.prisma.favorite.delete({ where: { id: exists.id } });
    return { message: "Removed from favorites", removed: true };
  }

  const favorite = await this.prisma.favorite.create({
    data: { propertyId, userId },
    include: { property: true },
  });
  return { message: "Added to favorites", favorite };
}
```
#### OBSERVATION
Sevimlilar ro'yxatiga e'lonni qo'shish uchun alohida `add` va `remove` endpointlari ochib o'tirmasdan, yagona `create` metodi ichida dynamic toggle (yoqish/o'chirish) mantig'i kiritilgan: agar e'lon allaqachon sevimlilar bazasida bo'lsa o'chiriladi, yo'q bo'lsa qo'shiladi.

#### NEGA ODATIY EMAS
Klassik REST API yo'riqnomalarida `POST /favorite` qo'shish va `DELETE /favorite/:id` o'chirish uchun alohida-alohida yaratiladi. Dasturchi esa frontend va mobile ilovalar tugmachalari (Heart icon) bilan ishlashini osonlashtirish uchun Idempotent Toggle-based Controller Pattern qo'llagan.

---

### XULOSA

`e-commerce-backend` loyihasining 69 ta source va konfiguratsiya fayllari to'liq tahlil qilindi. Tahlil davomida dasturchi Fayzillonining andozaviy CRUD hamda standart framework boilerplate patternlaridan tashqari yozgan **9 ta diqqatga sazovor va noodatiy custom yechimi** ajratib olindi va hujjatlashtirildi.

#### Eng diqqatga sazovor 3 ta yechim:
1. **Deploy Post-Processing Real-Time Memory Monitoring Engine (`src/core/memory.manitoring_functions.ts`)**: Tashqi APM utilitalarisiz Node.js backend ilovasi ichidan OS `ps aux` buyruqlari va Linux Cgroup xotira fayllari orqali RAM sarfini dinamik nazorat qilish va avtomatik ogohlantirish tizimi.
2. **Multer Exception Handling Automatic Disk Sweeper (`src/core/error/validation.filter.ts`)**: Validation xatosi yuz berganda server diskida yetim bo'lib qoladigan vaqtincha yuklangan fayllarni Exception Filter darajasida avtomatik o'chiruvchi xavfsizlik va xotira tozalash mexanizmi.
3. **HTTP 206 Range-Based Partial Content Streaming (`src/common/types/generator.types.ts`)**: Brauzerlarning video pleyer va media streaming talablariga mos keluvchi, resurslarni bo'laklab stream qiladigan HTTP 206 Partial Content protokoli va read stream boshqaruvi.
