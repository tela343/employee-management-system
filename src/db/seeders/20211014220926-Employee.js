'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => queryInterface.bulkInsert (
    'Employees',
    [
      {
        name: 'Jane Doe',
        national_id: 'janedoe@example.com',
        emp_code: 'EMP3245',
        phone: '0783836717',
        email: 'josh@gmail.com',
        password:'okayfine',
        dob: '03-12-1999',
        status: 'ACTIVE',
        position: "MANAGER",
        createdAt: new Date(),
        updatedAt: new Date()
      },
    ],
    {},
  ),
  down: (queryInterface, Sequelize) => queryInterface.bulkDelete('Users', null, {}),
}


