import empServices from '../services/employee'
import depServices from '../services/department'
import mailService from '../services/emailSender'
import jwt from 'jsonwebtoken'
import path from 'path'

/*
 method to create new employee
 @request body
 @response
*/
const addEmployee = async (req, res) => {
    try {
        const formData = req.body;
        const idDigits = formData.national_id.substring(0, 5);
        const ages = Math.abs(parseInt(new Date().getFullYear(), 10) - parseInt(idDigits.slice(1), 10))
        if (ages < 18) {
            res.status(403).json({
                message: "only 18 and above employee are allowed"
            });
        } else {
            const createdEmp = await empServices.creatEmployee(req.body)
            createdEmp.status ? res.status(201).json({
                status: true,
                employee: createdEmp.employee
            }) : res.status(400).json({
                sucess: false,
                message: createdEmp.message
            })
        }


    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


/*
 Send email of comfirmation
 @request body
*/
const sendComfirmationMail = async (data, token) => {
    const mailData = {
        receiver_mail: data.email,
        receiver_name: data.name,
        token
    }

    try {

        const mailResult = await mailService.mailSender(mailData, 'comfirm');
        if (mailResult.status) {
            return {
                status: mailResult.status,
                message: mailResult.message
            }
        } else {
            return {
                sucess: false,
                message: mailResult.message
            }
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        }
    }

}


/*
 Register a manager
 @request body {object}
*/
const managerSignup = async (req, res) => {
    try {
        const formData = req.body;
        const idDigits = formData.national_id.substring(0, 5);
        const ages = Math.abs(parseInt(new Date().getFullYear(), 10) - parseInt(idDigits.slice(1), 10))
        if (ages < 18) {
            res.status(403).json({
                message: "only 18 and above employee are allowed"
            });
        } else {
            const createdEmp = await empServices.signupUser(req.body)
            if (createdEmp.status) {
                const emailSent = await sendComfirmationMail(req.body, createdEmp.token)
                emailSent.status ? res.status(200).json({
                        status: emailSent.status,
                        message: emailSent.message.messageId,
                        employee: createdEmp.employee
                    }) :
                    res.status(400).json({
                        status: false,
                        message: emailSent.message
                    })
            } else {
                res.status(400).json({
                    sucess: false,
                    message: createdEmp.message
                })
            }
        }

    } catch (error) {
        res.status(500).json({
            success: false,
            error: error.message
        })
    }
}


/*
 verify account
*/
const verifyAccount = async (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.JWT_KEY);
        const user = jwt.decode(req.params.token);
        const userMail = await empServices.checkUserExist(user.email);
        if (userMail.isVerified) {
            res.status(301).json({
                message: `user ${user.name} account has been already verified`
            })
        } else {
            const verified = await empServices.verifyManager(user.email)
            verified.status ? res.status(200).json({
                    status: true,
                    message: verified.message
                }) :
                res.status(400).json({
                    status: false,
                    message: verified.message
                })
        }
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error
        })
    }
}

/*
 updated employee
 @request body
 @response
*/
const updateEmployee = async (req, res) => {
    const id = req.params.id
    const employee = await empServices.getSingleEmployee(id)

    if (employee) {
        const updated = await empServices.updateEmployee(id, req.body);
        const updatedEmployee = await empServices.getSingleEmployee(id)
        updated ? res.status(200).json({
                status: false,
                employee: updatedEmployee
            }) :
            res.status(500).json({
                status: false,
                employee: "something wrong"
            })
    } else {
        res.status('404').json({
            status: false,
            message: 'Employee not found'
        })
    }
}

/*
 sign in manager
 @request body
 @response
 */
const signIn = async (req, res) => {
    const formData = req.body;
    const user = await empServices.checkUserExist(formData.email)
    if (!user) {
        res.status(404).json({
            status: false,
            message: "please register first"
        })
    } else {
        if (user.position == 'MANAGER') {
            user.comparePassword(formData.password, (err, isMatch) => {
                if (isMatch && !err) {
                    const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_KEY, {
                        expiresIn: '24h'
                    });
                    jwt.verify(token, process.env.JWT_KEY, () => {});

                    res.status(200).json({
                        status: true,
                        token,
                        user
                    })
                } else {
                    res.status(403).json({
                        status: false,
                        message: "Email or password is encorect"
                    });
                }
            })
        } else {
            res.status(403).json({
                status: false,
                message: "Not allowed"
            });
        }
    }

}

/*
 suspend employee
 @reuest body
 @resopnse
*/

const suspendEmployee = async (req, res) => {
    const emp_id = req.params.id;
    const employee = await empServices.getSingleEmployee(emp_id);
    if (employee.position == 'MANAGER') {
        res.status(400).json({
            status: false,
            message: 'cant suspend manager'
        })
    } else if (employee.status == 'INACTIVE') {
        res.status(400).json({
            status: false,
            message: 'Account already suspended'
        })
    } else {
        employee['status'] = 'INACTIVE';
        let readyData = JSON.stringify(employee)
        const suspended = await empServices.updateEmployee(emp_id, JSON.parse(readyData));
        suspended ? res.status(200).json({
                status: true,
                message: 'Employee suspended'
            }) :
            res.status(500).json({
                status: false,
                message: 'something went wrong'
            })
    }

}

/*
 activate suspended employee
 @request body
 @response
*/

const activateSuspendedEmployee = async (req, res) => {
    const emp_id = req.params.id;
    const employee = await empServices.getSingleEmployee(emp_id);
    if (employee.status == 'ACTIVE') {
        res.status(400).json({
            status: false,
            message: 'Account already activated'
        })
    } else {
        employee['status'] = 'ACTIVE';
        let readyData = JSON.stringify(employee)
        const suspended = await empServices.updateEmployee(emp_id, JSON.parse(readyData));
        suspended ? res.status(200).json({
                status: true,
                message: 'Employee activated'
            }) :
            res.status(500).json({
                status: false,
                message: 'something went wrong'
            })
    }

}


/*
 delete employee
 @request body
 @response
*/

const deleteEmployee = async (req, res) => {
    const emp_id = req.params.id;
    const employee = await empServices.getSingleEmployee(emp_id);
    if (employee.position == 'MANAGER') {
        res.status(403).json({
            status: false,
            message: 'cant delete Manager'
        });
    } else if (!employee) {
        res.status(404).json({
            status: false,
            message: 'Employee not found'
        });
    } else {
        const deleted = await empServices.deleteSingleEmployee(emp_id)
        deleted ? res.status(200).json({
                status: true,
                message: 'Employee deleted'
            }) :
            res.status(deleted.statusCode).json({
                status: false,
                message: deleted.message
            });
    }
}

/*
 search employee
 @request body
 @response
*/
const searchEmployee = async (req, res) => {
    const searchKeyWord = req.params.key;
    if (searchKeyWord.length < 1) {
        res.status(400).json({
            status: false,
            message: 'Please provide searching keyword'
        })
    } else {
        const results = await empServices.searcEmployee(searchKeyWord);
        results ? res.status(200).json({
                status: true,
                results: results.result
            }) :
            res.status(results.statusCode).json({
                status: true,
                message: results.message
            })
    }
}


/*
 reset password
 @request body
 @response 
*/
const resetPassword = async (req, res) => {

    const user = await empServices.checkUserExist(req.body.email)
    if (!user) {
        res.status(404).json({
            status: false,
            message: 'No account with such email'
        })
    } else {
        const token = jwt.sign(JSON.parse(JSON.stringify(user)), process.env.JWT_KEY, {
            expiresIn: '1h'
        });
        const data = {
            receiver_mail: req.body.email,
            receiver_name: user.name,
            token
        }
        const sentMail = await mailService.mailSender(data, 'reset')
        sentMail ? res.status(200).json({
                status: true,
                message: "check you email of reset link"
            }) :
            res.status(500).json({
                status: false,
                message: sentMail.message
            })

    }
}

const resetPasswordLink = async (req, res) => {
    try {
        jwt.verify(req.params.token, process.env.JWT_KEY);
        const user = jwt.decode(req.params.token);
        const userMail = await empServices.checkUserExist(user.email);
        if (userMail) {
            const newpath = path.join(__dirname, '../')
            res.sendFile(newpath + "utils/resetPWDtamplate.html");

        }
    } catch (error) {
        res.status(500).json({
            status: false,
            error: error
        })
    }
}

const getNewPassword = async (req, res) => {
    const password = req.body.password;
    jwt.verify(req.params.token, process.env.JWT_KEY);
    const user = jwt.decode(req.params.token);
    const userMail = await empServices.checkUserExist(user.email);
    if (!password || password.length < 6) {
        res.status(400).json({
            message: "pasword cant be empty or less than 6 char",
            status: false
        })
    } else {
        if (userMail) {
            const updated = await empServices.updatedPassowrd(userMail.email, password)
            updated ? res.status(200).json({
                    message: 'password reset successfuly you can login',
                    status: true
                }) :
                res.status(500).json({
                    message: 'password did not reset ',
                    status: false
                })
        }

    }
}

/*
assign a user to department
@request body
*/

const assignDepartment = async(req, res)=>{
    //check if employee exist
    const emp = await empServices.getSingleEmployee(req.body.id);
    if(emp){
        const employeData=JSON.stringify(emp);
        const row = JSON.parse(employeData)
        row.depId=req.body.depId;
        const empDep = await empServices.updateEmployee(emp.id, row); 
        empDep?res.status(200).json({status:true,message:"success"}):res.status(500).json({status:false});
    }else{
        res.status(404).json({status:false,message:"employee not found"});
    }
    
}

/*
search employee by department
@request body
*/
const searchByDepartment = async (req,res)=>{
    const dep = await depServices.checkExistingDep(req.params.key);
    if(dep){
        const cond={depId:dep.id}
        const data = await empServices.getEmployees(cond);
        data?res.status(200).json({status:true,data}):res.status(500).json({status:false,message:"something went wrong"});
    }else{
        res.status(404).json({status:false,message:"department not found"});
    }
    
}



module.exports = {
    addEmployee,
    managerSignup,
    verifyAccount,
    updateEmployee,
    signIn,
    suspendEmployee,
    activateSuspendedEmployee,
    deleteEmployee,
    searchEmployee,
    resetPassword,
    resetPasswordLink,
    getNewPassword,
    assignDepartment,
    searchByDepartment
}