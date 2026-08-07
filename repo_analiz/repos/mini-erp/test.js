import Joi from "joi"
function updateValidation(payload) {
    const userSchema = Joi.object({
        name:Joi.string(),
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
          })
          
    })

    return userSchema.validate(payload, {
        abortEarly: false,
        convert: false
    })
}
// ,r_password:"12345678"

const reault = updateValidation({name:123,password:"12345678", r_password:"12345678"})
console.log(reault.error.details.map(d => d.message).join("   |    "))
