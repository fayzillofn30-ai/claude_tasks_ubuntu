import UserService from "../services/user.service.js";

export default class UserController {
    constructor(parameters) {}

    static async getAllUsers(req, res, next) {
        try {
            req.userData = await UserService.readeUsers()
            next()
        } catch (error) {
            next(error)
        }
    }
    static async signUser(req, res, next) {
        try {
            req.userData = await UserService.checkUser(req.body)
            next()
        } catch (error) {
            next(error)
        }
    }
    static async createUser(req, res, next) {
        try {
            req.userData = await UserService.writeUser(req.body, req.files.img)
            next()
        } catch (error) {
           next(error) 
        }
    }
    static async updateUser(req, res, next) {
        try {
            req.userData = await UserService.updateItem(body)
            next()
        } catch (error) {
            next(error)
        }
    }
    static async deleteUser(req, res, next) {
        try {
            req.userData = await UserService.deleteItem(req.body)
            next()
        } catch (error) {
            next(error)
        }
    }

}