# UI Debugging Tahlili — prompt shabloni

Quyida biriktirilgan screenshot — lokal/dev serverdagi sahifaning hozirgi
holati. Sen frontend UI-QA mutaxassisisan. Faqat screenshot'da **ko'rinadigan**
vizual/UI muammolarni top (kod yoki konsol xatolarini emas — ular alohida,
matn darajasida tekshiriladi).

Har bir topilgan muammo uchun quyidagi formatda javob ber:

1. **Joylashuvi** — sahifaning qaysi qismida.
2. **Muammo tavsifi** — nima noto'g'ri ko'rinmoqda (matn o'qilmaydi, element
   boshqasining ustiga chiqib ketgan, tugma konteynerdan tashqariga chiqqan,
   rasm yuklanmagan, spacing/alignment noto'g'ri va h.k.).
3. **Ehtimoliy sabab** — CSS jihatidan bunga nima sabab bo'lishi mumkinligi
   haqida taxmin.
4. **Tuzatish tavsiyasi** — qisqa, aniq CSS/HTML tuzatish taklifi.

**Muhim cheklov**: FAQAT screenshot'da haqiqatan ko'rinadigan narsalar
haqida yoz. Quyidagilar haqida FIKR BILDIRMA:
- Matn mazmuni/til sifatiga oid mulohazalar (bu vizual muammo emas).
- Sana/vaqt "to'g'riligi" (sizda joriy sana haqida ma'lumot yo'q — buni
  hech qachon xato deb belgilama, bu sohada ishonchsiz manba).
- Biznes-mantiq yoki kontent tanlovi (masalan "bu matn qisqaroq bo'lishi
  kerak edi") — faqat AYNIQSA vizual jihatdan buzilgan bo'lsagina yoz.

Javobni markdown formatida, raqamlangan ro'yxat sifatida ber. Agar hech
qanday muammo topilmasa, aniq shunday yoz: "Vizual muammo topilmadi."
Umumiy ("dizayn yomon" kabi) fikr bermasdan, faqat aniq, ko'rsatiladigan
nuqtalar bo'yicha javob ber.
