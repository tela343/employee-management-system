import Joi from "joi"


/*
validate Create employee form data
 */
const _createEmpSchema = Joi.object({
    name: Joi.string().required(),
    national_id: Joi.string().pattern(new RegExp('^([1])')).min(16).max(16).required(),
    phone: Joi.string().min(12).max(12).required(),
    email: Joi.string().email().required(),
    dob: Joi.string().required(),
    status: Joi.string().required(),
    position: Joi.string().required(),
    depId: Joi.number().required()
})


/*
validate signup form data
 */
const _signUpManagerSchema = Joi.object({
    name: Joi.string().required(),
    national_id: Joi.string().pattern(new RegExp('^([1])')).min(16).max(16).required(),
    phone: Joi.string().min(12).max(12).required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    dob: Joi.string().required(),
    depId: Joi.number().required()
})

const _signInManagerSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required()
})

const _resetpasswordSchema = Joi.object({
    password: Joi.string().min(6).required()
})

/*
 validate request data
 emp_code: Joi.string().min(7).max(7).pattern(new RegExp('^EMP\d{4}$')),
 @request body
 @response
 @next
*/
const validateEmployeeData = (req, res, next) => {

    const validationError = (['DEVELOPER', 'DESIGNER', 'TESTER', 'DEVOPS'].includes(req.body.position.toUpperCase()))
    if (validationError) {
        const {
            error
        } = _createEmpSchema.validate(req.body)
        if (error) {
            return res.status(400).json({
                message: error.message
            });
        } else {
            next();
        }
    } else {
        return res.status(400).json({
            message: 'Unavailbale position'
        })
    }

}


/*
Validate manager data to signup
@request body
@response
@next
*/
const validateSignUpData = (req, res, next) => {
    const {
        error
    } = _signUpManagerSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.message
        });
    } else {
        next();
    }
}

/*
Validate manager data to logenin
@request body
@response
@next
*/

const validateSignData = (req, res, next) => {

    const {
        error
    } = _signInManagerSchema.validate(req.body)
    if (error) {
        return res.status(400).json({
            message: error.message
        });
    } else {
        next();
    }
}

/*
Validate manager data to reset pwd
@request body
@response
@next
*/

const validateResetPwd = (req, res, next) => {
    const {
        error
    } = _resetpasswordSchema.validate(req.params)
    if (error) {
        return res.status(400).json({
            message: error.message
        });
    } else {
        next();
    }
}

module.exports = {
    validateEmployeeData,
    validateSignUpData,
    validateSignData,
    validateResetPwd
}