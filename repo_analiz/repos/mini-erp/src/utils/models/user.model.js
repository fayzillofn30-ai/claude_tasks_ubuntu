// user.model.js - Placeholder content

import { model, Schema } from "mongoose";
import { namRegex } from "../resurs/modelComponentes/userComponentes.js";

export default model("User", new Schema({
    first_name:{
        type:String, 
        match:namRegex,
        required:true,
    },
    last_name:{
        type:String, 
        match:namRegex,
        required:true,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    profile_img:{
        type:String
    },
    birth_day:{
        type:String,
        required:true
    }
}));
