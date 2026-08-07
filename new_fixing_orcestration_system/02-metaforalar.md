# 2. Metaforalar

G'oyani aniqroq muhokama qilish uchun — texnik spec emas, tushuntirish
vositasi.

## 2.1 Bosh muhandis va kotib

**Claude — bosh muhandis** (qimmat, sekin, lekin chuqur fikrlaydi), **AGY —
kotib** (arzon, juda tez yozadi — 340+ token/soniya). Bosh muhandis har bir
kichik xulosani o'zi qog'ozga tushirsa, uning qimmat vaqti behuda ketadi.
To'g'ri taqsimot: muhandis qaror qabul qiladi va tekshiradi, kotib esa
qarorni tezkor va arzon tarzda qayd etadi (DB'ga yozadi). Bu taqsimot
hozircha `orcestor`da qisman bor (AGY — Executor), lekin checkpoint/memory
yozish vazifasi hali aniq ajratilmagan.

## 2.2 Sprint va retro

**Sessiya — bitta sprint** (maksimal 5 prompt). Sprint oxirida `/clear` —
**retro**: nima qilindi, nima chiqdi, keyingi qadam nima — bittagina qisqa
paragraf. Keyingi sprint shu paragrafdan boshlanadi, oldingi sprintning
har bir tafsiloti emas. Hozirgi `status.md` fayllari aslida qo'lda
yozilayotgan retro — lekin ular tez uzayib, o'zi ham "context" bo'lib
qolyapti (masalan `github-backup/status.md` yonida 3 ta `.err*` fayl bor).

## 2.3 Filiallar va bosh ofis

To'rtta `orcestor/` nusxasi — **bir xil kompaniyaning turli shahar
filiallari**, har biri o'z mahalliy tartibini ixtiro qilgan (bir xil
`requirements.MD` skeleti, lekin turlicha to'ldirilgan). Yagona tizim —
**bosh ofis**: bitta schema, bitta qoidalar to'plami, filiallar shundan
meros oladi, o'zidan qonun chiqarmaydi.

## 2.4 Kundalik daftar vs versiyalangan checkpoint

Fayl-asosli `status.md` — **qo'l bilan yozilgan kundalik daftar**: chiziqli,
qidirish qiyin, eskisi o'chirilmaydi (faqat "RAD ETILDI" deb belgilanadi),
vaqt o'tib qalinlashadi. DB-asosli checkpoint — **versiyalangan yozuv**:
har checkpoint bitta qator, oxirgisini so'rash — bitta so'rov (`WHERE
session=X ORDER BY vaqt DESC LIMIT 1`), butun daftarni o'qish shart emas.

## 2.5 Ikki xil xotira turi — qisqa muddatli va uzoq muddatli

**Session checkpoint — ishchi xotira** (bugungi kunga xos, tez eskiradi,
har sprintda yangilanadi). **Standing rules — uzoq muddatli xotira**
(masalan "CSS'ga tegilmaydi", "fayzillofn30-ai faqat gh token orqali push
qiladi") — bular sessiyaga bog'liq emas, har safar qayta yozilmasligi,
faqat **yangilanishi** kerak. Ikkalasini bitta jadvalga aralashtirish —
kundalik daftarga passport ma'lumotlarini har kuni qayta yozishga o'xshaydi:
ishlaydi, lekin behuda va xatoga moyil.
