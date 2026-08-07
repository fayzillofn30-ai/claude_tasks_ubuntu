# 3-Oy Tahlil Hisoboti: mini-erp Loyihasi

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `mini-erp`  
**O'quv Davri:** 3-oy (May 2025 - 16-kuni)  
**Texnologiyalar:** Node.js, Express.js, Clean Controller-Service Architecture, `dotenv`, Global Error Middleware, `express-fileupload`.

---

## 1. LOYIHA STRUKTURASI VA ARXITEKTURA
Loyihaning Clean Architecture tamoyillariga mos modulli tuzilishi:
- `src/server.js` — Async server startup, DB config ulanishi, Global Error Middleware.
- `src/controllers/user.controller.js` — Class-based Controllers (`static async` metodlar, `try-catch`, `next(error)`).
- `src/services/user.service.js` — ERP domen mantiqini bajaruvchi Service qatlami.
- `src/middlewares/responsehandlers/` — Response formater va Centralized Error Middleware.

---

## 2. KOD SIFATI VA TEXNIK TAHLIL

### ✅ Ijobiy Jihatlar va Yutuqlar:
1. **Centralized Error Handling (Markazlashtirilgan Xatoliklar Boshqaruvi):**  
   Controllerda har bir async metod xatolik yuz berganda `next(error)` orqali xatoni global middleware'ga uzatadi. Kodda keraksiz qayta-qayta `res.status(500)` yozishdan qochilgan (DRY tamoyili).
2. **Pure Service-Controller Decoupling:**  
   Oldingi loyihalardan farqli o'laroq, bu yerda Controller va Service to'liq ajratilgan. Service qatlami `res` obyektiga bog'liq emas:
   ```javascript
   static async createUser(req, res, next) {
       try {
           req.userData = await UserService.writeUser(req.body, req.files.img)
           next()
       } catch (error) {
           next(error) 
       }
   }
   ```
3. **Atrof-muhit Sozlamalari (`dotenv`):**  
   Port va host ma'lumotlari kod ichiga harfma-harf yozilmasdan `process.env.PORT` va `process.env.HOST` orqali xavfsiz boshqarilgan.

---

## 3. XULOSA
3-oyga kelib, dasturchining Express.js arxitekturasi Clean Code (Decoupled Services, Global Error Handling, Async/Await) tamoyillari asosida mukammal shakllangan.
