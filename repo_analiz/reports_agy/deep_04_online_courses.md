# CHUQUR TAHLIL: online-courses Loyihasi va Custom Model Logikalari

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `online-courses`  
**Dasturchi Yozgan Source Code:** `prisma/schema.prisma`, `src/app.module.ts`, `src/modules/`

---

## 1. DASTURCHINING UNIKAL SCHEMA VA PRISMA MODEL LOGIKASI

### 1.1. Dynamic Granular Permission System (`model Permission`)
* **Source Code:** `prisma/schema.prisma` (Lines 17-23, 77-89)
* **Koddagi Yechim:**
  Dasturchi oddiy role-based auth (RBAC) o'rniga, har bir foydalanuvchi va model uchun dinamik action huquqlarini (Granular Permission) beruvchi model yaratgan:
  ```prisma
  enum Action {
    GET
    POST
    PUT
    PATCH
    DELETE
  }

  model Permission {
    id      String   @id @default(auto()) @map("_id") @db.ObjectId
    model   String
    actions Action[]

    userId  String   @db.ObjectId
    user    User     @relation(fields: [userId], references: [id])
  }
  ```
* **Mexanizm:** `Permission` modeli orqali ma'lum bir `model` (masalan, `Course`, `Lesson`) ustida qaysi HTTP Action (`GET`, `POST`, `DELETE`) lar bajarilishiga ruxsat berilganini massiv (`actions Action[]`) ko'rinishida dinamik boshqaradi.

### 1.2. Education Domain Enums & Complex Course State Relations
* **Source Code:** `prisma/schema.prisma` (Lines 25-50, 52-75)
* **Koddagi Yechim:**
  Kurs darajalari (`BEGINNER` dan `ADVANCED` gacha), To'lov Usullari (`PAYME`, `CLICK`, `CASH`), Imtihon javoblari (`A, B, C, D`) va Uyga vazifa holatlari (`PENDING`, `APPROVED`, `REJECTED`) uchun alohida `enum` tiplari joriy qilingan.

---

## 2. CALL CHAIN VA ARCHITECTURE BOG'LIQLIGI

```text
User Request
  ↓
NestJS PermissionGuard (Check User Permission)
  ↓
Prisma Permission Query (Find Permission by userId & model)
  ↓
Check if Action (GET/POST) is in actions Array
  ↓
Controller Execution
```

---

## 3. XULOSA
5-oy `online-courses` loyihasida dasturchi ta'lim sohasi uchun dinamik `Permission` modelini (Action-based granular permissions) Prisma schema darajasida mukammal arxitektura qilgan.
