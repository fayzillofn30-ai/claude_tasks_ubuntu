import { logger } from "../../utils/genretors/logger.js";

export default (err, req, res, next) => {
    const stack = err.stack.split("\n")[1]

    if (err.status) {
        logger.info(err.message + "\n" + stack)
        return res.status(err.status).json({
            success: false,
            status: err.status,
            message: err.message
        })
    };
    
    logger.error(err.message + "\n" + stack);

    return res.status(500).json({
        success: false,
        status: 500,
        message: "Internal server error !"
    });

};
