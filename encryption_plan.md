# Gmail va Parollarni Shifrlash Dasturi Rejasi (C Tilida)

Ushbu dastur foydalanuvchi kiritgan Gmail va parollarni maxfiy kalit (Seed) yordamida shifrlab (Encode), faylga saqlaydi va kerak bo'lganda kalit orqali qayta o'qiydi (Decode).

---

## 🛠️ Texnik Arxitektura va Ma'lumotlar Strukturasi

### 1. Ma'lumot Strukturasi (Struct)
C tilida ma'lumotlarni saqlash va faylga yozish uchun maxsus struktura ishlatiladi:
```c
struct Account {
    char gmail[100];
    char password[100];
};
```

### 2. Shifrlash Algoritmi (XOR Cipher)
* **Qanday ishlaydi:** Kiritilgan **Seed** (kalit matn yoki raqam) yordamida har bir belgi XOR (`^`) operatori orqali shifrlanadi.
* **Xususiyati:** XOR shifrlash simmetrik hisoblanadi. Ya'ni, shifrlash va shifrni yechish uchun aynan bitta formula ishlatiladi:
  $$\text{Belgi} \oplus \text{Kalit} = \text{Shifrlangan Belgi}$$
  $$\text{Shifrlangan Belgi} \oplus \text{Kalit} = \text{Asl Belgi}$$

---

## 📋 Bosqichma-bosqich Reja

### 1-bosqich: Kodlash (Encoding Mode)
1. Dastur ishga tushib, foydalanuvchidan **Gmail**, **Password** va **Seed (Kalit)** ni so'raydi (`scanf` / `fgets` orqali).
2. Kiritilgan Gmail va Password belgilarini Seed kaliti yordamida XOR shifrlaydi.
3. Shifrlangan ma'lumotlarni binary (ikkilik) rejimda faylga yozadi:
   ```c
   FILE *file = fopen("accounts.enc", "ab"); // qo'shib yozish rejasi
   fwrite(&acc, sizeof(struct Account), 1, file);
   fclose(file);
   ```

### 2-bosqich: Dekodlash (Decoding Mode)
1. Dastur foydalanuvchidan **Seed (Kalit)** ni so'raydi.
2. `accounts.enc` faylini o'qish uchun ochadi (`rb` rejimida).
3. Har bir strukturani o'qib, kiritilgan Seed yordamida teskari XOR amalini bajaradi.
4. Agar yechilgan ma'lumotlar to'g'ri bo'lsa (masalan, `@gmail.com` va parolni to'g'ri dekodlasa), ekranga chiqaradi. Noto'g'ri kalit kiritilsa, tushunarsiz belgilar (iyerogliflar) chiqadi va ma'lumot xavfsiz qoladi.

---

## 💡 Nega C tili eng ma'qul tanlov?
* **Binary File I/O:** `fwrite` va `fread` yordamida butun bir strukturani (struct) to'g'ridan-to'g'ri faylga bit-bayt yozish va o'qish juda oson.
* **Pointer va Bayt darajasida ishlash:** XOR amalini belgi-bayt darajasida tezkor va xotirani kam sarflagan holda bajarish mumkin.
