import {
  Employee
} from '../db/models'
import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
import {
  Sequelize
} from '../db/models';
const Op = Sequelize.Op;
import bcrypt from 'bcrypt'
dotenv.config()



/*
* Create employee
* @formData
*/
const creatEmployee = async (employeeData) => {
  const checkEmail = await Employee.findOne({
      where: {
          email: employeeData.email
      }
  });
  if (checkEmail) {
      return {
          message: "email already exist",
          status: false
      }
  } else {
      let randomNum = Math.floor(1000 + Math.random() * 9000)
      let nextEmpCode = 'EMP' + randomNum;
      const lastEmptCod = await Employee.findOne({
          where: {
              emp_code: nextEmpCode
          }
      })

      if (lastEmptCod) {
          randomNum = Math.floor(1000 + Math.random() * 9000)
          nextEmpCode = 'EMP' + randomNum
      } else {
          const readyEntryData = {
              name: employeeData.name,
              national_id: employeeData.national_id,
              email: employeeData.email,
              phone: employeeData.phone,
              dob: employeeData.dob,
              depId:employeeData.depId,
              status: 'ACTIVE',
              emp_code: nextEmpCode,
              position: employeeData.position.toUpperCase(),
              createdAt: new Date(),
              updatedAt: new Date()
          }
          const employee = await Employee.create(readyEntryData);
          if (employee) return {
              status: true,
              employee
          }
      }


  }

}

const signupUser = async (userData) => {
  const checkEmail = await Employee.findOne({
      where: {
          email: userData.email
      }
  });
  if (checkEmail) {
      return {
          message: "email already exist",
          status: false
      }
  } else {
      const lastEmptCod = await Employee.findOne({
          order: [
              ['createdAt', 'DESC']
          ]
      })

      let nextEmpCode = ''
      lastEmptCod ? nextEmpCode = 'EMP' + (parseInt(lastEmptCod.emp_code.slice(-4), 10) + 1) :
          nextEmpCode = 'EMP0001';

      const readyEntryData = {
          name: userData.name,
          national_id: userData.national_id,
          email: userData.email,
          phone: userData.phone,
          dob: userData.dob,
          status: 'ACTIVE',
          depId:1,
          password: userData.password,
          emp_code: nextEmpCode,
          position: 'MANAGER',
          createdAt: new Date(),
          updatedAt: new Date()
      }
      const employee = await Employee.create(readyEntryData);
      if (employee) {
          const token = jwt.sign(JSON.parse(JSON.stringify(employee)), process.env.JWT_KEY, {
              expiresIn: '1h'
          });
          return {
              status: true,
              employee,
              token
          }
      }
  }
}

/*
check if user exist
*/
const checkUserExist = async (data) => {
  return await Employee.findOne({
      where: {
          email: data
      }
  });
}

/*
get one employee
*/
const getSingleEmployee = async (id) => {
  return  await Employee.findOne({
      where: {
          id: id
      }
  });
}

/*
get employee
@condition object
*/

const getEmployees = async(cond)=>{
    return await Employee.findAll({
        where:[cond]
    })
}


/*
update Employee
*/

const updateEmployee = async (id, data) => {
  return await Employee.update(data, {
      where: {
          id
      }
  })
}

/*
verify Manager
*/
const verifyManager = async (email) => {
  const verified = await Employee.update({
      isVerified: true
  }, {
      where: {
          email
      }
  });
  if (verified) {
      return {
          status: true,
          message: 'user verified successfully',
          user: verified
      };
  } else {
      return {
          status: false,
          message: 'somthing went wrong'
      };
  }
}

/*
delete one employee
@id
*/

const deleteSingleEmployee = async (id) => {
  const verified = await Employee.destroy({
      where: {
          id
      }
  });
  if (verified) {
      return {
          status: true,
          message: 'Employee deleted successfully'
      };
  } else {
      return {
          status: false,
          message: 'somthing went wrong',
          statusCode: 500
      };
  }

}

/*
search employee
@keyword
*/

const searcEmployee = async (key) => {
  const result = await Employee.findAll({
      where: {
          [Op.or]: [{
              name: {
                  [Op.like]: `%${key}%`
              }
          }, {
              position: {
                  [Op.like]: `%${key}%`
              }
          }, {
              email: {
                  [Op.like]: `%${key}%`
              }
          }, {
              phone: {
                  [Op.like]: `%${key}%`
              }
          }, {
              emp_code: {
                  [Op.like]: `%${key}%`
              }
          }]
      }
  })
  if (result) {
      return {
          status: true,
          result
      }
  } else {
      return {
          status: false,
          message: 'something wen wrong',
          statusCode: 500
      }
  }
}

/*
reset password
@password
@email
*/


const updatedPassowrd = async (email, paswword) => {
  const reseted = await Employee.update({
      password: bcrypt.hashSync(paswword, bcrypt.genSaltSync(10), null)
  }, {
      where: {
          email
      }
  });
  if (reseted) {
      return {
          status: true,
          message: 'password reseted successfully',
          user: reseted
      };
  } else {
      return {
          status: false,
          message: 'somthing went wrong'
      };
  }
}



module.exports = {
  creatEmployee,
  signupUser,
  checkUserExist,
  verifyManager,
  getSingleEmployee,
  updateEmployee,
  deleteSingleEmployee,
  searcEmployee,
  updatedPassowrd,
  getEmployees
}