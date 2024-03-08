import depServices from '../services/department'


/*
 method to create new department
 @request body
 @response
*/
const addDepartment = async (req, res) => {
    try {
      const checkDep = await depServices.checkExistingDep(req.body.dep_name);
      if(checkDep){
       res.status(400).json({status:false, message:"dep already exist"})
      }else{
       
       const newDep = await depServices.creatDepartment(req.body)
       
       newDep?res.status(201).json({
           status: true,
           Department: newDep
       }) : res.status(400).json({
           sucess: false,
           message: "something went wrong"
       })
      } 
    } catch (error) {
        res.status(500).json({
            success: false,
            error: error
        })
    }
}


/*
 updated employee
 @request body
 @response
*/
const updateDepartment = async (req, res) => {
    const id = req.params.id
    const employee = await empServices.getSingleEmployee(id)

    if (employee) {
        const updated = await empServices.updateEmployee(id, req.body);
        const updatedEmployee = await empServices.getSingleEmployee(id)
        updated ? res.status(201).json({
                status: updated.status,
                employee: updatedEmployee
            }) :
            res.status(500).json({
                status: updated.status,
                employee: updated.message
            })
    } else {
        res.status('404').json({
            status: false,
            message: 'Employee not found'
        })
    }
}


module.exports = {
    addDepartment,
    updateDepartment

}