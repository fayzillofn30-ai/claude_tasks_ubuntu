# Telegram App Backend — Chuqur (Fulldeep) Tahlil Hisoboti

**Sana:** 2026-08-03  
**Qamrab olingan source fayllar soni:** 112 ta  
**Loyiha joylashuvi:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/`  

---

### 1. Noodatiy Yechim: OS-Level System & Process Memory Diagnostic Engine
#### FACT
- Fayl: `src/core/memory.manitoring_functions.ts` (L10-L237)
- Kod parchasi:
```typescript
export function showTop10RamConsumers() {
  if (process.platform === 'linux') {
    const output = execSync('ps aux --sort=-%mem --no-headers | head -10', { encoding: 'utf8' });
    ...
  }
}

export function showContainerInfo() {
  const memLimitPath = '/sys/fs/cgroup/memory/memory.limit_in_bytes';
  const memLimit = execSync(`cat ${memLimitPath} 2>/dev/null`, { encoding: 'utf8' }).trim();
  ...
}

export function setupMemoryAlert(thresholdMB = 500, intervalMs = 30000) {
  setInterval(() => {
    const memUsage = process.memoryUsage();
    if (Math.round(memUsage.rss / 1024 / 1024) > thresholdMB) {
      console.warn(`⚠️ YUQORI XOTIRA SARFI OGOHLANTIRUVI!`);
    }
  }, intervalMs);
}
```

#### OBSERVATION
Dasturchi server va konteyner (Render/Docker) resurslarini monitoring qilish uchun maxsus diagnostika modulini yozgan. U Linux tizim buyrug'i (`ps aux --sort=-%mem`), macOS platformasi va Docker cgroups (`/sys/fs/cgroup/memory/memory.limit_in_bytes`) fayllarini o'qib, TOP 10 RAM iste'molchi jarayonlarini, OS load average va Node.js RSS/Heap xotirasini tahlil qiladi hamda interval-based memory threshold ogohlantirishini beradi.

#### NEGA ODATIY EMAS
Standart NestJS yoki Node.js server ilovalarida RAM monitoringi va process inspection uchun tashqi APM tizimlari (NewRelic, Datadog, PM2, Prometheus metrics) ishlatiladi. Dasturchi esa hech qanday tashqi kutubxonasiz Linux CLI va Cgroup OS darajasidagi buyruqlarni to'g'ridan-to'g'ri Node.js subprocess va filesystem orqali backend loyihasiga integratsiya qilgan.

---

### 2. Noodatiy Yechim: In-Memory HTML5 Canvas Dynamic Avatar Generator
#### FACT
- Fayl: `src/common/types/generator.types.ts` (L143-L222) va `src/modules/users/users.service.ts` (L44-L49)
- Kod parchasi:
```typescript
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
  ctx.fillText(initials, x, y);

  const fileName = `avatar_${initials.toLowerCase()}_${Date.now()}.png`;
  const fullPath = join(getPathInFileType(fileName), fileName);
  writeFileSync(fullPath, canvas.toBuffer('image/png'));
  return urlGenerator(config, fileName);
}
```

#### OBSERVATION
Yangi foydalanuvchi ro'yxatdan o'tganda agar avatar rasm yuklamagan bo'lsa, server-side `canvas` moduli yordamida dinamik PNG rasm yaratiladi. Ishlab chiqilgan algoritm foydalanuvchining ism-familiyasi bosh harflarini oladi, random rang tanlaydi va YIQ brightness formulasi (`(r * 299 + g * 587 + b * 114) / 1000`) yordamida matn uchun kontrastli rang (oq yoki qora) berib, diskda haqiqiy `.png` rasm yaratadi va URL qaytaradi.

#### NEGA ODATIY EMAS
Odatiy loyihalarda profil rasmi bo'lmaganda frontendda shunchaki CSS background/fallback ko'rsatiladi yoki tashqi Gravatar/Dicebear kabi API servislarga so'rov yuboriladi. Bu yerda esa serverning o'zida matematik kontrast formula va HTML5 Canvas 2D context orqali custom avatar generatsiya qilish mexanizmi o'rnatilgan.

---

### 3. Noodatiy Yechim: HTTP 206 Partial Content Video/Audio Streaming Pipeline
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
    ...
  }
}
```

#### OBSERVATION
Katta hajmli media (video, audio va fayllar) uzatishda standard `res.sendFile` o'rniga HTTP Range protokoli qo'lda amalga oshirilgan. Funksiya HTTP so'rovi sarlavhasidagi `range` (`bytes=start-end`) parametrini ajratib oladi, `fs.stat` orqali fayl o'lchamini tekshiradi va Node.js stream (`createReadStream`) orqali xuddi media-pleyerlar talab qilgandek 206 Partial Content status va `Content-Range` headerlari bilan bo'laklab streaming qiladi.

#### NEGA ODATIY EMAS
Odatda NestJS ilovalarida media o'qish uchun oddiy static file middleware, `StreamableFile` yoki tashqi Nginx/S3/CDN servislari qo'llaniladi. Dasturchi past darajadagi (low-level) HTTP Range specification protokoli va Node.js Stream pipeing mexanizmini o'zi noldan yozib chiqqan.

---

### 4. Noodatiy Yechim: Multi-Device Socket Session Store va Real-Time Connectivity Manager
#### FACT
- Fayl: `src/soket/soket.service.ts` (L8-L79) va `src/soket/soket.gateway.ts` (L18-L38)
- Kod parchasi:
```typescript
export class SessionsService {
  public userSessions: Record<string, Record<string, string[]>> = {};

  addConnection(userId: string, deviceId: string, socket: Socket) {
    this.sendToUser(userId, { userId, isOnline: true }, "online");
    if (!this.userSessions[userId]) this.userSessions[userId] = {};
    if (!this.userSessions[userId][deviceId]) this.userSessions[userId][deviceId] = [];
    this.userSessions[userId][deviceId].push(socket.id);
  }

  removeConnection(userId: string, deviceId: string, socketId: string) {
    this.sendToUser(userId, { userId, isOnline: false }, "online");
    if (this.userSessions[userId]?.[deviceId]) {
      this.userSessions[userId][deviceId] = this.userSessions[userId][deviceId].filter(id => id !== socketId);
      if (this.userSessions[userId][deviceId].length === 0) delete this.userSessions[userId][deviceId];
      if (Object.keys(this.userSessions[userId]).length === 0) delete this.userSessions[userId];
    }
  }
}
```

#### OBSERVATION
Bitta foydalanuvchining turli qurilmalaridan (telefon, noutbuk, brauzer) bir vaqtning o'zida bir nechta WebSockets ulanishlarini boshqarish uchun 3 darajali nested in-memory xarita (`Record<string, Record<string, string[]>>`) yaratilgan. Socket ulanishi uzilganda zanjirli ravishda bo'sh qolgan `deviceId` va `userId` obyekt kalitlarini JavaScript `delete` operatori orqali o'chirib, xotirani tozalaydi (cascading key cleanup).

#### NEGA ODATIY EMAS
Odatda Socket.io ilovalarida oddiy `socket.join(userId)` rooms mexanizmi yoki Redis Adapter ishlatiladi. Bu yerda esa har bir foydalanuvchining aynan qaysi `deviceId` qurilmasida nechta socket sessiyasi borligini va tarmoqdan uzilganda xotirani bo'shatishni ta'minlaydigan maxsus Session Store data-structure tuzilgan.

---

### 5. Noodatiy Yechim: Path-Based Dynamic Multi-Token Authorization Guard
#### FACT
- Fayl: `src/global/guards/jwt.auth.guard.ts` (L35-L83)
- Kod parchasi:
```typescript
async getPayload(req: Request, ctx: ExecutionContext) {
  let token: string | undefined;
  const point = req.path.split('/').at(-1);
  const auth = req.headers.authorization;

  if (auth && auth.startsWith('Bearer ')) {
    token = auth.split(' ')[1];
  }

  if (!token) {
    if (point === 'reset-token') {
      token = req.cookies?.refreshToken;
    } else if (point === 'verification') {
      token = req.cookies?.sessionToken;
    } else {
      token = req.cookies?.accessToken;
    }
  }

  const type =
    point === 'reset-token'
      ? jwtTokenTypeEnum.REFRESH
      : point === 'verification'
        ? jwtTokenTypeEnum.SESSION
        : jwtTokenTypeEnum.ACCESS;

  const user: JwtPayload = await this.jwtSubService.verifyToken<JwtPayload>(token, type);
  req['user'] = user;
}
```

#### OBSERVATION
NestJS `JwtAuthGuard` ichida so'rov path-ining oxirgi segmenti (`req.path.split('/').at(-1)`) tahlil qilinadi va `point` parametriga ko'ra so'rov uchun kerakli token (Header Bearer, Cookie `refreshToken`, `sessionToken` yoki `accessToken`) hamda mos verify token turi (`REFRESH`, `SESSION`, `ACCESS`) dinamik ravishda bitta Guard ichida tanlanadi.

#### NEGA ODATIY EMAS
NestJS/Passport amaliyotida har bir JWT token turi uchun alohida AuthGuard va Strategy klasslari (`@UseGuards(JwtRefreshGuard)`, `@UseGuards(JwtAccessGuard)`) yaratiladi. Bu yerda esa bitta unifikatsiyalangan Guard orqali URL path introspection va dynamic cookie-token router algoritmi qo'llanilgan.

---

### 6. Noodatiy Yechim: Self-Chat ("Saqlangan xabarlar") & Unified Polymorphic Chat Aggregator
#### FACT
- Fayl: `src/modules/chats/chats.service.ts` (L49-L65, L110-L204) hamda `src/modules/users/users.service.ts` (L74-L78)
- Kod parchasi:
```typescript
const isSavedChat = chat.user1Id === chat.user2Id && chat.user1Id === user1Id;
const owner = user1Id === chat.user1Id ? chat.user2 : chat.user1;
const profile = owner.Profile?.[0];

const title = isSavedChat
  ? "Saqlangan xabarlar"
  : `${profile?.firstName ?? ""} ${profile?.lastName ?? ""}`.trim();

const logo = isSavedChat
  ? urlGenerator(this.config, "save_messages.png")
  : profile?.avatar ?? null;

...
const allChats = [...userChatData, ...groupChatData, ...channelChatData];
return allChats.sort(
  (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
);
```

#### OBSERVATION
Prisma ma'lumotlar bazasida `UserChat`, `GroupChat` va `ChannelChat` alohida jadvallarda saqlanadi. Service qatlamida esa foydalanuvchi o'z-o'zi bilan chat ochganda (`user1Id === user2Id`) avtomatik aniqlanib, Telegram'dagi "Saqlangan xabarlar" (Saved Messages) ko'rinishiga o'tkaziladi. Shuningdek, 3 xil chat modellari parallel so'rab olinib, xotirada yagona DTO strukturaga normallashtiriladi va so'nggi yangilanish vaqti (`updatedAt`) bo'yicha saralanib unifikatsiyalangan Feed hosil qilinadi.

#### NEGA ODATIY EMAS
Odatda har bir chat turi uchun alohida endpointlar yoki bazada murakkab SQL UNION / View operatsiyalari ishlatiladi. Dasturchi esa 3 xil Prisma modelini NestJS service xotirasida bitta unified Telegram-like Feed ko'rinishiga va "Saqlangan xabarlar" mantig'iga normallashtirgan.

---

### 7. Noodatiy Yechim: Dynamic Media Array Cascade File Cleanup Engine
#### FACT
- Fayl: `src/modules/messages/messages.service.ts` (L17-L28)
- Kod parchasi:
```typescript
async function deleteMessageFiles(message: any) {
  const { files, docs, images, stickers, videos } = message;
  [files, docs, images, stickers, videos].forEach((arr: JsonValue) => {
    if (Array.isArray(arr)) {
      arr.forEach((val) => {
        if (typeof val === 'string') unlinkFile(val.split("/").at(-1) || "");
      });
    }
  });
}

// Service ichida:
await this.prisma.messageUserChat.delete({ where: { id: messageId } });
await deleteMessageFiles(message);
```

#### OBSERVATION
Baza ma'lumotlaridan xabar o'chirilganda, xabarga biriktirilgan barcha JSON formatidagi media massivlar (`files`, `docs`, `images`, `stickers`, `videos`) bo'ylab iteratsiya qilinadi. Har bir fayl URL-idan fayl nomi ajratib olinib, `unlinkFile` orqali diskdagi haqiqiy saqlangan fayl jismonan o'chiriladi.

#### NEGA ODATIY EMAS
Ko'pchilik backendlarda xabar o'chirilganda diska yuklangan fayllar unutilib "yetim fayl" (orphan file) bo'lib qoladi yoki alohida cron-jobga topshiriladi. Bu yerda esa dynamic JSON inspection va cascade disk file cleanup mantiqan har bir xabar o'chirilishi bilan sinxron bog'langan.

---

### 8. Noodatiy Yechim: Prisma Dynamic Generic Model Resource Validator
#### FACT
- Fayl: `src/common/types/check.functions.types.ts` (L6-L54)
- Kod parchasi:
```typescript
export async function checkExistsResurs<T>(
  prisma: PrismaService,
  modelName: ModelsEnumInPrisma,
  field: string,
  value: any
): Promise<T> {
  if (prisma[modelName] && typeof prisma[modelName].findFirst === 'function') {
    const result = await prisma[modelName].findFirst({
      where: { [field]: value },
    });
    if (!result) {
      throw new NotFoundException(`${modelName[0].toUpperCase()}${modelName.slice(1)} Not found by ${field}`);
    }
    return result;
  }
  throw new HttpException("Kutilmagan xatolik !", 500);
}
```

#### OBSERVATION
Resurs mavjudligini yoki yo'qligini tekshirish uchun har bir service va modelga alohida `findUnique` yozish o'rniga universal generic helper yaratilgan. U Prisma client obyekti dynamic indexing (`prisma[modelName]`) va ob'ekt ustun nomi (`field`) orqali istalgan ma'lumotlar bazasi jadvalidan qidiruv o'tkazadi va mos `NotFoundException` yoki `ConflictException` tashlaydi.

#### NEGA ODATIY EMAS
Odatda har bir service metodida takroriy SQL / Prisma so'rovlari va exception logic (`if (!user) throw new NotFoundException()`) yoziladi. Dasturchi esa Prisma ob'ektini dinamik kalit orqali chaqiradigan yagona universal validation funksiyasini qurgan.

---

### 9. Noodatiy Yechim: Polymorphic Model Separation & JSON Media Schema Architecture
#### FACT
- Fayl: `prisma/schema.prisma` (L66-L218)
- Kod parchasi:
```prisma
model MessageUserChat {
  id       String  @id @default(uuid())
  chatId   String  @map("chat_id")
  replayId String? @map("replay_id")
  senderId String  @map("sender_id")
  text     String?
  images   Json?
  videos   Json?
  docs     Json?
  files    Json?
  stickers Json?   @map("stikers")
  ...
  replyTo MessageUserChat?  @relation("UserChatReply", fields: [replayId], references: [id])
  replies MessageUserChat[] @relation("UserChatReply")
}
```

#### OBSERVATION
Telegram loyihasidagi xabarlar va chatlarni modellashda bitta `messages` va `chats` jadvalidan foydalanish o'rniga, har bir tur uchun alohida jadvallar (`MessageUserChat`, `MessageGroup`, `MessageChannel` va `UserChat`, `GroupChat`, `ChannelChat`) yaratilgan. Har bir xabar jadvalida media turlari uchun 5 xil alohida Json ustun hamda recursive self-referential reply interfeysi loyihalangan.

#### NEGA ODATIY EMAS
Klassik DB arxitekturalarida Single Table Inheritance (bitta umumiy jadval va `chat_type`, `message_type` ustuni) qo'llaniladi. Bu yerda esa ma'lumotlar bazasi darajasida chat turlari bo'yicha qat'iy izolyatsiya va schema integrity ta'minlangan.

---

### 10. Noodatiy Yechim: Dynamic File Type Storage & MIME Extension Sanitization Factory
#### FACT
- Fayl: `src/common/types/upload_types.ts` (L14-L43) va `src/common/types/generator.types.ts` (L44-L66)
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
Multer fayl yuklash konfiguratsiyasi zavod (factory) ko'rinishida yozilgan. U yuklanayotgan fayl kengaytmasini (`file.originalname`) tahlil qilib, `getPathInFileType` orqali dinamik ravishda kerakli `uploads/images`, `uploads/videos`, `uploads/docs`, `uploads/archive` papkalarini diskda yaratadi va ajratadi. Shuningdek `fileFilters` orqali MIME-tip bo'yicha dinamik sanitizatsiya va `UnsupportedMediaTypeException` beradi.

#### NEGA ODATIY EMAS
Odatda Multer fayllarni bitta statik katalogga (`uploads/`) tashlaydi. Bu yerda esa fayl turiga qarab avtomatik katalog yaratish va fayllarni turiga ko'ra diskda guruhlash factory mexanizmi o'rnatilgan.

---

### Xulosa
`telegram_app_backend` loyihasining 112 ta manba faylini birma-bir chuqur tahlil qilish natijasida **10 ta** aniq, real va o'ziga xos noodatiy yechim va algoritmik yondashuvlar ajratib olindi.

**Eng diqqatga sazovor 3 ta yechim:**
1. **OS-Level System & Process Memory Diagnostic Engine (`checkMemoryAfterDeploy`)** — Tashqi APM servislarisiz Linux `ps aux` va Docker `cgroups` orqali Node.js server resurslarini past darajali OS monitoring qilish.
2. **In-Memory HTML5 Canvas Dynamic Avatar Generator (`generateAvatar`)** — Gravatar yoki static fayllarsiz server-side Canvas API va YIQ yorqinlik matematik formulasi yordamida dinamik profil rasmi yaratish.
3. **HTTP 206 Partial Content Video/Audio Streaming Pipeline (`headerDataStream`)** — Standart `sendFile` o'rniga HTTP Range protokoli va Node.js Stream pipeing yordamida mediani bo'laklab streaming qilish.
