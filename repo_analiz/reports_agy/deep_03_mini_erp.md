# CHUQUR TAHLIL: mini-erp Loyihasi va Custom Logikalar

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `mini-erp`  
**Dasturchi Yozgan Source Code:** `src/services/user.service.js`, `src/utils/eroors/`, `src/controllers/user.controller.js`

---

## 1. DASTURCHINING UNIKAL KOD LOGIKASI VA ALGORITMLARI

### 1.1. Custom Error Hierarchy & Validation Assertion Engine
* **Source Code:** `src/services/user.service.js` (Lines 10-24)
* **Koddagi Yechim:**
  Dasturchi MongoDB ObjectId va User mavjudligini tasdiqlash uchun maxsus assertion funksiyalar va Custom Error sinflaridan foydalangan:
  ```javascript
  function checkId(id) {
      if (isValidObjectId(id)) {
          return true;
      } else {
          throw new CustomError(400, "Invalid _id !");
      }
  }

  async function checkExists(id) {
      const user = await userModel.findById(id);
      if (!user) {
          throw new CustomError(404, "User not found !");
      }
      return user;
  }
  ```
* **Mexanizm:** Mongoose `isValidObjectId` va `findById` bilan tekshirib, xato holatda HTTP Status Kodlarini (400, 404, 401) tashlaydi.

### 1.2. Synchronous Disk File Cleanup Algorithm (`removeImg`)
* **Source Code:** `src/services/user.service.js` (Lines 26-38)
* **Koddagi Yechim:**
  Foydalanuvchi ma'lumotlar bazasidan o'chirilganda diska profil rasmi chirib yetim qolmasligi uchun fayl tozalash algoritmi:
  ```javascript
  function removeImg(user) {
      if (!user.profile_img) return;

      const imagePath = getPath(user.profile_img);
      try {
          if (fs.existsSync(imagePath)) {
              fs.unlinkSync(imagePath);
              console.log("Rasm o‘chirildi:", imagePath);
          }
      } catch (err) {
          console.error("Rasmni o‘chirishda xatolik:", err.message);
      }
  }
  ```

### 1.3. Time-Stamped Unique File Collision Prevention Scheme
* **Source Code:** `src/services/user.service.js` (Line 49)
* **Koddagi Yechim:**
  ```javascript
  body.profile_img = new Date().getTime() + 1 + "_" + file.name;
  ```
* **Mexanizm:** Bir xil nomli fayllar yuklanganda bir-birini bosib ketmasligi uchun `Timestamp + '_' + File.name` unikallik schemasi.

---

## 2. CALL CHAIN VA BOG'LIQLIK

```text
HTTP DELETE /api/users
  ↓
UserController.deleteUser(req, res, next)
  ↓
UserService.deleteItem(body)
  ↓
checkId(id) → checkExists(id) → removeImg(user) → findByIdAndDelete(id)
  ↓
fs.unlinkSync(imagePath) (Fayl diskdan tozalanishi)
```

---

## 3. XULOSA
3-oy `mini-erp` loyihasida dasturchi faqat DB boti bilan cheklanmay, fayl tizimi havfsizligi (`fs.unlinkSync`), custom HTTP error heroiyalar hamda unikal fayl nomi generatsiya mantiqlarini mukammal qo'llagan.
