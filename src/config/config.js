require('dotenv').config()

module.exports = {
  dev: {
    url: process.env.DEV_DB_URL,
    dialect: 'postgres',
  },
  test: {
    url: process.env.TEST_DB_URL,
    dialect: 'postgres',
  },
  prod: {
    url: process.env.PROD_DB_URL,
    dialect: 'postgres',
  },
}