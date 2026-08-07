// permission.model.js - Placeholder content
import { Schema, model, models } from "mongoose";
import { actions } from "../resurs/modelComponentes/userComponentes.js";

export default model("Permission", new Schema({
    user_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "User"
    },
    branch_id: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: "Branch"
    },
    actions: {
        type: [String],
        enum: actions,
        required: true
    },
    model: {
        type: String,
        enum: models,
        required: true
    }
}))