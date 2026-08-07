// role.model.js - Placeholder content

import { model, Schema } from "mongoose";

export default model("Branch", new Schema({
    name: {
        type: String,
        required: true,
        unique:true
    },
    address:{
        type:String,
        required: true
    }
}))