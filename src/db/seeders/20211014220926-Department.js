'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert (
    'Departments',
    [
      {
        dep_name: 'Managment',
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Department', null, {}),
}


