# Loyihalash asoslari (design rationale)

Bu fayl — `agy-ui-analizer` skillining ichki qarorlari nima uchun
aynan shunday qabul qilinganini tushuntiradi. Skill **mustaqil**
(izolyatsiyalangan) bo'lishi uchun bu hujjat tashqi/shaxsiy tadqiqot
papkalariga havola qilmaydi — barcha kerakli kontekst shu yerda,
o'z ichida.

## 1. Nega crawling, config-parsing emas (sahifalar ro'yxati manbasi)

Sahifalar ro'yxatini olishning ikkita usuli sinaldi: (A) framework
routing-config faylini (masalan Angular `app.routes.ts`) statik o'qish,
va (B) ishlab turgan saytni "kezib" (`<a href>` linklarni kuzatib)
sahifalarni topish. Ikkalasi ham bir xil, to'g'ri natija berdi, lekin
(B) tanlandi, chunki:
- **Framework-agnostik** — Angular, React, Vue, oddiy ko'p-sahifali
  HTML — barchasida bir xil ishlaydi, manba kodni tushunish shart emas.
- Ishlab turgan istalgan URL'da ishlaydi (lokal dev-server, hatto
  staging/production), manba kodga kirish huquqi shart emas.
- Bir xil Puppeteer vositasidan foydalanadi (screenshot bilan bitta
  texnologiya) — qo'shimcha framework-maxsus parser kerak emas.

## 2. Nega Gemini javobi to'g'ridan-to'g'ri Executer_Agent'ga uzatilmaydi

Real sinovda, to'liq fix-sikli tekshirilganda, Gemini Vision API'ning
o'zida **soxta-pozitiv** topilgan edi: bir sahifadagi "© 2026" sanasini
"kelajakdagi, mantiqiy xato sana" deb noto'g'ri belgiladi — aslida
modelda joriy sana haqida ma'lumot yo'q, shuning uchun har qanday
"202X" ko'rinishidagi yilni o'zining bilim-chegarasi bilan solishtirib
xato xulosa chiqargan.

**Xulosa**: Gemini'ning matn-javobini hech qachon ko'r-ko'rona "tuzat"
buyrug'iga aylantirib bo'lmaydi. Orcestor (yoki oraliq tekshiruv
qatlami) HAR BIR da'voni filtrlashi shart — ayniqsa sana/vaqt, matn
mazmuni/til sifati, yoki umumiy/taxminiy fikrlar haqidagi da'volarni.
Faqat screenshot'da haqiqatan ko'rinadigan, aniq vizual muammolar
keyingi (fix) bosqichga o'tkaziladi. Shu sabab `templates/prompt.md`da
ham bu cheklovlar ochiq yozilgan (model javob berishdan oldin o'z-o'zini
cheklashi uchun), ham SKILL.md'da qo'shimcha inson/agent-darajasidagi
filtrlash bosqichi bor — ikki qatlamli himoya.

## 3. Nega fix-dispatch tor, aniq matnli prompt bilan qilinadi

Executer_Agent (`agy`) headless (`-p`/print) rejimda ishlaganda,
uni "avval tashxis qo'y, keyin aniq tasdiqdan so'ng tuzat" qoidasiga
rioya qilishga majburlashning **yagona ishonchli** usuli — bevosita
promptning o'ziga aniq, tor doiradagi matnli ko'rsatma yozish (masalan
aniq "TUZAT" so'zi, aniq fayl yo'li, aniq cheklovlar ro'yxati).

Boshqa mexanizmlar (CLI execution-mode flag'lari, loyiha-darajasidagi
qoidalar fayllari) headless rejimda ishonchsiz ekani real testlarda
tasdiqlangan — faqat (a) promptning o'zidagi aniq matn va (b) global,
oldindan o'rnatilgan xatti-harakat qoidalari (`agy-align` orqali)
ishonchli natija berdi. Shu sabab SKILL.md 0-bosqichi `agy-align`
o'rnatilganini MAJBURIY tekshiradi, va 4-bosqichdagi fix-dispatch
prompti qat'iy shablonga ega.

**Qo'shimcha**: fayl-tahrirlash headless rejimda (hech qanday maxsus
flag berilmasa ham) avtomatik amalga oshadi — faqat buyruq/skript ishga
tushirish alohida ruxsat talab qiladi. Shu sabab fix-dispatch bosqichida
`--dangerously-skip-permissions` ISHLATILMAYDI (kerak emas) — faqat
fayl tahrirlash so'raladi, buyruq ishga tushirish so'ralmaydi (eng kam
imtiyoz tamoyili).

## 4. Nega natija hech qachon so'zsiz qabul qilinmaydi ("men shaxsan tekshirdim")

Executer_Agent o'z ishi haqida "tuzatdim", "tekshirdim" deb da'vo
qilishi mumkin, lekin bu da'voning o'zi tasdiq emas. Real sinovda bir
marta noto'g'ri vizual taxmin (ekranga tez qarab "bug yo'q" deb
xulosa chiqarish) keyinchalik DOM-o'lchov bilan tekshirilganda **xato**
chiqqan edi. Shu sabab SKILL.md 5-bosqichi 3 mustaqil tekshiruv usulini
talab qiladi: (1) faylni shaxsan o'qish, (2) sahifani qayta screenshot
qilib solishtirish, (3) muhim/layout xarakteridagi muammolar uchun DOM
geometriyasini (masalan `getBoundingClientRect()`) raqamli tekshirish —
vizual taassurot yolg'iz yetarli emas.

## 5. Nega Python uchun alohida `venv`, tizim Python'iga to'g'ridan-to'g'ri emas

Ko'p zamonaviy Linux distributivlarida (Debian/Ubuntu, PEP 668) tizim
Python'iga `pip install` qilish "externally-managed-environment"
xatoligi beradi. Yechim sifatida `--break-system-packages` flag'i
mavjud, lekin bu tizim Python muhitini buzish xavfini oshiradi. Har bir
`agy-ui-analizer` ishga tushirilgan loyihada alohida `venv` yaratish —
xavfsizroq, qaytariladigan (o'chirib tashlash oson) alternativa.

## 6. Nega crawl/Gemini so'rovlariga aniq limitlar qo'yilgan (`config.env`)

Gemini API'ning real, hujjatlashtirilgan kvotasi (bitta loyihada
sinalgan, standart Free-tier darajasi): ~15 so'rov/daqiqa (RPM), ~1500
so'rov/kun (RPD), ~1,000,000 token/daqiqa (TPM). Ko'p-sahifali crawl +
tahlil bitta ishga tushirishda RPM limitiga tez urilib qolishi mumkin
(masalan 20+ sahifali sayt). Shu sabab `config.env`da:
- `GEMINI_RPM_LIMIT` — haqiqiy limitdan (15) biroz pastroq (masalan 12)
  qo'yilgan, xavfsizlik zaxirasi bilan, va skript so'rovlar orasida
  avtomatik kutadi (throttling).
- `GEMINI_MAX_REQUESTS_PER_RUN` — bitta ishga tushirish butun kunlik
  kvotani (RPD) yeb qo'ymasligi uchun past sozlangan.
- `MAX_AUTO_FIX_PAGES` — fix-dispatch bosqichi eng xavfli qism (fayllarni
  real o'zgartiradi), shuning uchun bitta ishga tushirishda avtomatik
  tuzatiladigan sahifalar soni ataylab cheklangan — ko'proq topilsa,
  inson (Supervisor_User)ga eskalatsiya qilinishi kerak.

## 7. Ma'lum chegara — "kontekstsiz yo'qlik"ni topa olmaslik

Bir real sinovda, vizual anomaliyasi (rang/forma) bo'lmagan, faqat
"matn butunlay ko'rinmas" (masalan oq fonda oq rangli oddiy matn,
hech qanday quti/chegara ichida emas) holatini Gemini Vision **topa
olmadi** — chunki hech qanday vizual signal (noto'g'ri joylashgan
element, forma) qolmagan, natija shunchaki "bo'sh joy" bo'lib ko'rinadi.
Buning aksicha, xuddi shunday "matn fonga singib ketgan" muammo, agar
matn aniq chegarali element (masalan tugma) ichida bo'lsa, muvaffaqiyatli
topilgan edi (chunki elementning o'zi ko'rinadi, faqat matni yo'q —
bu aniq vizual anomaliya). **Xulosa**: Gemini Vision "shakli bor, lekin
kontenti yo'q" holatlarini yaxshi topadi, lekin "hech qanday shakl
qolmagan, faqat kutilgan matn yo'qolgan" holatlarini kontekstsiz
aniqlay olmasligi mumkin — bu joriy versiyaning bilingan chegarasi.
