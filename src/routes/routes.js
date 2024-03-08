import {
 Router
} from 'express';
import {
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
} from '../controllers/EmployeeController';
import {
 validateEmployeeData,
 validateSignUpData,
 validateSignData,
 validateResetPwd
} from '../utils/validation';
import {
 addDepartment
} from '../controllers/DepartmentController'
import checkAuthentication from '../middlewares/auth'

const router = Router();

router.post('/employee/add', validateEmployeeData, checkAuthentication, addEmployee);
router.post('/employee/signup', validateSignUpData, managerSignup);
router.get('/employee/verify/:token', verifyAccount);
router.put('/employee/update/:id', validateEmployeeData, checkAuthentication, updateEmployee);
router.post('/employee/login', validateSignData, signIn);
router.post('/employee/suspend/:id', checkAuthentication, suspendEmployee);
router.post('/employee/activate/:id', checkAuthentication, activateSuspendedEmployee);
router.get('/employee/delete/:id', checkAuthentication, deleteEmployee);
router.get('/employee/search/:key', checkAuthentication, searchEmployee);
router.post('/employee/resetPassword', resetPassword);
router.get('/employee/:token/resetPassword/', resetPasswordLink);
router.post('/employee/:token/resetPassword/newPassword', getNewPassword);

router.post('/department/add', checkAuthentication, addDepartment);
router.post('/employee/assign', checkAuthentication, assignDepartment);
router.get('/employee/searchByDep/:key', checkAuthentication, searchByDepartment)


module.exports = router;