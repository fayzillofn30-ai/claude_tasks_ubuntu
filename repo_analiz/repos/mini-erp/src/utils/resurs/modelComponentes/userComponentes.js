import CustomError from "../../eroors/custom.error.js"

export const actions = ["POST","GET","PUT","DELETE","PETCH"]
export const models = ["branchs","users","students","sourses"]
export const namRegex = /^[A-Z][a-z]{2,29}$/

const isKabisa = (year) => {
    if (year % 400 === 0) return true;
    if (year % 100 === 0) return false;
    if (year % 4 === 0) return true;
    return false;
};

export const birthdayTest = (birthDay) => {
    // 1. Formatni tekshirish (yyyy-mm-dd)
    if (!/^\d{4}-\d{2}-\d{2}$/.test(birthDay)) {
        throw new CustomError(400, "Tug'ilgan sana formati yyyy-mm-dd bo'lishi kerak");
    }

    const [y, m, d] = birthDay.split("-").map(Number);

    // 2. Yil, oy, kun to'g'ri sonlar ekanligini tekshirish
    if ([y, m, d].includes(NaN)) {
        throw new CustomError(400, "Tug'ilgan sana noto'g'ri kiritilgan");
    }

    // 3. Yil chegarasi (masalan: 1900 dan keyin bo'lishi kerak)
    if (y < 1900 || y > new Date().getFullYear()) {
        throw new CustomError(400, "Tug'ilgan yil 1900 yildan katta va hozirgi yildan kichik bo'lishi kerak");
    }

    // 4. Oy 1-12 oraliqda bo'lishi kerak
    if (m < 1 || m > 12) {
        throw new CustomError(400, "Tug'ilgan oy 1 dan 12 gacha bo'lishi kerak");
    }

    // 5. Kun chegarasini tekshirish (kabisa yili hisobga olinadi)
    const oyKunlari = [31, (isKabisa(y) ? 29 : 28), 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (d < 1 || d > oyKunlari[m - 1]) {
        throw new CustomError(400, `Tug'ilgan kun ${m}-oy uchun 1 dan ${oyKunlari[m - 1]} gacha bo'lishi kerak`);
    }

    // 6. Sana kelajakdagi sana emasmi?
    const birthdayDate = new Date(`${y}-${m}-${d}`);
    const today = new Date();
    if (birthdayDate > today) {
        throw new CustomError(400, "Tug'ilgan sana kelajakda bo'lishi mumkin emas");
    }

    return true;
};

