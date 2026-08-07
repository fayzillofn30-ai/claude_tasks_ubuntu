# Fayzillo — Noodatiy Logikalar, Custom Algoritmlar va Loyiha Qurish Metodologiyasi

> Ushbu hujjat Fayzillo Ummatovning `repos/` ichidagi barcha real manba kodlaridan ajratib olingan **noodatiy yechimlar (Custom Logic), unikal algoritmlar, arxitektura tamoyillari va signature patternlar** bazasidir.

---

## 1. Tahlil va Orkestratsiya Metodologiyasi

- **Orkestratsiya Tizimi:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/orcestor/` (File-based Task Management).
- **Manba Kodlar:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/` (`Admin-panel`, `StudentSYStemMenegment`, `mini-erp`, `online-courses`, `e-commerce-backend`, `crm_backend`, `telegram_app_backend`).
- **Noodatiy Yechimlar Tahlili:** Oddiy nazariya va umumiy ta'riflar chetga surilib, faqat dasturchining o'zi yozgan maxsus algoritmlar, custom schemas, regex generatorlar va call chainlar o'rganildi.

---

## 2. FAYZILLO YOZGAN NOODATIY LOGIKALAR VA CUSTOM ALGORITMLAR

### 2.1. Dynamic Mock User Generator Algorithm (`setDefaultUsers`)
* **Repo / Fayl:** `Admin-panel` (`appdata/getclass.js` L270-L287)
* **Noodatiy Yechim:**
  Dasturchi 100 ta foydalanuvchi ma'lumotlarini o'z qo'li bilan yozib o'tirmasdan, matematik formulalar va `Array.from` generatori orqali dinamik generatsiya qilgan:
  ```javascript
  ...Array.from({ length: 90 }, (_, i) => {
      const id = i + 11;
      return new User(
        id, `User ${id}`, `user_${id}`, `user${id}@example.com`, `password${id}`,
        id % 2 === 0, `Role ${id}`,
        { posts: id % 3 === 0, newsletter: id % 4 === 0, personalOffer: id % 5 === 0 },
        this.getNewDate(`2024-01-${(id % 28 + 1).toString().padStart(2, '0')}`)
      );
  })
  ```
* **Nima uchun qilingan:** Test muhiti va LocalStorage state-ni soniyalar ichida realistic mock ma'lumotlar bilan to'ldirish uchun.

---

### 2.2. Schema-Driven Input Validation Engine (`isvalid`)
* **Repo / Fayl:** `StudentSYStemMenegment` (`src/servise/servise.js` L8-L25)
* **Noodatiy Yechim:**
  Tashqi validation kutubxonalari (Joi, Validator) ishlatmasdan, oddiy JS obyekti (`sxema`) shabloni asosida kiruvchi JSON request body kalitlarini va tiplarini dinamik tekshirgan:
  ```javascript
  let sxema = { id: 1, firstName: "Ali", lastName: "Valiyev", course: 2, faculty: "IT" };

  function isvalid(data) {
      let keys = [...Object.keys(sxema)];
      for(let key in data) {
          if(!keys.includes(key)) return false;
          if(key == 'course' && (isNaN(+data[key]) || +data[key] > 4 || +data[key] < 1)) return false;
          if((key == 'firstName' || key == 'lastName') && (!/^[a-zA-Z]+$/.test(data[key].trim()) || data[key].length < 3)) return false;
      }
      return true;
  }
  ```
* **Nima uchun qilingan:** Tashqi bog'liqliklar (dependencies) siz toza va tejamkor JSON validation mexanizmini yaratish uchun.

---

### 2.3. Dynamic Granular Action-Based Permission Model (`model Permission`)
* **Repo / Fayl:** `online-courses` (`prisma/schema.prisma` L17-23, L77-89)
* **Noodatiy Yechim:**
  Oddiy role-based auth (RBAC) o'rniga, har bir foydalanuvchi va model uchun dinamik HTTP Action (`GET`, `POST`, `PUT`, `DELETE`) huquqlarini beruvchi schema modellash:
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

---

### 2.4. Multi-Device Session Connections & Real-Time Typing Engine
* **Repo / Fayl:** `telegram_app_backend` (`src/soket/soket.gateway.ts` L18-38)
* **Noodatiy Yechim:**
  ```typescript
  handleConnection(client: Socket) {
      const userId = client.handshake.query.userId as string;
      const deviceId = client.handshake.query.deviceId as string;
      this.socketService.addConnection(userId, deviceId, client);

      client.on("typing", (data) => {
          this.socketService.onTypingByUserIdUser(userId, data);
      });
  }
  ```
* **Nima uchun qilingan:** Bitta foydalanuvchining bir nechta qurilmalaridan (Multi-Device) WebSockets ulanishini `handshake.query` orqali dinamik ajratib olish va real vaqtda instant chat holatini efirga uzatish uchun.

---

### 2.5. Synchronous Disk File Cleanup Scheme (`removeImg`)
* **Repo / Fayl:** `mini-erp` (`src/services/user.service.js` L26-38)
* **Noodatiy Yechim:**
  Ma'lumotlar bazasidan foydalanuvchi o'chirilganda, unga tegishli faylni diska chirib yetim qolmasligi uchun `fs.existsSync` va `fs.unlinkSync` orqali sinxron tozalash kodi.

---

## 3. UNIKAL SIGNATURE PATTERNLAR

### 3.1. Centralized Global Initialization (`initGlobalApp` / `setterAppConfigurations`)
- **Fakt:** `e-commerce-backend`, `crm_backend`, `telegram_app_backend`, `online-courses` loyihalarining barchasida `main.ts` fayli atigi 10-14 qatordan iborat.
- **Mexanizm:** `main.ts` `initGlobalApp(app)` (yoki `setterAppConfigurations(app)`) chaqiradi va u `src/core/use_initilation.ts` ichida `GlobalPrefix`, `ValidationPipe`, `cookieParser`, `SwaggerModule` (Dark Theme `SwaggerThemeNameEnum.ONE_DARK`), `DeviceMiddleware` va `GlobalFilters` larni bitta joyda biriktiradi.

---

### 3.2. Ephemeral Container Storage + External Platform-ID File Reference Pattern
- **Tamoyil:** Fayllar (rasm, video va h.k.) hech qachon asosiy loyiha bazasida (DB) bayt-massiv sifatida, hech qachon konteynerning doimiy diskida ham saqlanmaydi — faqat **nomi yoki ID'si** saqlanadi.
- **Mexanizm:** Fayllar uchun alohida, mustaqil server (microservice) ko'tariladi. Bu server kelgan faylni tashqi cloud platformaga yuklaydi va qaytgan `id`ni asosiy loyihaga beradi. Asosiy loyiha bazasida faqat shu `id` saqlanadi. `GET /image` so'ralganda, saqlangan ID asosida `cloudUrl/imageId` ko'rinishidagi to'liq URL dinamik shakllantirilib qaytariladi.
- **Nima uchun qilingan:** Konteynerga (Docker) fayl saqlash har redeploy'da fayllarning o'chib ketishiga olib keladi (ephemeral filesystem muammosi). Fayzillo buni bootcamp/imtihon loyihalari uchun qabul qilinadigan trade-off deb hisoblaydi — maqsad asosiy talablarni bajarish, production darajadagi doimiy saqlashni ta'minlash emas. Bu qaror mantiqan `tasks/07_step_unusual_solutions_synthesis.md`dagi "In-Memory Map-Based Anti-Spam Rate-Limited Expiring Cache Engine" patterniga (Redis o'rniga in-memory `JS Map` bilan kesh yasash) o'xshaydi: murakkab infratuzilma (S3, persistent volume) o'rniga minimal, lekin talabni qondiradigan "yetarli darajada yaxshi" (good-enough) yechim tanlanadi.

---

## 4. CHUQUR TAHLIL HUJJATLARI XARITASI

| Task ID | Loyiha Nomi | Noodatiy Yechim / Diqqat Markazi | Chuqur Hisobot Fayli |
|---|---|---|---|
| `TASK-01` | `Admin-panel` | Dynamic Mock Generator, Client-Side Pagination & Slicing | [`reports_agy/deep_01_admin_panel.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_01_admin_panel.md) |
| `TASK-02` | `StudentSYStemMenegment` | Schema-Driven Custom Input Validation, Auto-Increment PK | [`reports_agy/deep_02_student_sys.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_02_student_sys.md) |
| `TASK-03` | `mini-erp` | Custom Error Hierarchy, Synchronous Disk File Cleanup | [`reports_agy/deep_03_mini_erp.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_03_mini_erp.md) |
| `TASK-04` | `online-courses` | Granular Action-Based Permission Model, Enum Models | [`reports_agy/deep_04_online_courses.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_04_online_courses.md) |
| `TASK-06` | `e-commerce-backend` | Hybrid Dynamic Schema (Relational + JSON BSON features) | [`reports_agy/deep_06_ecommerce.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_06_ecommerce.md) |
| `TASK-07` | `crm_backend` | Course Schedule WeekDays Array `[1,3,5]`, Room Capacity | [`reports_agy/deep_07_crm.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_07_crm.md) |
| `TASK-08` | `telegram_app_backend` | Multi-Device Handshake Extraction & WebSockets Typing | [`reports_agy/deep_08_telegram_app.md`](file:///home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/reports_agy/deep_08_telegram_app.md) |

---

## 5. YAKUN
Fayzillo'ning koding uslubi faqat standart freymvork qoliplaridan iborat emas, balki har bir loyihada u muammoni hal qilish uchun **xususiy algoritmlar, dinamik validation mexanizmlari, gibrid schema modellari hamda resurslarni tejaydigan yechimlar**ni izchil qo'llagan.
