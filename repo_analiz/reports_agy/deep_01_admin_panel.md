# CHUQUR TAHLIL: Admin-panel Loyihasi va Noodatiy Yechimlar

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `Admin-panel`  
**Dasturchi Yozgan Source Code:** `appdata/getclass.js`, `main.js`, `appdata/function.js`, `appdata/componenta.js`

---

## 1. DASTURKADA YOZILGAN NOODATIY YECHIMLAR VA ALGORITMLAR

### 1.1. Dynamic Mock User Generator Algorithm (`setDefaultUsers`)
* **Source Code:** `appdata/getclass.js` (Lines 270-287)
* **Koddagi Yechim:**
  Dasturchi 100 ta foydalanuvchi ma'lumotlarini qo'lda yozib o'tirmasdan, matematik formulalar orqali dinamik generatsiya qilgan:
  ```javascript
  ...Array.from({ length: 90 }, (_, i) => {
      const id = i + 11;
      return new User(
        id,
        `User ${id}`,
        `user_${id}`,
        `user${id}@example.com`,
        `password${id}`,
        id % 2 === 0,
        `Role ${id}`,
        {
          posts: id % 3 === 0,
          newsletter: id % 4 === 0,
          personalOffer: id % 5 === 0
        },
        this.getNewDate(`2024-01-${(id % 28 + 1).toString().padStart(2, '0')}`)
      );
  })
  ```
* **Mexanizm:** `Array.from` generatori va qoldiq moduli operatori (`%`) yordamida Boolean va Sana qiymatlarini avtomatik almashtirish.

### 1.2. Pure JS Client-Side Pagination & Slicing Engine (`setPagecount`, `setpage`)
* **Source Code:** `appdata/getclass.js` (Lines 367-396)
* **Koddagi Yechim:**
  Backend bo'lmagan sharoitda LocalStorage dagi foydalanuvchilar massivini 10 tadan bo'lib beruvchi xususiy pagination mexanizmi:
  ```javascript
  page_user = JSON.parse(localStorage.getItem('users')).splice(index * 10, 10);
  document.getElementsByTagName('tbody')[0].innerHTML = '';
  get.getLokalStorage();
  ```
* **Execution Flow:**
  - User tugmaga bosadi (`setpage(event, li)`).
  - Indeks olinadi va LocalStorage `users` massividan `index * 10` dan `10` ta item `splice/slice` qilinadi.
  - DOM `tbody` tozalanib, faqat shu 10 ta user `table.addRow` orqali dinamik quriladi.

### 1.3. Custom DOM Node Construction Engine (`Table.createTr`)
* **Source Code:** `appdata/getclass.js` (Lines 134-185)
* **Koddagi Yechim:** `innerHTML` o'rniga pure DOM elementlarini yaratish va bog'lash helper funksiyalari (`createTd`, `createDiv`, `createButton`).

---

## 2. CALL CHAIN VA COMPONENT BOG'LIQLIKLARI

```text
main.js
  ↓
get.setDefaultUsers()
  ↓
new User(id, name, email...)
  ↓
LocalStorage ('users', 'user_1', 'user_2'...)
  ↓
get.setPagecount() & get.setpage()
  ↓
Table.createTr() → tbody.appendChild(tr)
```

---

## 3. FAYZILLO ISHLASH USLUBI VA SIGNATURE
- Frameworksiz sharoitda ham backend mentalitetida o'ylash (Local DB state, Pagination logic, Mock Generators).
- ES6+ Classes va Private properties (`#`) orqali xavfsiz va inkapsulyatsiyalangan kod yozish.
