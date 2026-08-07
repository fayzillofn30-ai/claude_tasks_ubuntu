# CHUQUR TAHLIL: e-commerce & e-commerce-backend Loyihasi

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `e-commerce` (Frontend) va `e-commerce-backend` (Backend)  
**Dasturchi Yozgan Source Code:** `prisma/schema.prisma`, `src/modules/properties/`, `src/modules/additional/`, `src/global/guards/`

---

## 1. DASTURCHINING UNIKAL SCHEMA VA PRISMA MODEL LOGIKASI

### 1.1. Hybrid Dynamic Schema & Relational Extension (`Property` + `Additional` + `features Json`)
* **Source Code:** `prisma/schema.prisma` (Lines 61-120)
* **Koddagi Yechim:**
  Dasturchi ko'chmas mulk va E-Commerce obyektlari uchun ham relatsion jadval (`Additional`), ham no-relatsion dinamik JSON maydon (`features Json?`) kombinatsiyasidan foydalangan:
  ```prisma
  model Property {
      id          String    @id @default(uuid())
      title       String
      price       Int
      discount    Float?    @default(0)
      features    Json?     // Dynamic key-value attributes
      status      SaleType  @default(RENT)
      
      ownerId     String
      owner       User      @relation(fields: [ownerId], references: [id])
      
      additionals Additional[]
      PropertyMedia PropertyMedia[]
      Favorite      Favorite[]
  }
  ```
* **Mexanizm:** Obyektning o'zgarmas atributlari (`price`, `status`, `ownerId`) ustun qilinadi, o'zgaruvchan texnik xususiyatlar esa `features Json?` ichida saqlanadi. Qurilish materiallari, qavatlar va maydon ko'rsatkichlari esa `Additional` relatsion jadvaliga chiqarilgan.

### 1.2. Multi-Provider OAuth Account Schema (`OAuthAccount`)
* **Source Code:** `prisma/schema.prisma` (Lines 46)
* **Koddagi Yechim:** Google va tashqi tarmoqlar orqali tizimga kirish uchun alohida OAuth account ulanishi.

---

## 2. CALL CHAIN VA BOG'LIQLIK

```text
HTTP Request (POST /api/properties)
  ↓
Global JwtAuthGuard (Verify Token & req.user Injection)
  ↓
PropertiesController.create(dto, req.user.id)
  ↓
PropertiesService.create() → Prisma.property.create({ data: { ..., features: dto.features } })
  ↓
Prisma.additional.create() (Relatsiyali ma'lumotlar ulanishi)
```

---

## 3. XULOSA
7-oy Imtihon loyihasida dasturchi ko'chmas mulk va E-Commerce domenlari uchun gibrid PostgreSQL DB strukturasini (Relational SQL + Json BSON attributes) mukammal birlashtirgan.
