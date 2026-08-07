# `e-commerce` (Frontend) Loyihasi Chuqur Tahlili

* **Sana:** 2026-08-03
* **Qamrab olingan fayllar soni:** 51 ta

---

### Noodatiy Yechimlar va Custom Algoritmlar (12 ta)

#### FACT
- Fayl: `src/service/api.js` (L20-102)
- Kod parchasi:
```javascript
let isRefreshing = false
let failedQueue = []

const processQueue = (error, token = null) => {
    failedQueue.forEach(prom => {
        if (error) prom.reject(error)
        else prom.resolve(token)
    })
    failedQueue = []
}

if (error.response?.status === 401 && !originalRequest._retry) {
    if (isRefreshing) {
        return new Promise(function (resolve, reject) {
            failedQueue.push({ resolve, reject })
        })
        .then(token => {
            originalRequest.headers['Authorization'] = 'Bearer ' + token
            return api(originalRequest)
        })
    }
    // ... refresh request
}
```

#### OBSERVATION
- Parallel kelayotgan 401 xatoliklariga qarshi so'rovlarni Promise navbatiga (`failedQueue`) saqlash va JWT tokeni yangilangach barcha kutayotgan so'rovlarni bir vaqtda sarlavhalarini yangilab qayta yuborish (retrying mechanism) arxitekturasi. Token refresh jarayoni uchun cheksiz 401 zanjiriga tushmasligi uchun alohida `refreshApi` Axios instance yaratilgan.

#### NEGA ODATIY EMAS
- Ko'pchilik standart frontend loyihalarida 401 xatosi yuz berganda shunchaki foydalanuvchi `/sign` sahifasiga yo'naltiriladi yoki tayyor `axios-retry` moduli ulanadi. Bu faylda esa React/Zustand va pure Axios dynamic closure yordamida token refresh va navbat arxitekturasi qo'lda to'liq noldan yozilgan.

---

#### FACT
- Fayl: `src/utils/properties-utils/Property-Map.jsx` (L23-35, L46-81)
- Kod parchasi:
```javascript
map.on('click', (e) => {
    const lat = e.latlng.lat.toFixed(6);
    const lng = e.latlng.lng.toFixed(6);
    setCoords({ lat, lng });
    setPropertyData("locationUrl", `https://www.google.com/maps?q=${lat},${lng}`)
});

const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}`;
const response = await fetch(url, {
    headers: { 'User-Agent': 'e-commerce' }
});
```

#### OBSERVATION
- OpenStreetMap Leaflet interaktiv xaritasi va OpenStreetMap Nominatim Geocoding qidiruv tizimi ulanishi. Xaritadan nuqta tanlanganda dynamic Google Maps havola shakllantiriladi, manzil kiritilib Enter bosilganda esa OpenStreetMap API orqali reverse/forward geocoding qilinib, marker kerakli lat/lon nuqtasiga suriladi.

#### NEGA ODATIY EMAS
- Odatda e-commerce yoki ko'chmas mulk loyihalarida oddiy matnli `address` inputi bilan kifoyalaniladi yoki Google Maps JavaScript API tayyor pullik SDK ishlatiladi. Dasturchi bepul OpenStreetMap Leaflet va Nominatim servislarini gibrid tarzda integratsiya qilib tejamkor hamda interaktiv geographic location engine yaratgan.

---

#### FACT
- Fayl: `src/pages/PropertiyAdd.jsx` (L33-97)
- Kod parchasi:
```javascript
const propertyCreateRequest = await api.post("/properties/create", { ... })
const propertyId = propertyCreateRequest.data.id

const additionalsRequest = await api.post("/additional", {
    propertyId: propertyId,
    // ...
})

const propertyMediaFormData = new FormData()
if (Array.isArray(propertyMediaData.features)) {
    propertyMediaData.features.forEach(file => propertyMediaFormData.append("features", file))
}
propertyMediaFormData.append("propertyId", propertyId)
await api.post("/property-media/create", propertyMediaFormData)
```

#### OBSERVATION
- Yangi e-commerce mulk elonini yaratishda uch bosqichli transaksion bog'liq so'rovlar zanjiri (Sequential Relational Async Chain). Birinchi so'rovda hosil bo'lgan `propertyId` ikkinchi va uchinchi so'rovlarga (qo'shimcha xususiyatlar va multipart media fayllar) kalit bo'lib o'tadi.

#### NEGA ODATIY EMAS
- Odatda backend e-commerce tizimlarida bitta `POST /properties` endpointida hamma ma'lumotlar multipart shaklida qabul qilinishi kutiladi. Bu yerda esa frontend relational jadvallarga mos holda ketma-ketlik va array/single file guard parsing bilan ma'lumot yuboradi.

---

#### FACT
- Fayl: `src/utils/properties-utils/Property-Media.jsx` (L14-27)
- Kod parchasi:
```javascript
if (featuredImages.length === 4) {
    const newfeaturedImages = Array.from(e.target.files)[0]
    setFeaturedImages(prev => prev.map((el, index) => {
        if (index === 0) {
            return newfeaturedImages
        } else {
            return el
        }
    }))
    return
}
```

#### OBSERVATION
- Rasm yuklash buferida rasm soni 4 taga etganda, yangi rasmlar yuklanishini rad etish o'rniga birinchi indeksdagi (`index === 0`) eski rasmni almashtirish (Sliding Replacement Image Buffer) algoritmi.

#### NEGA ODATIY EMAS
- Odatda limitga yetganda fayl yuklash tugmasi o'chiriladi yoki foydalanuvchiga taqiqlovchi alert ko'rsatiladi. Dasturchi foydalanuvchi tajribasini to'xtatib qo'ymaslik uchun sliding window buffer yechimini qo'llagan.

---

#### FACT
- Fayl: `src/pages/Properties.jsx` (L42, L50)
- Kod parchasi:
```jsx
<div className='container mx-auto rotate-180 grid grid-cols-3 relative shadow-2xl max-md:grid-cols-1'>
    {data.map(property => (
        <div className='w-[450px] h-max my-10 mx-8 relative rotate-180' key={id}>
            <CustomCardComponenta ... />
        </div>
    ))}
</div>
```

#### OBSERVATION
- CSS Transform render pipeline orqali grid konteyneriga `rotate-180` berib kartalar ketma-ketligini o'ngdan chappa/teskari ko'rinishga keltirish va ichki kartalarga ham qayta `rotate-180` berib kontent tik holatga qaytarilishi (CSS Double-Flip Trick).

#### NEGA ODATIY EMAS
- Elementlar tartibini almashtirish uchun odatda JS `.reverse()` yoki `flex-direction: row-reverse` qo'llaniladi. Bu yerda CSS visual transform trick orqali layout tartibi o'zgartirilgan.

---

#### FACT
- Fayl: `src/utils/home-utils/card-createre.jsx` (L25, L29, L33)
- Kod parchasi:
```jsx
<span>Baths {baths % 10 || 0}</span>
<span>Beds {beds % 10 || 0}</span>
<span>{garage % 10 || 0} Garage</span>
```

#### OBSERVATION
- Mulk xususiyatlari bo'lmish xonalar, vannaxonalar hamda garajlar sonini ko'rsatishda `% 10` (mod 10) arifmetik operatoridan foydalanib frontend ma'lumotlarini tozalash va bir xonali formatga keltirish.

#### NEGA ODATIY EMAS
- Oddiy komponentlarda backend kelgan qiymat o'zicha render qilinadi. Backend ba'zan o'nlik yoki ID/kodlangan sonlar yuborgan hollarda UI buzilmasligi uchun dasturchi inline modulo sanitizer ishlatgan.

---

#### FACT
- Fayl: `src/utils/properties-utils/Property-Features.jsx` (L19, L25, L31)
- Kod parchasi:
```javascript
amenitiesList.forEach(amenity => {
    setFeaturesData(amenity.toLowerCase().replaceAll(" ", "_"), false)
})

const value = event.target.name.toLowerCase().replaceAll(" ", "_");
```

#### OBSERVATION
- Foydalanuvchiga ko'rsatiladigan qulayliklar matnidan (`'Air conditioning'`, `'Outdoor Shower'`) database `snake_case` boolean kalitlarini (`air_conditioning`, `outdoor_shower`) hosil qiluvchi string transformator va avtomatik initsializatsiya mexanizmi.

#### NEGA ODATIY EMAS
- Odatda har bir checkbox uchun alohida nomdagi va qiymatli state o'zgaruvchilar hardcode qilinadi. Dasturchi massiv elementlarini avtomatik dinamik kalitlarga o'tkazadigan pipeline yaratgan.

---

#### FACT
- Fayl: `src/utils/profile-utils/Profile-main.jsx` (L38-72)
- Kod parchasi:
```javascript
if (updatedAvatar) {
    const formData = new FormData()
    formData.append("image", updatedAvatar)
    await api.patch(`/users/updateimange/${id}`, formData, { ... })
}
if (newPassword && newPassword.trim().length > 0) {
    await api.post(`/auth/change-password`, { ... })
}
if (Object.keys(body).length > 0) {
    await api.patch(`/users/${id}`, body)
}
```

#### OBSERVATION
- Profil ma'lumotlarini saqlash tugmasi bosilganda o'zgargan maydon turiga (avatar fayli, parol, profil matni) qarab uchta alohida micro-request endpointlariga ketma-ket so'rov yuborish va yakunda qaytgan profil holatini Zustand hamda local state da dinamik sinxronlash.

#### NEGA ODATIY EMAS
- Standart loyihalarda foydalanuvchi profili bitta `PATCH /profile` endpointi orqali birdaniga yangilanadi. Bu yerda esa maydonlar o'zgarganiga qarab so'rovlarni dinamik ajratib yuborish yondashuvi qo'llanilgan.

---

#### FACT
- Fayl: `src/store/Property-store.js` (L16)
- Kod parchasi:
```javascript
export const featuresStore = create((set) => {
    return {
        featuresData: {},
        setFeaturesData: (field, value) => set(state => ({
            featuresData: {
                ...state.featuresData,
                [field]: value
            }
        })),
        resetFeatures: () => set({}),
    }
})
```

#### OBSERVATION
- Store reset qilish funksiyasida boshlang'ich shaklga keltirish o'rniga Zustand state obyekti bo'sh `{}` ga almashtirib yuboriladi.

#### NEGA ODATIY EMAS
- Standart amaliyotda reset chaqirilganda daslabki kalitlar va ularning defolt qiymatlari tiklanishi kerak (`set({ featuresData: {} })`). Bu yerda esa xotirani to'g'ridan-to'g'ri tozalash uchun bo'sh obyekt berilgan.

---

#### FACT
- Fayl: `src/utils/properties-utils/Property-Additionals.jsx` (L10, L32, L130-147)
- Kod parchasi:
```javascript
const [lotDimensions, setLotDimensions] = useState({ "A": 0, "B": 0 })

const handleChange = (field, e) => {
    setAdditionalData("lotDimensions", `${lotDimensions.A}x${lotDimensions.B}`)
    setAdditionalData(field, e.target.value)
}
```

#### OBSERVATION
- Yer maydoni o'lchamlarini ikkita mustaqil `A` va `B` raqamli textfield inputlarida qabul qilib, ularni har safar matn o'zgarganda `${A}xB` formatida kompozit satr sifatida saqlash kodi.

#### NEGA ODATIY EMAS
- Odatda foydalanuvchiga bitta umumiy text input beriladi va foydalanuvchi "10x20" deb o'zi yozishi kutiladi. Komponent ichida 2 ta alohida inputni qamrab olgan dynamic composite formatter ishlatilgan.

---

#### FACT
- Fayl: `src/App.jsx` (L38-52)
- Kod parchasi:
```javascript
!!localStorage.getItem("accessToken") ? api.get("/users/get-my").then((req) => {
    const user = req.data.user
    Object.keys(user).forEach(field => {
        if (field === "fullName") {
            setUserData("firstName", user[field].split(" ")[0])
            setUserData("lastName", user[field].split(" ").at(-1))
            setUserData(field, user[field])
        } else {
            setUserData(field, user[field])
        }
    })
}) : ""
```

#### OBSERVATION
- App dastlabki yuklanish jarayonida foydalanuvchi sessiyasini tiklash uchun inline ternary chaqiruv. Qaytgan `fullName` satri `split(" ")[0]` hamda `.at(-1)` orqali bo'linib `firstName` va `lastName` o'zgaruvchilariga ajratiladi hamda global Zustand `userDataStore` to'ldiriladi.

#### NEGA ODATIY EMAS
- Backend-dan kelgan foydalanuvchi obyekti o'z holicha saqlanadi yoki backend-dan `firstName`/`lastName` alohida keladi. Frontend render darajasida String parser bilan foydalanuvchi profilini bo'laklarga ajratib saqlash mantiqi yozilgan.

---

#### FACT
- Fayl: `src/store/IsAuth-store.js` (L15-21, L30-36)
- Kod parchasi:
```javascript
setAccessToken : (accessToken) => {
    if(typeof accessToken === "string"){
        localStorage.setItem("accessToken",accessToken)
        set({accessToken})
    }else{
        localStorage.removeItem("accessToken")
    }
}
```

#### OBSERVATION
- Zustand store ichidagi token setter funksiyasida kiruvchi qiymat tipiga ko'ra `setItem` yoki `removeItem` operatsiyasini bajarish.

#### NEGA ODATIY EMAS
- Odatda tokenni saqlash va o'chirish uchun ikkita alohida funksiya yoziladi (`setToken` hamda `removeToken`/`logout`). Bu yerda esa bitta setter funksiyada tip bo'yicha dinamik switch bajarilgan.

---

## Yakuniy Xulosa

`e-commerce` (Frontend) loyihasidagi 51 ta manba va konfiguratsiya fayllari to'liq o'rganib chiqildi. Tahlil natijasida **12 ta** dasturchi (Fayzillo) tomonidan yozilgan noodatiy yechim, custom algoritmlar va arxitekturaviy yondashuvlar aniqlandi.

### Eng diqqatga sazovor 3 ta yechim:
1. **JWT Token Refresh Queue Architecture (`src/service/api.js`):** React va Axios bilan 401 status kodi olgan barcha parallel so'rovlarni Promise navbatiga tizib, token yangilangach barchasini avtomatik qayta yuborish mexanizmi.
2. **OpenStreetMap Leaflet & Nominatim Hybrid Location Engine (`src/utils/properties-utils/Property-Map.jsx`):** Geocoding orqali xaritada joylashuvni qidirish va koordinatalardan dynamic Google Maps link shakllantirish tejamkor geografik integrator yechimi.
3. **Multi-Stage Relational Transactional Async Chain (`src/pages/PropertiyAdd.jsx`):** E-commerce e'lonini yaratishda backend relational modellarga mos keladigan 3 bosqichli sequential so'rovlar va media fayllarni multipart parsing qilish zanjiri.
