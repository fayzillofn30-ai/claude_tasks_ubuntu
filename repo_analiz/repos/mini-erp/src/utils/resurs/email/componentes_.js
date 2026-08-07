import nodemailer from "nodemailer";
export const email = process.env.EMAIL
export const emailkey = process.env.EMAIL_KEY

export const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: email,
        pass: emailkey
    }
})

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