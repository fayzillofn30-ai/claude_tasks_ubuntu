import JWT from "jsonwebtoken";

export const generateToken =  (payload) => {
    const accessToken = JWT.sign(payload, process.env.JWT_SECRET, {expiresIn:"24h"})
    const refreshToken = JWT.sign(payload, process.env.JWT_REFRESH_SECRET, {expiresIn:"10d"})
    return {
        success:true,
        accessToken,refreshToken
    }
}

export const decodeToken = (token) => {
    const decodeUser = JWT.verify(token, process.env.JWT_SECRET)
    delete decodeUser.iat
    delete decodeUser.exp
    return decodeUser
}