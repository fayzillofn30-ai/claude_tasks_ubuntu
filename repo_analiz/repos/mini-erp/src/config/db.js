import mongoose from "mongoose"

export default () => {
    const url = process.env.MONGO_URI
    try {
           mongoose.connect(url)
           return true     
    } catch (error) {
        console.log(error,message)
        return false
    }
}