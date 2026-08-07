# `6_oy_imtihon` Loyihasi Bo'yicha Chuqur va Noodatiy Yechimlar Tahlili (FULLDEEP-03)

**Sana:** 2026-08-03  
**Qamrab olingan fayllar soni:** 11 ta manba fayl (`package.json`, `src/home.c`, `src/frame.c`, `src/services.c`, `src/system.c`, `src/biz_haqimizda.c`, `src/css/input.css`, `src/css/output.css`, `src/script/index.js`, `src/script/list.js`, `src/script/modal.js`)

---

### 1-NOODATIY YECHIM: HTML Hujjatlarini C Source Fayl Kengaytmasi (`.c`) Sifatida Saqlash Arxitekturasi

#### FACT
- Fayl: `src/home.c` (L1-L12), `src/frame.c` (L1-L12), `src/services.c` (L1-L12), `src/system.c` (L1-L13), `src/biz_haqimizda.c` (L1-L12)
- Kod parchasi:
```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>FAYZILLO_UMMATOV_IMTIHON</title>
    <link rel="stylesheet" href="./css/output.css">
</head>
<body class="w-full mx-auto h-auto bg-gradient-to-r from-[#0d0d0db2] via-[#1a1a1a59] to-[#835b8386]">
```

#### OBSERVATION
Dasturchi HTML5 standarti bo'yicha veb-sahifalarga `.html` kengaytmasini berish o'rniga, ularni C dasturlash tili fayllari kabi `.c` kengaytmasi bilan saqlagan (`home.c`, `frame.c`, `services.c`, `system.c`, `biz_haqimizda.c`). Lekin ushbu fayllar ichida C kodi emas, to'liq HTML markup, Tailwind CSS sinflari va FontAwesome ulanmalari mavjud.

#### NEGA ODATIY EMAS
Standart veb-dasturlash andozalarida barcha statik va dinamik markup fayllari `.html`, `.jsx`, `.tsx`, `.ejs` yoki `.pug` kengaytmalarida yaratiladi. Veb-sahifalarni `.c` kengaytmasi bilan nomlash freymvork va brauzer standartlaridan chetga chiqqan o'ziga xos va noyob fayl nomlash yondashuvidir.

---

### 2-NOODATIY YECHIM: Adaptivlik (Responsive) uchun `@media` Queries o'rniga Alohida Static `.c` (HTML) Layout Fayllarini Yaratish

#### FACT
- Fayl: `src/home.c` (L12, L17: Desktop layout `w-full`, `w-[1240px]`) hamda `src/system.c` (L12-L13, L35: Mobile layout `w-[374px]`, `w-[349px]`), `src/frame.c` (L11-L12: Mobile layout variant 2)
- Kod parchasi (`src/system.c` L12-L13, L35):
```html
<body class="w-[374px] mx-auto h-auto bg-gradient-to-r from-[#0d0d0db2] via-[#1a1a1a59] to-[#835b8386] overflow-x-hidden">
...
<div id="description" class="w-[349px] flex h-auto justify-between items-end !pl-[15px] mt-[35px]">
```

#### OBSERVATION
Moslashuvchan (responsive) interfeys yaratishda CSS media queries (`@media`) yoki Tailwind CSS responsive break-point prefixlari (`md:`, `lg:`) orqali bitta sahifani barcha ekran o'lchamlari uchun moslashtirish o'rniga, dasturchi mobil ekran o'lchamlari uchun qat'iy piksellarga ega (`374px`, `349px`) alohida `system.c` va `frame.c` layout fayllarini noldan yozib chiqqan.

#### NEGA ODATIY EMAS
Odatiy va standart yondashuv bitta HTML sahifasini CSS flexbox, grid va media so'rovlari orqali har xil o'lchamlarga moslashtirishni talab qiladi. Dasturchining har bir qurilma (Desktop vs Mobile) uchun alohida statik HTML/layout strukturasi yaratishi va ularni alohida sahifa sifatida saqlashi noan'anaviy frontend yechimdir.

---

### 3-NOODATIY YECHIM: `@tailwindcss/cli` v4 Standart Custom Build Script va Gibrid `@apply` / Vanilla CSS Deklaratsiyasi

#### FACT
- Fayl: `package.json` (L8), `src/css/input.css` (L41-L47, L82-L94)
- Kod parchasi:
```json
"g:css": "npx @tailwindcss/cli -i ./src/css/input.css -o ./src/css/output.css --watch"
```
```css
.card {
    @apply relative w-full border-2 h-[509px] p-8 flex flex-col items-start justify-between
}

.btn-group {
    height: 42px;
    opacity: 1;
    display: flex;
    align-items: center;
    gap: 5px;
    background-color: blue;
    border-radius: 50px;
    padding-top: 10px;
    padding-right: 15px;
    padding-bottom: 10px;
    padding-left: 15px;
}
```

#### OBSERVATION
Dasturchi Tailwind CSS v4 vositalaridan foydalangan holda maxsus `"g:css"` watch-scriptini sozlagan. HTML inline utility CSS sinflaridan foydalanish o'rniga, u CSS fayli ichida `@apply` direktivasi orqali tayyor component sinflarini `.card` yaratgan, hamda `.btn-group` kabi tugmalar uchun bitta CSS faylning o'zida ham Tailwind `@apply`, ham toza Vanilla CSS xossalarini gibrid ravishda birga yozgan.

#### NEGA ODATIY EMAS
Odatda Tailwind v4 loyihalarida Vite/PostCSS plaginlari yoki HTML teglarida inline utility sinflar qo'llaniladi. CLI vositasi bilan alohida custom script yaratib, Tailwind CSS direktivalari hamda toza Vanilla CSS bloklarini bitta component faylida aralashtirib boshqarish standart boilerplate'lardan ajralib turadi.

---

### 4-NOODATIY YECHIM: JS Slider Kutubxonalarisiz Sun'iy Ultra-Keng Konteyner va `overflow-x-scroll` Orqali Gorizontal Slayder Yaratish

#### FACT
- Fayl: `src/biz_haqimizda.c` (L59-L82), `src/css/input.css` (L41-L47)
- Kod parchasi:
```html
<div class="w-[5000px] mx-auto overflow-hidden">
    <div class="flex gap-14 h-[500px] w-auto gap-x-4">
        <div class="bg-[url('../img/cards/card_1.png')] w-[1240px] h-[375px] mt-6 bg-cover bg-center"></div>
        ...
    </div>
</div>
```

#### OBSERVATION
Rasm va kartochkalar galereyasini gorizontal slayd qilish uchun JavaScript (Swiper.js, Slick Slider) va murakkab scroll-event mantiqlaridan foydalanilmagan. Buning o'rniga konteyner kengligi statik ravishda juda katta piksellarga (`5000px`, `2220px`) oshirilgan va `overflow-hidden`/`overflow-x-scroll` berish orqali JS-siz sodda gorizontal lenta hosil qilingan.

#### NEGA ODATIY EMAS
Zamonaviy veb-dasturlashda karusel yoki galereyalar dinamik JS kutubxonalari yoki CSS scroll-snap va CSS grid layoutlari orqali quriladi. Ekran o'lchamidan 4 baravar katta bo'lgan static `5000px` ultra-wide konteyner yaratish va rasmlarni CSS `bg-[url(...)]` bilan `1240px` o'lchamda berish o'ziga xos layout usulidir.

---

### 5-NOODATIY YECHIM: Dinamik DOM Yaratish Scriptini Layout Prototipi Sifatida Izohda (Comment) Saqlash

#### FACT
- Fayl: `src/script/index.js` (L1-L11)
- Kod parchasi:
```javascript
// const porfolioBox = document.getElementById("portfolio")

// for (let card = 0; card < 6; card++) {
//     const div = document.createElement("div")
//     const img = document.createElement("img")
//     div.classList.add("w-full", "h-[326px]", "rounded-3xl", "overflow-hidden")
//     img.src = `./img/cards/card_${card + 1}.png`
//     img.classList.add("block", "object-content", "h-[415px]", "rounded-3xl", "w-[617px]")
//     div.appendChild(img)
//     porfolioBox.appendChild(div)
// }
```

#### OBSERVATION
`index.js` faylida portfolio kartochkalarini `document.createElement` va `for` tsikli yordamida dinamik generatsiya qiluvchi kod yozilgan va o'chirib tashlanmasdan to'liq izohga olingan. Buning o'rniga HTML sahifalarda kartochkalar statik ravishda joylashtirilgan.

#### NEGA ODATIY EMAS
Ishlab chiqarish (production) koding andozalarida foydalanilmaydigan kodlar tozalanadi. Dasturchi esa dinamik JS orqali DOM strukturasini yaratish algoritmini kelgusi moslashtirishlar va arxitektura prototipi uchun moslashtirish manbai sifatida koddagi izoh ko'rinishida saqlab qolgan.

---

### XULOSA

`6_oy_imtihon` loyihasida o'tkazilgan manba fayllarini birma-bir chuqur tahlil qilish natijasida jami **5 ta noodatiy yechim va o'ziga xos arxitektura yondashuvi** aniqlandi.

**Eng diqqatga sazovor 3 ta yechim:**
1. **HTML Fayllarini `.c` Kengaytmasi Bilan Saqlash:** Veb-markup sahifalarini C dasturlash tili kengaytmasida saqlab, uning ichida HTML5 va Tailwind CSS ishlatilishi.
2. **Breakpoint Media Queries o'rniga Alohida Static Layout Fayllari (`system.c`, `frame.c`):** CSS responsive qoidalar o'rniga alohida mobil ekranlar uchun qat'iy o'lchamli HTML/C fayllar yaratilishi.
3. **JS-siz Ultra-Keng Konteyner (`5000px`) Galereyasi:** Slayder kutubxonalarisiz sun'iy ravishda 5000 piksel kenglikdagi konteyner va CSS `bg-[url]` yordamida gorizontal karusel hosil qilingani.
