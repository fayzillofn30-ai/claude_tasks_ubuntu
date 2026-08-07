import CustomError from "../../utils/eroors/custom.error.js"
import ForibiddenError from "../../utils/eroors/foribidden.error.js"
import Validations from "../../utils/validators/user.validator.js"
import userModel from "../../utils/models/user.model.js"
/**
 * @function
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const loginValidate =  async (req, res, next) => {
    try {
        if(!req.body) throw new CustomError(400,"Invalid data empty body !")
        const {error} = Validations.loginValidation(req.body)
        if(error){
            throw new CustomError(400,error.details.map(d => d.message).join(" | ") + "  !")
        }
  
        next()
    } catch (error) {
        next(error)
    }
}
/**
 * @function
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const registenValidate = async (req, res, next) => {
    try {
        if(!req.body) throw new CustomError(400,"Invalid data empty body !")
        if(!req.files.img) throw new CustomError(400,"Invalid data empty file !")
        const {error} = Validations.registerValidation(req.body)
        if(error){
            throw new CustomError(400,error.details.map(d => d.message).join(" | ") + "  !")
        }
        const user = await userModel.findOne({email:req.body.email})
        if(user) throw new ForibiddenError(400,"User email already exists !")    
        next()
    } catch (error) {
        next(error)
    }
}
/**
 * @function
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next 
 */
export const permissionValidate = async (req, res, next) => {
    try {
        if(!req.body) throw new CustomError(400,"Invalid data empty body !")
        const {error} = Validations.permissionValidation(req.body)
        if(error){
            throw new CustomError(400,error.details.map(d => d.message).join(" | ") + "  !")
        }
        next()
    } catch (error) {
        next(error)
    }
}
/**
 * @function
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next
 * // express midllwares 
 * // validation body 
 */
export const brancnValidate =  (req, res, next) => {
    try {
        if(!req.body) throw new CustomError(400,"Invalid data empty body !")
        const {error} = Validations.branchValidation(req.body)
        if(error){
            throw new CustomError(400,error.details.map(d => d.message).join(" | ") + "  !")
        }
        next()
    } catch (error) {
        next(error)
    }
}

/**
 * @function
 * @param {Request} req 
 * @param {Response} res 
 * @param {Function} next
 * // express midllwares 
 * // validation body 
 */
export const updatnValidate =  (req, res, next) => {
    try {
        if(!req.body) throw new CustomError(400,"Invalid data empty body !")
        const {error} = Validations.updateValidation(req.body)
        if(error){
            throw new CustomError(400,error.details.map(d => d.message).join(" | ") + "  !")
        }
        next()
    } catch (error) {
        next(error)
    }
}

