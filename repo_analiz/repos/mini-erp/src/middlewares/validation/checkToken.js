import AuthorizationError from "../../utils/eroors/authorzation.error.js"
import { decodeToken } from "../../utils/genretors/generateToken.js"


export default (req, res, next) => {
    try {
        const authorization = req.headers.authorization
        if(!authorization || !authorization.startsWith("Bearer ")){
            throw new AuthorizationError(401,"Invalid type token !")
        }
        const token = authorization.split(" ")[1]
        let decodeUser = decodeToken(token)
        req.userData = {id:decodeUser.id}
        next()
    } catch (error) {
        if(error.name == "TokenExpiredError" || error.name == "JsonWebTokenError"){
            error.status = 401
            error.message = error.name + " !"
        }
        next(error)
    }
}