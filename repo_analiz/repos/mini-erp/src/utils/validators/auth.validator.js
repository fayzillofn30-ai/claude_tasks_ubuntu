import permissionModel from "../models/permission.model.js";
import userModel from "../models/user.model.js";
import AuthorizationError from "../eroors/authorzation.error.js";
import CustomError from "../eroors/custom.error.js";

export default class AuthValidation {
    constructor() { }

    static async roleValidation(req, res, next, ...roles) {
        try {
            const user = await userModel.findById({ _id: req.userData.id })
            if (!user) {
                throw new CustomError(404, "User not found !")
            }
            if (!roles.includes(user.role)) {
                throw new AuthorizationError(401, "Not allowed ! ")
            }
            next()
        } catch (error) {
            next(error)
        }
    }
    static async permissionValidation(req, res, next) {
        try {
            let {id} = req.userData
            const user = await userModel.findById(id)
            if (!user) {
                throw new CustomError(404, "User not found !")
            }

            const collection = req.url.split("/").at(-1)
            const permissions = await permissionModel.findOne({
                user_id: user._id,
                model: collection,
                branch_id: req.body.branch_id
            })

            if (!permissions) throw new AuthorizationError(406, "User permission not found !")
            if (!permissions.actions.includes(req.method)) {
                throw new AuthorizationError(406, `${user.first_name} ${collection} ${req.method} not allowed !`)
            }
            next()
        } catch (error) {
            next(error)
        }
    }
}