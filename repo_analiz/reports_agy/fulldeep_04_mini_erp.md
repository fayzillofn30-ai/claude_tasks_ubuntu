# FULLDEEP-04: mini-erp Loyihasidagi Noodatiy va Custom Yechimlar Tahlili

> **Sana:** 2026-08-03  
> **Qamrab olingan fayllar soni:** 34 ta source/util/config fayli  
> **Loyiha yo'li:** `/home/fayzillo/Desktop/testing/claude_tasks/repo_analiz/repos/mini-erp/`

Ushbu hujjatda `mini-erp` loyihasidagi standart andozalar (boilerplate CRUD, oddiy routing va standart kutubxona ishlatilishlari) atlab o'tilib, faqat dasturchi (Fayzillo) tomonidan yozilgan noodatiy yechimlar, custom algoritmlar va o'ziga xos biznes mantiqlari hujjatlashtirildi.

---

#### FACT
- Fayl: `src/utils/resurs/modelComponentes/userComponentes.js` (L7-L51)
- Kod parchasi:
```javascript
const isKabisa = (year) => {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    if (year % 4 === 0) return true;
    return false;
};

export const birthdayTest = (birthDay) => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDay)) {
        throw new CustomError(400, "Tug'ilgan sana formati yyyy-mm-dd bo'lishi kerak");
    }

    const [y, m, d] = birthDay.split("-").map(Number);

    if ([y, m, d].includes(NaN)) {
        throw new CustomError(400, "Tug'ilgan sana noto'g'ri kiritilgan");
    }

    if (y < 1900 || y > new Date().getFullYear()) {
        throw new CustomError(400, "Tug'ilgan yil 1900 yildan katta va hozirgi yildan kichik bo'lishi kerak");
    }

    if (m < 1 || m > 12) {
        throw new CustomError(400, "Tug'ilgan oy 1 dan 12 gacha bo'lishi kerak");
    }

    const oyKunlari = [31, (isKabisa(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d < 1 || d > oyKunlari[m - 1]) {
        throw new CustomError(400, `Tug'ilgan kun ${m}-oy uchun 1 dan ${oyKunlari[m - 1]} gacha bo'lishi kerak`);
    }

    const birthdayDate = new Date(`${y}-${m}-${d}`);
    const today = new Date();
    if (birthdayDate > today) {
        throw new CustomError(400, "Tug'ilgan sana kelajakda bo'lishi mumkin emas");
    }

    return true;
};
```
#### OBSERVATION
- Dasturchi tashqi sana kutubxonalariga tayanmasdan, kabisa yillarini (`year % 400 === 0`, `year % 100 === 0`, `year % 4 === 0`) hisoblaydigan maxsus matematik algoritm yaratgan. Shuningdek, 12 oy uchun kunlar chegarasini (`oyKunlari`) kabisa holatiga ko'ra dinamik aniqlaydi va kiritilgan sana formati, 1900-yil pastki va hozirgi yil yuqori chegaralari hamda kelajak sana emasligini ketma-ketlikda custom `CustomError` bilan validator sifatida ishlatadi.
#### NEGA ODATIY EMAS
- Odatiy Node.js va Express loyihalarida tug'ilgan kun validatsiyasi uchun Joi date (`Joi.date()`), `moment.js` yoki `dayjs` kabi tayyor kutubxonalar chaqiriladi. Bu yechimda esa tashqi bog'liqliklardan foydalanilmasdan, sof JavaScript matematik mantiq va kabisa yili formulalari asosida noldan xususiy validatsiya mexanizmi (custom validation engine) yozilgan.

---

#### FACT
- Fayl: `src/utils/validators/auth.validator.js` (L23-L46)
- Kod parchasi:
```javascript
static async permissionValidation(req, res, next) {
    try {
        let {id} = req.userData
        const user = await userModel.findById(id)
        if (!user) {
            throw new CustomError(404, "User not found !")
        }

        const collection = req.url.split("/").at(-1)
        const permissions = await permissionModel.findOne({
            user_id: user._id,
            model: collection,
            branch_id: req.body.branch_id
        })

        if (!permissions) throw new AuthorizationError(406, "User permission not found !")
        if (!permissions.actions.includes(req.method)) {
            throw new AuthorizationError(406, `${user.first_name} ${collection} ${req.method} not allowed !`)
        }
        next()
    } catch (error) {
        next(error)
    }
}
```
#### OBSERVATION
- So'rov yuborilganda `req.url.split("/").at(-1)` yordamida HTTP URL oxirgi segmenti olinadi va u DB `collection` (model) nomi sifatida ishlatiladi. So'ng ma'lumotlar bazasidan `permissionModel` orqali muayyan `user_id`, `branch_id` va `model` mosligida ruxsatlar hujjati qidiriladi. Hujjat ichidagi `actions` massivida so'rovning HTTP metodi (`POST`, `GET`, `PUT`, `DELETE`, `PETCH`) mavjudligi tekshiriladi va ruxsat berilmagan bo'lsa, 406 kodi va foydalanuvchi ismi ko'rsatilgan maxsus `AuthorizationError` chaqiriladi.
#### NEGA ODATIY EMAS
- Standart tizimlarda RBAC (Role-Based Access Control) foydalanuvchi roliga (`req.user.role === 'admin'`) asoslanadi. Bu yondashuvda esa HTTP metodlari (`POST`, `GET`, `PUT`, `DELETE`), filial ID va URL request segmenti ma'lumotlar bazasiga dinamik ravishda bog'langan (granulyar DB-driven permission checking).

---

#### FACT
- Fayl: `src/utils/validators/user.validator.js` (L14-L24, L51-L64)
- Kod parchasi:
```javascript
export function isDate(value, helpers) {
    try {
        if (birthdayTest(value)) {
            return value
        } else {
            throw new Error("Invalid birthday !")
        }
    } catch (error) {
        return helpers(error.message)
    }
}

// updateValidation ichida:
password: Joi.string().min(8).max(32),
r_password: Joi.any()
    .when('password', {
        is: Joi.exist(),
        then: Joi.required().messages({
            'any.required': 'Tasdiq password bo\'lishi shart!'
        }),
        otherwise: Joi.optional()
    })
    .valid(Joi.ref('password'))
    .messages({
        'any.only': 'Tasdiq password noto\'g\'ri!'
    })
```
#### OBSERVATION
- Joi validatsiyasida ikkita unikal mexanizm biriktirilgan: birinchidan, custom `isDate` funksiyasi orqali Joi zanjiriga noldan yozilgan kabisa yili hisoblash algoritmi (`birthdayTest`) adapter sifatida integratsiya qilingan; ikkinchidan, `updateValidation` da foydalanuvchi parolini yangilaganda `r_password` uchun `when('password', ...)` va `.valid(Joi.ref('password'))` shartli bog'liqligi va xabarlari belgilangan.
#### NEGA ODATIY EMAS
- Odatda Joi sxemalari tayyor tiplar (`Joi.date()`) bilan ishlaydi. Dasturchi esa o'zi yozgan xususiy matematik validatsiyani Joi `.custom()` ga bog'lagan va foydalanuvchini tahrirlashda shartli parol tasdiqlash (`when` conditional validation) zanjirini qurgan.

---

#### FACT
- Fayl: `src/utils/resurs/email/componentes_.js` (L13-L32)
- Kod parchasi:
```javascript
export const htmlgeneretor = (url, urlrefresh) => `
<div style="background: #f3f4f6; padding: 30px; border-radius: 12px; font-family: Arial, sans-serif; color: #111;">
  <h2 style="color: #1d4ed8;">Assalomu alaykum!</h2>
  <p>Sizga ushbu tugma orqali tasdiq havolasi yuborilmoqda:</p>
  
  <a href="${url}" 
     style="display: inline-block; background-color: #1d4ed8; color: white; padding: 12px 24px; 
            border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s;">
    tasdiqlash
  </a>
  
  <a href="${urlrefresh}" 
     style="display: inline-block; background-color: #1d4ed8; color: white; padding: 12px 24px; 
            border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px; 
            box-shadow: 0 4px 6px rgba(0,0,0,0.1); transition: background-color 0.3s;">
    yangi token olish
  </a>
</div>
`;
```
#### OBSERVATION
- HTML email shabloni generatsiya qilinayotganda bitta xat ichiga 2 ta alohida harakat tugmasi joylashtiriladi: birinchisi foydalanuvchini tasdiqlash (Access token URL), ikkinchisi esa to'g'ridan-to'g'ri yangi token olish (Refresh token URL) tugmasi.
#### NEGA ODATIY EMAS
- Standart authentication arxitekturasida elektron pochtaga faqat 1 ta tasdiqlash havolasi yuboriladi. Email xatining o'zidan turib bir vaqtning o'zida ham verification, ham refresh token olish tugmasini ko'rsatish o'ziga xos va kutilmagan email UX yechimidir.

---

#### FACT
- Fayl: `src/utils/resurs/logreader.js` (L8-L12)
- Kod parchasi:
```javascript
export default function getlog(app) {
    app.use("/logs",express.static(fullpath))
    app.use("/user/logs",express.static(userLog))
    app.use("/server/logs",express.static(serverLog))
}
```
#### OBSERVATION
- Tizim log fayllarini (`logger.txt`, `user.logger.log`, `server.logger.log`) o'qish uchun alohida controller, parser yoki authentication middleware qurmasdan, Express'ning `express.static()` middleware-i orqali to'g'ridan-to'g'ri HTTP yo'llariga (`/logs`, `/user/logs`, `/server/logs`) fayl sifatida joylashtirgan (expose qilgan).
#### NEGA ODATIY EMAS
- Odatda server yoki foydalanuvchi loglari xavfsiz va maxsus log viewer (masalan Kibana, Grafana) yoki auth bilan himoyalangan admin controller-lar orqali uzatiladi. Log fayllarini `express.static` yordamida static resurs kabi ochiq HTTP route-ga ulash eng sodda va noodatiy yechimdir.

---

#### FACT
- Fayl: `src/middlewares/responsehandlers/errorMidllwares.js` (L3-L21)
- Kod parchasi:
```javascript
export default (err, req, res, next) => {
    const stack = err.stack.split("\n")[1]

    if (err.status) {
        logger.info(err.message + "\n" + stack)
        return res.status(err.status).json({
            success: false,
            status: err.status,
            message: err.message
        })
    };
    
    logger.error(err.message + "\n" + stack);
    return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal server error !"
    });
};
```
#### OBSERVATION
- Global error handler middleware kelib tushgan xatolik obyektining `err.stack` satrini `\n` bo'yicha bo'lib, uning atigi 2-elementini (`stack = err.stack.split("\n")[1]`) ya'ni xato ilk bor paydo bo'lgan aniq fayl va qator manzilini ajratib oladi va logga (info yoki error) aynan shu birinchi trace qatorini yozadi.
#### NEGA ODATIY EMAS
- Standart Express xatolarni boshqarishda butun ko'p qatorli `err.stack` to'liqligicha konsolga yoki logga yoziladi. Bu yerda esa dasturchi log fayllar hajmini tejash va ko'rishni osonlashtirish uchun stack-trace stringini parsing qilib, faqat 1-darajali chaqiruv nuqtasini oladi.

---

#### FACT
- Fayl: `src/routes/user.routes.js` (L11-L14) va `src/controllers/user.controller.js` (L6-L45)
- Kod parchasi:
```javascript
// user.routes.js:
user_router.post("/register", registenValidate, UserController.createUser, jwtMIdllwares)
user_router.get("/all",UserController.getAllUsers, responseHadlers)
user_router.post("/login", loginValidate, UserController.signUser, jwtMIdllwares)
user_router.delete("/logout",UserController.deleteUser, responseHadlers )

// user.controller.js:
static async getAllUsers(req, res, next) {
    try {
        req.userData = await UserService.readeUsers()
        next()
    } catch (error) {
        next(error)
    }
}
```
#### OBSERVATION
- Controller-lar (`UserController`) mijozga `res.json()` orqali javob yubormaydi. Ular faqat service-dan olingan ma'lumotni `req.userData` ga yuklab, `next()` chaqiradi. Javob esa route zanjiri so'ngida turgan universal middleware-lar (`jwtMIdllwares` yoki `responseHadlers`) tomonidan shakllantirilib yuboriladi.
#### NEGA ODATIY EMAS
- Standart Express controller-larida har bir metod o'zi javob statusi va formatini belgilab (`res.status(200).json(...)`) qaytaradi. Bu arxitekturada controller va response generatsiyasi bir-biridan to'liq ajratilgan (middleware-driven decoupled response structure).

---

#### FACT
- Fayl: `src/utils/genretors/generateToken.js` (L12-L17)
- Kod parchasi:
```javascript
export const decodeToken = (token) => {
    const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
    delete decodeUser.iat
    delete decodeUser.exp
    return decodeUser
}
```
#### OBSERVATION
- JWT token verify qilinganida qaytadigan decoded obyektidan `delete decodeUser.iat` va `delete decodeUser.exp` buyruqlari bilan JWT-ning standart `iat` (issued at) va `exp` (expiration time) claim-lari o'chirib tashlanadi va faqat foydalanuvchining asl ma'lumot obyekti qaytariladi.
#### NEGA ODATIY EMAS
- Odatda JWT dekodlanganda `iat` va `exp` maydonlari obyekt tarkibida qoldiriladi yoki foydalanuvchi ma'lumotlari alohida kalit ichida saqlanadi. Obyektning o'zidan `delete` operatori yordamida ushbu kalitlarni tozalab olish o'ziga xos mikro-optimizatsiya yoki custom yondashuvdir.

---

#### FACT
- Fayl: `src/utils/resurs/testFilePath.js` (L4-L11)
- Kod parchasi:
```javascript
export default function getPath(filename) {
    const fullPath = path.join(process.cwd(),"src", "utils","resurs","uploads")
    const filePath = path.join(fullPath,filename)
    if(!fs.existsSync(fullPath)){
        fs.mkdirSync(fullPath,{recursive:true})
    }
    return filePath
}
```
#### OBSERVATION
- Fayl yo'lini aniqlash utiliti (`getPath`) har safar ishga tushganida maqsadli papka (`uploads`) mavjudligini `fs.existsSync` orqali tekshiradi va agar papka bo'lmasa `fs.mkdirSync(fullPath, { recursive: true })` orqali sinxron ravishda papka zanjirini avtomatik yaratib, faylning to'liq manzilini qaytaradi.
#### NEGA ODATIY EMAS
- Fayl yuklash kutubxonalari (masalan multer, express-fileupload) odatda papka allaqachon mavjud bo'lishini kutadi. Har safar fayl manzili so'ralganda diskda papka tayyorligini sinxron tarzda avto-yaratuvchi helper orqali kafolatlash tejamkor va xavfsiz custom yechimdir.

---

## Xulosa

`mini-erp` loyihasini chuqur tahlil qilish natijasida jami **9 ta** diqqatga sazovor noodatiy yechim va custom arxitektura patternlari aniqlandi. Ulardan eng muhim 3 tasi:

1. **Matematik Kabisa Yili va Sana Validatsiyasi Algoritmi** (`src/utils/resurs/modelComponentes/userComponentes.js`): Tashqi sana kutubxonalarisiz sof JS-da kabisa yillari va har bir oyning maksimal kunlarini hisoblaydigan custom validatsiya dvigateli.
2. **Dynamic DB-Driven HTTP Action Authorization** (`src/utils/validators/auth.validator.js`): Dynamic URL segment va Filial (Branch) ID orqali DB-da saqlangan HTTP metodlar (`POST`, `GET`, `PUT`, `DELETE`, `PETCH`) ruxsatlarini tekshiruvchi granulyar avtorizatsiya.
3. **Middleware-Driven Decoupled Controller & Response Architecture** (`src/routes/user.routes.js` va `src/controllers/user.controller.js`): Controller-larni `res.json()` dan xoli qilib, javob qaytarish vazifasini marshrut zanjiri oxiridagi universal middleware-larga yuklash yechimi.
