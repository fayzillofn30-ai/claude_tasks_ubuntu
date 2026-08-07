export const responseHadlers =  (req, res, next) => {
    try {
        if (typeof req.userData != "string") {
            res.status(req.status || 200).json({
                success: true,
                data: req.userData,
            })
        } else {
            res.status(req.status || 200).json({
                success: true,
                message: req.userData,
            })
        }
    } catch (error) {
        next(error)
    }
}