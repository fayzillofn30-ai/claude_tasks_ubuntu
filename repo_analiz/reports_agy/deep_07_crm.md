# CHUQUR TAHLIL: crm_frontend & crm_backend Imtihon Loyihasi

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `crm_backend` (Backend) va `crm_frontend` (Frontend)  
**Dasturchi Yozgan Source Code:** `prisma/schema.prisma`, `src/modules/groupes/`, `src/modules/attendentionals/`, `src/modules/staffs/`

---

## 1. DASTURCHINING UNIKAL SCHEMA VA CRM DOMEN LOGIKALARI

### 1.1. Course Schedule & Room Capacity Management (`model Group` + `model Course` + `model Rom`)
* **Source Code:** `prisma/schema.prisma` (Lines 23-72)
* **Koddagi Yechim:**
  Dasturchi O'quv markazi dars jadvallari va xonalar sig'imini boshqarish uchun unikal relatsion model qurgan:
  ```prisma
  model Course {
    id            String  @id @default(uuid())
    name          String
    price         Int
    durationMont  Int     @default(3)
    weekDays      Int[]   @default([1, 3, 5]) // [1,3,5] -> Du-Chor-Jum
    durationMinut Int
  }

  model Group {
    id        String   @id @default(uuid())
    name      String
    teacherId String
    courseId  String
    romId     String   // Room Foreign Key
    startDate DateTime
    isStart   Boolean  @default(false)
    isEnd     Boolean  @default(false)
  }
  ```
* **Mexanizm:** `weekDays Int[]` massivida dars kunlari (`[1, 3, 5]` yoki `[2, 4, 6]`) saqlanadi. `Rom` jadvalida esa xona o'rinlar soni (`pleaces`) va xonaning ochiqligi (`isOpen`) nazorat qilinadi.

### 1.2. Attendance & Staff Role Model (`model Attendentional` + `model Staff`)
* **Source Code:** `prisma/schema.prisma` (Lines 74-120)
* **Koddagi Yechim:** Har bir talaba va xodim (`ADMIN`, `TEACHER`, `ASSISTANT`, `STUDENT`) uchun darslar va davomat monitoringi (`Attendentional`).

---

## 2. CALL CHAIN VA BOG'LIQLIK

```text
HTTP Request (POST /api/groupes)
  ↓
GroupesController.create(dto)
  ↓
GroupesService.create()
  ↓
Check Room Capacity (`Rom.pleaces`) & Teacher Availability (`Staff.role === 'TEACHER'`)
  ↓
Prisma.group.create({ data: { ..., weekDays: course.weekDays } })
```

---

## 3. XULOSA
8-oy CRM Imtihon loyihasida dasturchi ta'lim markazi biznes jarayonlarini (xonalar sig'imi, haftalik dars kunlari massivi `[1, 3, 5]`, o'qituvchilar va davomat) PostgreSQL va Prisma ORM yordamida to'liqlicha model ko'rinishida arxitektura qilgan.
