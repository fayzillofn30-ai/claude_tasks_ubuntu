import { generateToken } from "../../utils/genretors/generateToken.js"

export const jwtMIdllwares = (req, res, next) => {
    
    try {
        const result = generateToken(req.userData);
        res.status(req.status || 200).json(result)
    } catch (error) {
        next(error)
    };

}

