'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Department extends Model {
    
    static associate(models) {
      // define association here
      Department.hasMany(models.Employee, {
        foreignKey: 'depId'
      });
      
    }
  };
  Department.init({
    dep_name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Department',
  });
  return Department;
};