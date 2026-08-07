import { isValidObjectId } from "mongoose";
import userModel from "../utils/models/user.model.js";
import getPath from "../utils/resurs/testFilePath.js";
import CustomError from "../utils/eroors/custom.error.js";
import bcrypt from "bcrypt"
import AuthorizationError from "../utils/eroors/authorzation.error.js";
import ForibiddenError from "../utils/eroors/foribidden.error.js";
import fs from "fs"

function checkId(id) {
    if (isValidObjectId(id)) {
        return true
    } else {
        throw new CustomError(400, "Invalid _id !")
    }
}
async function checkExists(id) {
    const user = await userModel.findById(id)
    console.log("checkexists", user)
    if (!user) {
        throw new CustomError(404, "User not foud !")
    }
    return user
}

function removeImg(user) {
    if (!user.profile_img) return

    const imagePath = getPath(user.profile_img)
    try {
        if (fs.existsSync(imagePath)) {
            fs.unlinkSync(imagePath)
            console.log("Rasm o‘chirildi:", imagePath)
        }
    } catch (err) {
        console.error("Rasmni o‘chirishda xatolik:", err.message)
    }
}

export default class UserService {
    constructor() { }

    static async readeUsers() {
        const users = await userModel.find()
        return users
    }
    static async writeUser(body, file) {

        body.profile_img = new Date().getTime() + 1 + "_" + file.name
        const filePath = getPath(body.profile_img)
        file.mv(filePath,(error) => {
            if(error){
                throw new CustomError(400,error.message)
            }
        })

        body.password = await bcrypt.hash(body.password, 10)
        const data = await userModel.create(body)
        let tokendata = {
            id: data._id
        }

        return tokendata
    }
    static async checkUser(body) {
        const user = await userModel.findOne({ email: body.email })
        if (!user) throw new ForibiddenError(400, "User not found !")
        
        const decodePass = await bcrypt.compare(body.password,user.password)
        if(!decodePass) throw new AuthorizationError(401,"Invalid email or password")
        return {id:user._id}
    }
    static async updateItem(body) {
        let id = body._id
        checkId(id)
        await checkExists(id)
        delete body._id
        const data = await userModel.updateOne({ _id: id }, body)
        return "User updated !"
    }
    static async deleteItem(body) {
        let id = body._id
        checkId(id)
        const user = await checkExists(id)
        removeImg(user)
        delete body._id
        const data = await userModel.findByIdAndDelete(id)
        return "User deleted !"
    }
}