import {
 Employee, Department
} from '../db/models'
import dotenv from 'dotenv'
dotenv.config()



/*
 Create department
 @formData
*/
const creatDepartment = async (dep) => {
 return await Department.create(dep);
}

/*
getExisting Departmenr
*/

const checkExistingDep = async(dep_name)=>{
  return await Department.findOne({
    where: {
        dep_name
    }
   });
}


/*
delete one employee
@id
*/

const deleteDepartment = async (id) => {
return await Employee.destroy({
     where: {
         id
     }
 });
 
}

module.exports = {
 creatDepartment,
 deleteDepartment,
 checkExistingDep
}