import bcrypt from 'bcrypt';


const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Employee extends Model {
    
    static associate(models) {
      // define association here
      Employee.belongsTo(models.Department, {
        foreignKey: 'depId',
        onDelete: 'CASCADE',
      });
      
    }
  };
  Employee.init({
    name: DataTypes.STRING,
    national_id: DataTypes.STRING,
    emp_code: DataTypes.STRING,
    depId: DataTypes.INTEGER,
    phone: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING,
    dob: DataTypes.STRING,
    status: DataTypes.STRING,
    position: DataTypes.STRING,
    isVerified: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Employee',
  });
  Employee.beforeSave((emp, options) => {
    if (emp.changed('password')) {
      emp.password = bcrypt.hashSync(emp.password, bcrypt.genSaltSync(10), null);
    }
  });
  Employee.beforeUpdate((emp, options)=>{
    if (emp.changed('password')) {
      emp.password = bcrypt.hashSync(emp.password, bcrypt.genSaltSync(10), null);
    }
  });
  Employee.prototype.comparePassword = function (pwd, cb) {
    bcrypt.compare(pwd, this.password, (err, isMatch) => {
      if (err) {
        return cb(err);
      }
      cb(null, isMatch);
    });
  };
  return Employee;
};