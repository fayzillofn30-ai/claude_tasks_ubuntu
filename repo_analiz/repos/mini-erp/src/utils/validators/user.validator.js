// user.validator.js - Placeholder content

import Joi from "joi";
import { actions, birthdayTest, models, namRegex } from "../resurs/modelComponentes/userComponentes.js";
import { isValidObjectId, Schema } from 'mongoose'

function isObjectId(value, helpers) {
    if (isValidObjectId(value)) {
        return value
    }
    return helpers.message("Invalid id | -> ", + value)
}

export function isDate(value, helpers) {
    try {
        if (birthdayTest(value)) {
            return value
        } else {
            throw new Error("Invalid birthday !")
        }
    } catch (error) {
        return helpers(error.message)
    }
}

export default class Validations {
    constructor() { }

    static registerValidation(payload) {
        const userSchema = Joi.object({
            first_name: Joi.string().pattern(namRegex).required(),
            last_name: Joi.string().pattern(namRegex).required(),
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(32).required(),
            r_password: Joi.ref('password'),
            birth_day: Joi.string().custom(isDate).required()
        }).unknown(false)
        return userSchema.validate(payload, {
            abortEarly: false,
            convert: false
        })
    }

    static updateValidation(payload) {
        const userSchema = Joi.object({
            _id: Joi.custom(isObjectId).required(),
            first_name: Joi.string().pattern(namRegex),
            last_name: Joi.string().pattern(namRegex),
            email: Joi.string().email(),
            password: Joi.string().min(8).max(32),
            r_password: Joi.any()
                .when('password', {
                    is: Joi.exist(),
                    then: Joi.required().messages({
                        'any.required': 'Tasdiq password bo\'lishi shart!'
                    }),
                    otherwise: Joi.optional()
                })
                .valid(Joi.ref('password'))
                .messages({
                    'any.only': 'Tasdiq password noto\'g\'ri!'
                }),
            birth_day: Joi.string().custom(isDate)
        }).min(2).unknown(false).with("password", "r_password")

        return userSchema.validate(payload, {
            abortEarly: false,
            convert: false
        })
    }

    static loginValidation(payload) {
        const loginSchema = Joi.object({
            email: Joi.string().email().required(),
            password: Joi.string().min(8).max(32).required(),
            r_password: Joi.ref('password')
        }).unknown(false)

        return loginSchema.validate(payload, {
            abortEarly: false,
            convert: false
        })
    }
    static permissionValidation(payload) {
        let permissionSchema = Joi.object({
            user_id: Joi.string().custom(isObjectId).required(),
            branch_id: Joi.string().custom(isObjectId).required(),
            actions: Joi.string().valid(...actions).required(),
            model: Joi.string().valid(...models)
        }).unknown(false)
        return permissionSchema.validate(payload, {
            abortEarly: false,
            convert: false
        })
    }
    static branchValidation(payload) {
        const branchSchema = Joi.object({
            name: Joi.string().min(6).pattern(/^[A-Za-zʻ' -]+$/).required(),
            adress: Joi.string().min(6).required()
        }).unknown(false)
        return branchSchema.validate(payload, {
            abortEarly: false,
            convert: false
        })
    }
}

