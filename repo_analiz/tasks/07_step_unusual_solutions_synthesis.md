# 07-Bosqich: Noodatiy va Custom Yechimlar Sintezi Hujjati

- **Sana:** 2026-08-04
- **Qamrab olingan hisobotlar soni:** 11 ta FULLDEEP hisobot (`reports_agy/fulldeep_01_*.md` ... `reports_agy/fulldeep_11_*.md`)
- **Tahlil qilingan repozitoriyalar:** `Admin-panel`, `StudentSYStemMenegment`, `6_oy_imtihon`, `mini-erp`, `e-commerce` (frontend), `e-commerce-backend`, `crm_frontend`, `crm_backend`, `telegram_app_front_end`, `telegram_app_backend`, `online-courses`.

---

## KIRISH VA METODOLOGIYA

Ushbu hujjat Fayzillo Ummatov tomonidan yaratilgan 11 ta real amaliy loyihaning manba kodlaridan shakllantirilgan **FULLDEEP** chuqur tahlil hisobotlari kesimida tayyorlangan yakuniy sintez hujjatidir.

> **Muhim Eslatma:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/principles.md` faylida ilgari hujjatlashtirilgan umumiy va takrorlanuvchi patternlar (masalan: `setDefaultUsers` dynamic mock generator, `isvalid` custom schema validator, `initGlobalApp` global bootstrapping, `removeImg` sync file deletion va boshqalar) ushbu hujjatda **qaytarilmagan**. Hujjat faqat 11 ta loyihaning chuqur faylma-fayl o'rganilishida topilgan haqiqiy factual topilmalarga asoslanadi.

---

## A. TAKRORLANUVCHI NOODATIY PATTERNLAR (CROSS-PROJECT SIGNATURE SOLUTIONS)

Bir nechta (2+) turli loyihalarda dasturchi tomonidan mustaqil ravishda qayta yaratilgan noodatiy yechimlar va custom algoritmlar:

---

### 1. Prisma Dynamic Model Reflection Engine (`prisma[modelName]`)
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/common/types/check.functions.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/common/types/check.functions.types.ts#L5-L25) (L5–L25)
  - `crm_backend`: [`src/common/types/check.functions.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/common/types/check.functions.types.ts#L6-L58) (L6–L58)
  - `telegram_app_backend`: [`src/common/types/check.functions.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/common/types/check.functions.types.ts#L6-L54) (L6–L54)
- **Mexanizm:**
  Dasturchi har bir controller yoki service ichida Prisma ORM orqali mavjudlikni tekshirish uchun takroriy `findFirst` so'rovlari va shartli exception'lar yozib o'tirmaydi. Buning o'rniga Prisma Service obyekti dynamic reflection rejimida (`prisma[modelName]`) chaqiriladi va berilgan model hamda maydon (`field: value`) bo'yicha universal tarzda avtomatik `ConflictException` yoki `NotFoundException` otadi.
- **Nima uchun "Signature" yondashuv:**
  Standard NestJS / Prisma amaliyotida har bir model uchun alohida DB helper metodlari yoziladi. Fayzillo esa TypeScript string indexing va generic validation decorator tamoyillaridan foydalanib, ORM modelining o'zini dinamik refleksiya qiluvchi resurs audit dvigatelini 3 ta backend loyihasida ketma-ket qo'llagan.

---

### 2. Low-Level HTTP 206 Partial Content Range-Based Media Streaming Engine
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/common/types/generator.types.ts#L32-L79) (L32–L79) hamda [`src/core/services/file.stream.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/core/services/file.stream.service.ts#L9-L18) (L9–L18)
  - `crm_backend`: [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/common/types/generator.types.ts#L68-L140) (L68–L140) hamda [`src/core/services/file.stream.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/core/services/file.stream.service.ts#L15-L24) (L15–L24)
  - `telegram_app_backend`: [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/common/types/generator.types.ts#L68-L140) (L68–L140) hamda [`src/core/services/file.stream.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/core/services/file.stream.service.ts#L15-L24) (L15–L24)
- **Mexanizm:**
  Media fayllarni (video, audio, darsliklar) mijoz brauzeriga uzatishda express-static yoki oddiy `res.sendFile` ishlatilmaydi. HTTP `Range: bytes=start-end` sarlavhasi o'qiladi, fayl hajmi `fs.stat` orqali hisoblanadi va HTTP `206 Partial Content` javob kodi bilan `createReadStream(filePath, { start, end })` orqali bo'laklab stream qilinadi.
- **Nima uchun "Signature" yondashuv:**
  Media fayllarni bo'laklab uzatish va video pleyerlarda seek/scroll bar muammosiz ishlashini ta'minlash uchun tashqi CDN yoki Nginx serverlariga tayanmasdan, Node.js stream pipeing va HTTP 206 protokolini loyihalarning o'zida past darajada (low-level) o'zi shakllantirgan.

---

### 3. In-Memory Map-Based Anti-Spam Rate-Limited Expiring Cache Engine (`CacheService`)
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/core/auth/cache.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/core/auth/cache.service.ts#L11-L26) (L11–L26)
  - `crm_backend`: [`src/core/auth/cache.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/core/auth/cache.service.ts#L9-L37) (L9–L37)
- **Mexanizm:**
  OTP kodlarini (email tasdiqlash tokenlarini) saqlashda va qayta yuborish chastotasini cheklashda Redis ulamasdan, toza JavaScript `Map<string, UserCacheValue>` obyekti va `setTimeout` vaqt taymeridan foydalanilgan. Agar keshda mavjud pochtaga qayta kod so'ralsa, zudlik bilan `BadRequestException` beriladi va belgilangan TTL o'tgach kesh avtomatik o'chiriladi.
- **Nima uchun "Signature" yondashuv:**
  Ortiqcha infratuzilma xarajatlaridan va tashqi `redis` dependency-laridan qochib, ilova operativ xotirasida (in-memory) rate-limiting anti-spam va self-expiring kesh klassini minimal va o'ta samarali ko'rinishda yaratish.

---

### 4. Server-Side Dynamic Canvas-Based User Avatar Generator with YIQ Contrast Engine
- **Fakt va Fayllar:**
  - `crm_backend`: [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/common/types/generator.types.ts#L143-L222) (L143–L222)
  - `telegram_app_backend`: [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/common/types/generator.types.ts#L143-L222) (L143–L222) hamda [`src/modules/users/users.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/modules/users/users.service.ts#L44-L49) (L44–L49)
- **Mexanizm:**
  Foydalanuvchi profiliga rasm yuklamagan taqdirda, server Node.js muhitida `canvas` (HTML5 Canvas 2D) moduli orqali 300x300 hajmdagi PNG avatar rasmini dinamik render qiladi. YIQ RGB yorqinlik matematik formulasi (`(r*299 + g*587 + b*114) / 1000`) yordamida fon rangiga va matn yorqinligiga qarab kontrast harf rangini (oq yoki qora) tanlaydi va real `.png` fayl shaklida diska yozadi.
- **Nima uchun "Signature" yondashuv:**
  Frontendda static fallback UI ko'rsatish yoki Gravatar kabi uchinchi tomon API-lariga so'rov yuborish o'rniga, backend qatlamining o'zida matematik kontrast formulalari va grafik 2D render dvigatelini birlashtirish.

---

### 5. Deploy Post-Processing OS-Level Real-Time Memory Monitoring Engine (`ps aux` / Cgroups)
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/core/memory.manitoring_functions.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/core/memory.manitoring_functions.ts#L10-L34) (L10–L34)
  - `telegram_app_backend`: [`src/core/memory.manitoring_functions.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/core/memory.manitoring_functions.ts#L10-L237) (L10–L237)
- **Mexanizm:**
  Node.js ilovasi ichidan operatsion tizim (Linux, macOS) shell buyruqlarini (`ps aux --sort=-%mem`) va Docker cgroup fayllarini (`/sys/fs/cgroup/memory/memory.limit_in_bytes`) `execSync` orqali o'qib, TOP 10 RAM iste'molchilarini hamda RSS/Heap xotira chegarasini har 30 soniyada tekshirib boruvchi monitoring moduli.
- **Nima uchun "Signature" yondashuv:**
  Tashqi APM agentlariga (NewRelic, Datadog) bog'lanib qolmasdan, Node.js va Linux pastki tizimlari o'rtasida to'g'ridan-to'g'ri ko'prik o'rnatib, deploy jarayonidan so'ng server xotirasi holatini avtomatik nazorat qilish.

---

### 6. Extension & Field-Aware Multer Storage Pipeline (`getPathInFileType`)
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/common/types/upload_types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/common/types/upload_types.ts#L14-L59) (L14–L59)
  - `telegram_app_backend`: [`src/common/types/upload_types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/common/types/upload_types.ts#L14-L43) (L14–L43) hamda [`src/common/types/generator.types.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/common/types/generator.types.ts#L44-L66) (L44–L66)
- **Mexanizm:**
  Multer storage konfiguratsiyasida static papka ko'rsatilmaydi. Yuklanayotgan har bir fayl kengaytmasiga ko'ra (`file.originalname`) `uploads/images`, `uploads/videos`, `uploads/docs`, `uploads/archive` yo'nalishlariga avtomatik ajratiladi hamda diskda papka yo'q bo'lsa `mkdirSync` bilan sinxron yaratiladi.
- **Nima uchun "Signature" yondashuv:**
  Fayllarni bitta umumiy `uploads/` papkasiga tashlab aralashtirib yubormasdan, yuklash bosqichining o'zidayoq fayl turi bo'yicha disk darajasida avtomatik tartiblovchi factory pipeline yaratish.

---

### 7. Dynamic User-Agent Parsing Middleware & Context Decorator (`DeviceMiddleware`, `@Device`)
- **Fakt va Fayllar:**
  - `crm_backend`: [`src/global/middlewares/device.middleware.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/global/middlewares/device.middleware.ts#L6-L15) (L6–L15) hamda [`src/global/decorators/device.getter.decorator.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/global/decorators/device.getter.decorator.ts#L3-L8) (L3–L8)
  - `online-courses`: [`src/global/middlewares/device.middleware.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/online-courses/src/global/middlewares/device.middleware.ts#L8-L13) (L8–L13) hamda [`src/global/decorators/device.getter.decorator.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/online-courses/src/global/decorators/device.getter.decorator.ts#L3-L8) (L3–L8)
- **Mexanizm:**
  `useragent` kutubxonasi yordamida har bir kiruvchi HTTP so'rovning brauzer va OS versiyasini, IP manzilini parsing qilib `req['device']` ga joylashtirish va NestJS `createParamDecorator` orqali controller metodlariga `@Device()` parametri sifatida uzatish.
- **Nima uchun "Signature" yondashuv:**
  Controller metodlarida har gal `req.headers` ni qo'lda o'qib o'tirmasdan, middleware va custom decorator sinergiyasi orqali mijoz qurilmasi metadata-larini avtomatlashtirilgan injecting usulida qabul qilish.

---

### 8. Cascading Disk Unlink on User Avatar Updates & Dynamic Media Array File Cleanups
- **Fakt va Fayllar:**
  - `e-commerce-backend`: [`src/common/types/file.cotroller.typpes.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/common/types/file.cotroller.typpes.ts#L6-L14) (L6–L14) hamda [`src/modules/users/users.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/modules/users/users.service.ts#L54-L59) (L54–L59)
  - `telegram_app_backend`: [`src/modules/messages/messages.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/modules/messages/messages.service.ts#L17-L28) (L17–L28)
- **Mexanizm:**
  Foydalanuvchi avatari o'zgarganda yoki xabar o'chirilganda, avatar yoki JSON ichidagi media massivlar (`files`, `docs`, `images`, `stickers`, `videos`) dagi fayl nomlari URL-dan ajratib olinib `unlinkSync` yordamida diskdagi fayllar jismonan yo'q qilinadi.
- **Nima uchun "Signature" yondashuv:**
  Ma'lumotlar bazasida yozuv o'chirilganda yoki yangilanganda diskda "yetim fayl" (orphan file) to'planishining oldini olish uchun fayl tizimi tozalagichini (disk cleanup engine) biznes mantiqqa sinxron ulash.

---

### 9. Multi-Device Socket Session Store & Real-Time Connectivity Manager
- **Fakt va Fayllar:**
  - `telegram_app_backend`: [`src/soket/soket.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/soket/soket.service.ts#L8-L79) (L8–L79) hamda [`src/soket/soket.gateway.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/soket/soket.gateway.ts#L18-L38) (L18–L38)
  - `telegram_app_front_end`: [`src/service/socket.io.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_front_end/src/service/socket.io.ts#L18-L21) (L18–L21 - client-side `v4()` deviceId handshake)
- **Mexanizm:**
  Bitta foydalanuvchining bir nechta brauzer va qurilmalaridan socket ulanishlarini boshqarish uchun 3 darajali nested xarita (`userSessions[userId][deviceId]`) tuzilgan. Ulanish uzilganda bo'sh qolgan kalitlar JavaScript `delete` operatori orqali cascading tozalab boriladi.
- **Nima uchun "Signature" yondashuv:**
  Oddiy socket room'laridan ko'ra chuqurroq bo'lgan dynamic multi-device connection tracking va memory cleanup strukturasini har ikkala frontend va backend qatlamlarida muvofiqlashtirgan holda qurish.

---

## B. ENG NOYOB VA O'ZIGA XOS YAGONA YECHIMLAR (TOP 15 SINGLE-PROJECT SOLUTIONS)

Faqat bitta loyihada uchragan, lekin g'oyasi, ijodkorligi va murakkabligi jihatidan ajralib turadigan top 15 yagona yechim:

---

### 1. `emptyIdlist` Garbage Collection Pool
- **Loyiha:** `Admin-panel`
- **Fayl va Qatorlar:** [`appdata/componenta.js`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/Admin-panel/appdata/componenta.js#L56-L60) (L56–L60) hamda [`appdata/function.js`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/Admin-panel/appdata/function.js#L45-L51) (L45–L51)
- **Noodatiy Jihati:**
  Foydalanuvchi o'chirilganda uning ID raqami `emptyIdlist` massiviga tashlanadi. Yangi foydalanuvchi yaratilganda `.sort((a,b) => b - a).pop()` orqali o'chirilgan ID larning eng kichigi qayta ishlatiladi. `AUTO_INCREMENT` monoton o'sishi o'rniga ID larni qayta to'ldirish (ID Memory Reclaimer) mexanizmi yaratilgan.

---

### 2. Differential State Audit via Dynamic Mutation (`oldata` & `newData`)
- **Loyiha:** `StudentSYStemMenegment`
- **Fayl va Qatorlar:** [`src/servise/servise.js`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/StudentSYStemMenegment/src/servise/servise.js#L74-L95) (L74–L95)
- **Noodatiy Jihati:**
  Fayl-bazali storage sharoitida PUT so'rovi bajarilayotganda `.map()` jarayonining o'zida ma'lumotning o'zgarishdan oldingi (`oldata`) va keyingi (`newData`) holatlari bitta obyektda tutib qolinadi va HTTP response javobida audit diff ko'rinishida qaytariladi.

---

### 3. HTML Hujjatlarini C Source Fayl Kengaytmasi (`.c`) Sifatida Saqlash va Breakpoint Media Queries o'rniga Static Layout Fayllari
- **Loyiha:** `6_oy_imtihon` (`c_web_template`)
- **Fayl va Qatorlar:** [`src/home.c`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/6_oy_imtihon/src/home.c#L1-L12) (L1–L12) hamda [`src/system.c`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/6_oy_imtihon/src/system.c#L12-L13) (L12–L13, L35)
- **Noodatiy Jihati:**
  HTML markup sahifalari C dasturlash tili kengaytmasida (`.c`) saqlangan. Moslashuvchanlik uchun CSS `@media` queries ishlatilmasdan, mobil o'lchamlar uchun qat'iy pikselli alohida layout fayllari (`system.c`, `frame.c`) noldan statik qurilgan.

---

### 4. Pure JS Leap Year & Month-Day Birthday Validation Engine
- **Loyiha:** `mini-erp`
- **Fayl va Qatorlar:** [`src/utils/resurs/modelComponentes/userComponentes.js`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/mini-erp/src/utils/resurs/modelComponentes/userComponentes.js#L7-L51) (L7–L51)
- **Noodatiy Jihati:**
  Tashqi sana kutubxonalarisiz (moment, dayjs) pure JS matematik formulalari (`year % 400 === 0`, `oyKunlari`) orqali kabisa yillarini hisoblovchi va 12 oy uchun kunlar chegarasini dinamik aniqlovchi xususiy validatsiya dvigateli yozilgan.

---

### 5. JWT Token Refresh Promise Queue Architecture (`failedQueue`)
- **Loyiha:** `e-commerce` (Frontend)
- **Fayl va Qatorlar:** [`src/service/api.js`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce/src/service/api.js#L20-L102) (L20–L102)
- **Noodatiy Jihati:**
  Parallel yuborilgan so'rovlarda 401 xatoligi yuz berganda so'rovlar rad etilmaydi. Ular `failedQueue` Promise navbatiga yig'iladi va token refresh bo'lgach barchasining header'lari yangilanib qayta yuboriladi (retry logic).

---

### 6. Sliding Replacement Image Upload Buffer
- **Loyiha:** `e-commerce` (Frontend)
- **Fayl va Qatorlar:** [`src/utils/properties-utils/Property-Media.jsx`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce/src/utils/properties-utils/Property-Media.jsx#L14-L27) (L14–L27)
- **Noodatiy Jihati:**
  Rasm yuklash buferi maks 4 ga etganda yangi rasm yuklanishini rad etish va xato berish o'rniga, eng birinchi indeksdagi (`index === 0`) rasmni yangisiga almashtirib ketuvchi "suriluvchi darcha" (sliding window buffer) UI yechimi.

---

### 7. Multer Exception Handling Automatic Disk Sweeper (`MulterValidationExceptionFilter`)
- **Loyiha:** `e-commerce-backend`
- **Fayl va Qatorlar:** [`src/core/error/validation.filter.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/core/error/validation.filter.ts#L4-L55) (L4–L55)
- **Noodatiy Jihati:**
  Multer fayl yuklab bo'lgach Pipe yoki Controller darajasida validation xatosi chiqsa, NestJS Exception Filter darajasida So'rov obyekti ichidan yuklangan vaqtincha fayllarni tutib olib, ularni diskdan zudlik bilan o'chirib tashlaydigan xotira tozalagich tutqich.

---

### 8. Idempotent State Toggle Controller Pattern
- **Loyiha:** `e-commerce-backend`
- **Fayl va Qatorlar:** [`src/modules/favorite/favorite.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/e-commerce-backend/src/modules/favorite/favorite.service.ts#L9-L27) (L9–L27)
- **Noodatiy Jihati:**
  Sevimlilar (favorites) uchun alohida add/remove endpointlari o'rniga, yagona `POST /favorite` controller metodida holat tekshiriladi: mavjud bo'lsa o'chiriladi, yo'q bo'lsa yaratiladi (Idempotent UI-friendly State Toggle).

---

### 9. Map-Based Declarative View Component Router & Fallback Priority Engine
- **Loyiha:** `crm_frontend`
- **Fayl va Qatorlar:** [`src/dashboard/area/Area.tsx`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_frontend/src/dashboard/area/Area.tsx#L22-L32) (L22–L32, L40–L51)
- **Noodatiy Jihati:**
  Dashboard sahifalarini chiqarishda Next.js router orqali tarmoqlanmaydi. Buning o'rniga JSX komponentlari `Map<Type, ReactNode>` ma'lumotlar tuzilmasida saqlanadi va global state id prioritetiga ko'ra `Map.get()` orqali deklarativ dispatch qilinadi.

---

### 10. Discrete Time Slot Matrix Picker (`0..23` Hours & `15-min` Step Minutes)
- **Loyiha:** `crm_frontend`
- **Fayl va Qatorlar:** [`src/components/modal/CreateLesson.tsx`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_frontend/src/components/modal/CreateLesson.tsx#L51-L60) (L51–L60, L143–L185)
- **Noodatiy Jihati:**
  Dars jadvalini kiritishda standart time-picker yoki tayyor UI kutubxonalar ishlatilmagan. Darslar 15 minutlik intervallarda bo'lishini ta'minlash uchun 0..23 soatlar hamda `[0, 15, 30, 45]` minutlaridan iborat diskret tanlov matritsasi va `padStart` dinamik taymer konstruktori shakllantirilgan.

---

### 11. Lesson Room Availability & Overlap Conflict Detection Engine
- **Loyiha:** `crm_backend`
- **Fayl va Qatorlar:** [`src/modules/lessons/lessons.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/modules/lessons/lessons.service.ts#L36-L61) (L36–L61)
- **Noodatiy Jihati:**
  Dars xonasiga yangi jadval qo'shishda vaqt intervallari to'qnashishini (overlap collision) `startDate <= endDate` va `endDate >= startDate` Prisma ORM sharti orqali aniqlab, agar xona band bo'lsa to'qnash kelgan aniq vaqt oralig'i bilan exception beruvchi algoritm.

---

### 12. Bulk Attendance Pre-Filtering & Deduplication Engine (`Set` + `createMany`)
- **Loyiha:** `crm_backend`
- **Fayl va Qatorlar:** [`src/modules/attendentionals/attendentionals.service.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/crm_backend/src/modules/attendentionals/attendentionals.service.ts#L60-L88) (L60–L88)
- **Noodatiy Jihati:**
  Sinf davomatini ommaviy saqlashda JS `Set` ma'lumotlar tuzilmasidan foydalanib bazada allaqachon mavjud o'quvchilarni $O(N)$ chiziqli vaqt oralig'ida filtrlash va faqat yangilarini `createMany({ skipDuplicates: true })` orqali bitta batch so'rovida yozish.

---

### 13. Debounced Typing Throttle Algorithm
- **Loyiha:** `telegram_app_front_end`
- **Fayl va Qatorlar:** [`src/components/center/SendMessage.tsx`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_front_end/src/components/center/SendMessage.tsx#L24-L46) (L24–L46)
- **Noodatiy Jihati:**
  Chatda matn yozilayotganda socket eventlari toshib ketishining oldini olish uchun React render sikliga ta'sir qilmaydigan `useRef` + `setTimeout` birikmasida tayyorlangan state-less network throttle latch-barrier algoritmi.

---

### 14. Path-Based Dynamic Multi-Token Authorization Guard
- **Loyiha:** `telegram_app_backend`
- **Fayl va Qatorlar:** [`src/global/guards/jwt.auth.guard.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/telegram_app_backend/src/global/guards/jwt.auth.guard.ts#L35-L83) (L35–L83)
- **Noodatiy Jihati:**
  Alohida Guard va Strategy-lar yozib o'tirmasdan, URL path oxirgi segmentiga (`reset-token`, `verification`) qarab, bitta Guard ichida dynamic cookie router yordamida Access, Refresh va Session tokenlarini mos verify qiluvchi unifikatsiyalangan tutqich.

---

### 15. Dynamic HTTP Action-Based Granular Permission System
- **Loyiha:** `online-courses`
- **Fayl va Qatorlar:** [`prisma/schema.prisma`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/online-courses/prisma/schema.prisma#L17-L23) (L17–L23, L77–L89) hamda [`src/modules/Xafvsizlik_Boshqaruvi/admin/dto/create-permission.dto.ts`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/online-courses/src/modules/Xafvsizlik_Boshqaruvi/admin/dto/create-permission.dto.ts#L6-L28) (L6–L28)
- **Noodatiy Jihati:**
  Oddiy rollar (RBAC) o'rniga har bir model (`model`) bo'yicha foydalanuvchiga aynan qaysi HTTP metodlarini (`GET`, `POST`, `PUT`, `PATCH`, `DELETE`) bajarish mumkinligini MongoDB enum array va `@IsEnum(Action, { each: true })` DTO validatsiyasi orqali boshqarish.

---

## C. QISQA STATISTIKA VA KATEGORIYALAR TAHLILI

### 1. FULLDEEP Hisobotlari Bo'yicha Noodatiy Yechimlar Taqsimoti

11 ta loyihaning faylma-fayl chuqur tahlili natijasida jami **101 ta** dasturchi tomonidan yozilgan noodatiy, custom va arxitekturaviy yechimlar aniqlandi:

| Loyiha Nomi | FULLDEEP Hisobot Fayli | Topilgan Noodatiy Yechimlar Soni |
|---|---|---|
| `Admin-panel` | `reports_agy/fulldeep_01_admin_panel.md` | 7 ta |
| `StudentSYStemMenegment` | `reports_agy/fulldeep_02_student_sys.md` | 8 ta |
| `6_oy_imtihon` | `reports_agy/fulldeep_03_c_web_template.md` | 5 ta |
| `mini-erp` | `reports_agy/fulldeep_04_mini_erp.md` | 9 ta |
| `e-commerce` (frontend) | `reports_agy/fulldeep_05_ecommerce_frontend.md` | 12 ta |
| `e-commerce-backend` | `reports_agy/fulldeep_06_ecommerce_backend.md` | 9 ta |
| `crm_frontend` | `reports_agy/fulldeep_07_crm_frontend.md` | 12 ta |
| `crm_backend` | `reports_agy/fulldeep_08_crm_backend.md` | 10 ta |
| `telegram_app_front_end` | `reports_agy/fulldeep_09_telegram_frontend.md` | 9 ta |
| `telegram_app_backend` | `reports_agy/fulldeep_10_telegram_backend.md` | 10 ta |
| `online-courses` | `reports_agy/fulldeep_11_online_courses.md` | 10 ta |
| **JAMI** | **11 ta FULLDEEP Hisobot** | **101 ta** |

---

### 2. Texnik Kategoriyalar Kesimida Uchrash Chastotasi

101 ta noodatiy yechim texnik yo'nalishlar bo'yicha quyidagicha guruhlandi:

```
┌─────────────────────────────────────────────────────────┬──────────┬───────────┐
│ Kategoriya Nomlanishi                                   │ Soni     │ Ulushi    │
├─────────────────────────────────────────────────────────┼──────────┼───────────┤
│ 1. Validatsiya va Ma'lumotlarni Sanitizatsiyalash       │ 18 ta    │ 17.8%     │
│ 2. Keshlashtirish, Xotira va Resurslarni Boshqarish     │ 16 ta    │ 15.8%     │
│ 3. Autentifikatsiya, Avtorizatsiya va Xavfsizlik        │ 15 ta    │ 14.9%     │
│ 4. Real-Time WebSockets, Network & Streaming            │ 14 ta    │ 13.9%     │
│ 5. Fayl Tizimi, Disk Cleanup va Media Ishlov Berish     │ 14 ta    │ 13.9%     │
│ 6. Custom UI Render, State & Router Dvigatellari        │ 13 ta    │ 12.9%     │
│ 7. ORM Abstraksiyalari va Baza Mantiqlari               │ 11 ta    │ 10.9%     │
├─────────────────────────────────────────────────────────┼──────────┼───────────┤
│ JAMI                                                    │ 101 ta   │ 100.0%    │
└─────────────────────────────────────────────────────────┴──────────┴───────────┘
```

---

## YAKUNIY XULOSA

Sintez natijalari shuni ko'rsatadiki, Fayzillo Ummatovning dasturlash uslubi shunchaki freymvorklarning tayyor boilerplate kodlarini ko'chirishdan iborat emas. U har bir loyihada duch kelingan texnik muammolarni hal qilish uchun **xususiy matematik algoritmlar, past darajali OS/Stream integratsiyalari, in-memory kesh dvigatellari hamda resurslarni tejaydigan xususiy arxitekturaviy patternlar** yaratishga harakat qilgan.
