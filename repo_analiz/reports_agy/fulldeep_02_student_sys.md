# StudentSYStemMenegment — Faylma-fayl Chuqur va Noodatiy Yechimlar Tahlili

- **Sana:** 2026-08-03
- **Qamrab olingan fayllar soni:** 7 ta source va konfiguratsiya fayli (`src/server.js`, `src/roter/routers.js`, `src/script/studentsController.js`, `src/servise/servise.js`, `src/servise/test.js`, `src/database/fileHelper.js`, `package.json`).

---

### 1. Dynamic Auto-Increment Primary Key via Array `.reduce()`

#### FACT
- Fayl: `src/servise/servise.js` (60-qator)
```javascript
data.id = Io.readFile().reduce((max, student) => max < student.id ? student.id : max, 0) + 1
```

#### OBSERVATION
Yangi talaba (student) yozuvi yaratilayotganda, unga unikal identifikator (`id`) berish uchun `students.json` faylidagi barcha talabalarning ID lari `reduce` funksiyasi orqali aylanib chiqiladi va eng katta ID topilib, unga 1 qo'shiladi.

#### NEGA ODATIY EMAS
Standart bo'lmagan yechim. Odatiy holda relational yoki NoSQL ma'lumotlar bazalarida autoincrement ID yoki UUID (`uuid.v4()`, `nanoid()`) ishlatiladi. Oddiy faylli tizimlarda esa ko'pincha `array.length + 1` xavfli usuli qo'llaniladi (bu o'rtadan element o'chirilganda ID larning takrorlanib qolishiga olib keladi). Fayzillo esa tashqi kutubxonalarsiz, massivdagi maksimal ID qiymatini `.reduce()` orqali topish mexanizmini yozib, xavfsiz va aniq ketma-ketlikni ta'minlagan.

---

### 2. Schema Key-Count Guard via Spread Operator

#### FACT
- Fayl: `src/servise/servise.js` (61-qator)
```javascript
if(isvalid(data) && [...Object.keys(sxema)].length == 5) {
```

#### OBSERVATION
`create` metodida `isvalid(data)` tekshiruvidan tashqari, `sxema` obyektining kalitlari soni aynan 5 ta ekanligi `[...Object.keys(sxema)].length == 5` sharti orqali ham nazorat qilinadi.

#### NEGA ODATIY EMAS
Odatda obyekt tuzilishi va kalitlar soni validation helper funksiyasining ichida to'liq hal etiladi yoki Joi/Zod kabi kutubxonalarning `.strict()` usullaridan foydalaniladi. Bu yerda esa schema mosligini tasdiqlash uchun inline tarzda `Object.keys` ni spread operator `[...]` bilan massivga o'girib, uning `length` xossasi aniq 5 ga tengligini controller/service darajasidagi shartga kiritish o'ziga xos yondashuvdir.

---

### 3. Differential State Audit via Dynamic Mutation (`oldata` & `newData`)

#### FACT
- Fayl: `src/servise/servise.js` (74–95-qatorlar)
```javascript
let oldata = {};
let newData = {};
if(isvalid(data) || data.id) {
    let stuidents = Io.readFile().map(student => {
        if(student.id == data.id){
            oldata = student
            newData = {...student,...data}
            return newData
        }
        return student
    });
    Io.writeFile(stuidents)
    if(oldata.id){ 
        return res.status(200).send({
            message:"Student updatetd sucses ! ",
            oldata,
            newData
        });
    }
```

#### OBSERVATION
Ma'lumotlarni update (PUT) qilish jarayonida yangilanishdan oldingi holat (`oldata`) va yangilangan holat (`newData`) massivni `.map()` qilish paytida bir vaqtda tutib qolinadi va HTTP javobida har ikkala holat ham mijozga qaytariladi.

#### NEGA ODATIY EMAS
Boilerplate REST API larda PUT so'roviga faqat yangilangan ob'ekt yoki oddiy status xabar qaytariladi. Ma'lumotning o'zgarishidan oldingi va keyingi holatlarini (`oldata` va `newData`) bitta javobda qaytarish odatda murakkab Audit Logging yoki Event Sourcing tizimlariga xos bo'lib, bu yerda oddiy fayl-bazali service qatlamida realizatsiya qilingan.

---

### 4. Single-Entry Polymorphic Query Dispatcher (`getQuery`)

#### FACT
- Fayl: `src/servise/servise.js` (148–157-qatorlar)
```javascript
getQuery(req, res) {
    let query = req.query;
    let key = Object.keys(query)[0]
    query[key] = (key == 'course') ? +query[key] : query[key]
    if(key !=='sort') {
        this.filterByKey(query, res, key)
    }else{
        this.sortByKey(query[key], res)
    }
}
```

#### OBSERVATION
Kelayotgan URL query-parametrlarining birinchi kalitini `Object.keys(query)[0]` orqali ajratib oladi. Agar bu kalit `'sort'` bo'lmasa, u avtomatik ravishda filterlash funksiyasiga (`filterByKey`), aks holda saralash funksiyasiga (`sortByKey`) yo'naltiradi.

#### NEGA ODATIY EMAS
Standart Express ilovalarida query parametrlar har bir kalit bo'yicha alohida parsing qilinadi (`req.query.sort`, `req.query.course`). Bu yerdagi yechim esa kelgan ixtiyoriy query kalitini birinchi pozitsiyadan dinamik tutib oluvchi va u orqali saralash yoki filterlash tarmog'iga yo'naltiruvchi universal polimorfik dispatcher vazifasini bajaradi.

---

### 5. DataType-Aware Sorting Strategy (`sortByKey`)

#### FACT
- Fayl: `src/servise/servise.js` (137–146-qatorlar)
```javascript
sortByKey(key, res) {
    let data = Io.readFile()
    console.log(key)
    if(key == 'course'){
        let students = data.sort((a, b) => a[key] - b[key])
        return res.status(200).send(students)
    }else{
        let students = data.sort((a, b) => a[key].localeCompare(b[key]))
        return res.status(200).send(students)
    }
}
```

#### OBSERVATION
Talabalarni saralashda ustun turiga qarab algoritmni almashtiradi: agar saralash `'course'` (sonli ustun) bo'yicha bo'lsa, arifmetik `a[key] - b[key]` qo'llaniladi, matnli ustunlar uchun esa `localeCompare` usuli ishlatiladi.

#### NEGA ODATIY EMAS
Aksariyat oddiy loyalty/CRUD loyihalarida saralash uchun oddiy `<` `>` operatorlari yoki ma'lumot turidan qat'i nazar bitta usul ishlatiladi. Dasturchi bu yerda matnli (string) va sonli (number) qiymatlar uchun alohida taqqoslash strategiyasini tanlagan.

---

### 6. Encapsulated Append Storage Operation (`Io.updateFile`)

#### FACT
- Fayl: `src/database/fileHelper.js` (46–55-qatorlar)
```javascript
updateFile (data) {
    try {
        let oldData = this.readFile()
        oldData.push(data)
        this.writeFile(oldData)
        return true
    } catch (error) {
        return false;            
    }
}
```

#### OBSERVATION
`fileHelper.js` ichida faylga yangi obyekt qo'shish jarayoni `updateFile` metodi deb nomlangan. U fayldagi ma'lumotlarni o'qiydi (`readFile`), massiv oxiriga yangi yozuvni qo'shadi (`push`) va faylga qayta yozadi (`writeFile`).

#### NEGA ODATIY EMAS
Odatda "update" nomi mavjud ma'lumotni o'zgartirish (UPDATE) uchun ishlatiladi. Biroq bu yechimda `updateFile` metodi kontseptual jihatdan fayldagi joriy massiv holatini yangilash (APPEND/INSERT) vazifasini bajaradi. O'qish, massivga push qilish va yozish operatsiyasini yagona xavfsiz (try-catch) metod ichiga kapsulalash custom faylli ma'lumotlar bazasi abstraksiyasini yaratgan.

---

### 7. Self-Debugging Controller Introspection (`info` method)

#### FACT
- Fayl: `src/script/studentsController.js` (22–25-qatorlar)
```javascript
info () {
    console.log(this)
    return this
},
```

#### OBSERVATION
Controller obyektining tarkibida `info()` nomli metod joylashtirilgan. U chaqirilganda joriy `Student` obyektining konteksini konsolga chiqaradi va obyektni qaytaradi.

#### NEGA ODATIY EMAS
Express controller obyektlarida ichki holatni va metodlar to'plamini ko'rish (introspection / self-logging) uchun bunday maxsus metodlar deyarli yaratilmaydi. Bu dasturchiga ob'ekt metodlarini va ulanish zanjirini tekshirish uchun xizmat qiladi.

---

### 8. CLI Argument Fallback Port Parser

#### FACT
- Fayl: `src/server.js` (6-qator)
```javascript
const PORT = process.argv.PORT || 3000;
```

#### OBSERVATION
Serverning tinglash portini belgilashda `process.env.PORT` o'rniga `process.argv.PORT` sintaksisi ishlatilgan va u standart 3000 portiga zaxira (fallback) qilingan.

#### NEGA ODATIY EMAS
Node.js muhitida port har doim `process.env.PORT` yoki CLI parse kutubxonalari (yoki `process.argv` massiv indeksi) orqali olinadi. Dasturchining `process.argv.PORT` ko'rinishida obyekt xossasi sifatida murojaat qilishi va default portga tushishi custom tajriba va o'ziga xos izlanish belgisidir.

---

## XULOSA

`StudentSYStemMenegment` loyihasida o'rganilgan 7 ta source va konfiguratsiya fayllari natijasida **8 ta noodatiy, custom va standart bo'lmagan yechimlar hamda algoritmlar** aniqlandi.

### Eng diqqatga sazovor 3 ta yechim:
1. **Dynamic Auto-Increment Primary Key via Array `.reduce()`** (`src/servise/servise.js` L60) — Tashqi bazalarsiz JSON fayl sharoitida eng katta ID ni `reduce` orqali dinamik hisoblab, unikal ID hosil qilish algoritmi.
2. **Differential State Audit via Dynamic Mutation (`oldata` & `newData`)** (`src/servise/servise.js` L74–95) — Ma'lumotlar yangilanganda eski va yangi qiymatlarning ikkalasini bir vaqtda saqlab, javobda diff ko'rinishida qaytarish mexanizmi.
3. **Single-Entry Polymorphic Query Dispatcher (`getQuery`)** (`src/servise/servise.js` L148–157) — URL query parametrlaridan birinchi kalitni dinamik tutib olib, uni filterlash yoki saralash tarmoqlariga avtomatik ajratuvchi dispatcher logic.
