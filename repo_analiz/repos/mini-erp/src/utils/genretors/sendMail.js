import nodemailer from "nodemailer";
import { email, emailkey } from "../resurs/email/componentes_.js";
import { htmlgeneretor } from "../resurs/email/componentes_.js";

async function sendVerifikatsiy(user, url, refreshurl) {
    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: email,
            pass: emailkey
        }
    })
    
    const mailOptions = {
        from: email,
        to: user,
        subject: process.env.USER,
        html: htmlgeneretor(url, refreshurl)
    };

    await transporter.sendMail(mailOptions)
}

export default sendVerifikatsiy