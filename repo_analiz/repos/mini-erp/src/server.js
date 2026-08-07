import 'dotenv/config';
import express from "express"
import db from './config/db.js';
import user_router from './routes/user.routes.js';
import errorMidllwares from './middlewares/responsehandlers/errorMidllwares.js';
import bodyParser from 'body-parser';
import fileUpload from 'express-fileupload';
const server = express()

server.use(express.json())
server.use(bodyParser.urlencoded({ extended: true }))
server.use(express.urlencoded({ extended: true }));
server.use(fileUpload())

const application = async () => {
    const dbStatus = db()
    const port = process.env.PORT
    const host = process.env.HOST
    if (dbStatus) {

        server.use("/api/users", user_router)
        server.use(errorMidllwares)
        server.listen(port, console.log(`http:${host}:${port}`))
    } else {
        console.log(dbStatus, "Internal server error !")
    }
}

application()