# CHUQUR TAHLIL: StudentSYStemMenegment Loyihasi va Custom Algoritmlar

**Sana:** 2026-yil 3-avgust  
**Loyiha Nomi:** `StudentSYStemMenegment`  
**Dasturchi Yozgan Source Code:** `src/servise/servise.js`, `src/script/studentsController.js`, `src/database/fileHelper.js`

---

## 1. DASTURCHINING UNIKAL KOD LOGIKASI VA ALGORITMLARI

### 1.1. Schema-Driven Custom Input Validation Algorithm (`isvalid`)
* **Source Code:** `src/servise/servise.js` (Lines 8-25)
* **Koddagi Yechim:**
  Dasturchi `Joi` yoki `class-validator` ishlatmasdan, namunaviy schema obyekti (`sxema`) asosida kelayotgan JSON request body kalitlarini va tiplarini dinamik tekshirgan:
  ```javascript
  let sxema = { id: 1, firstName: "Ali", lastName: "Valiyev", course: 2, faculty: "IT" };

  function isvalid(data) {
      let keys = [...Object.keys(sxema)];
      for(let key in data) {
          if(!keys.includes(key)) return false;
          if(key == 'course' && (isNaN(+data[key]) || (+data[key] > 4 || +data[key] < 1))) return false;
          if((key == 'firstName' || key == 'lastName') && (!/^[a-zA-Z]+$/.test(data[key].trim()) || data[key].length < 3 || data[key] > 30)) return false;
          if(key == 'faculty' && (typeof data[key] !== 'string' || data[key].length < 2)) return false;
      }
      return true;
  }
  ```
* **Mexanizm:** `Object.keys()` orqali ruxsat berilgan kalitlar ro'yxati olinadi. Har bir maydon uchun maxsus regEx va mantiqiy chegaralar tekshiriladi.

### 1.2. JSON DB Auto-Increment Primary Key Generator (`Io.readFile().reduce`)
* **Source Code:** `src/servise/servise.js` (Line 60)
* **Koddagi Yechim:**
  ```javascript
  data.id = Io.readFile().reduce((max, student) => max < student.id ? student.id : max, 0) + 1;
  ```
* **Mexanizm:** `Array.prototype.reduce` funksiyasi yordamida JSON faylidagi eng yuqori `id` qiymati aniqlanadi va yangi obyektga `max + 1` beriladi.

### 1.3. Polymorphic Sort Engine (`sortByKey`)
* **Source Code:** `src/servise/servise.js` (Lines 137-146)
* **Koddagi Yechim:**
  Dasturchi ma'lumot turiga qarab saralash algoritmini avtomatik almashtiradi:
  ```javascript
  if(key == 'course'){
      let students = data.sort((a, b) => a[key] - b[key]); // Numeric sort
      return res.status(200).send(students);
  } else {
      let students = data.sort((a, b) => a[key].localeCompare(b[key])); // String locale sort
      return res.status(200).send(students);
  }
  ```

---

## 2. CALL CHAIN VA BOG'LIQLIK

```text
HTTP Request (GET/POST/PUT/DELETE)
  ↓
src/roter/routers.js
  ↓
src/script/studentsController.js (Student.getAll / Student.createStudent)
  ↓
src/servise/servise.js (isvalid() validation & sortByKey())
  ↓
src/database/fileHelper.js (Io.readFile() / Io.writeFile())
  ↓
database.json (Fayl-asosli saqlash)
```

---

## 3. XULOSA
2-oyning ikkinchi haftasida dasturchi kutilmagan tashqi kutubxonalarga qaram bo'lmasdan, Javascript array metodlari (`reduce`, `localeCompare`, `sort`, `filter`) va Schema validation yordamida to'liq ishonchli backend logikasini barpo etgan.
