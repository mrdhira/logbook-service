require('dotenv').config();

module.exports = {
  development: {
    username: process.env.DB_USER || 'taralite',
    password: process.env.DB_PASS || '',
    database: process.env.DB_NAME || 'logbook',
    host: process.env.DB_HOST || '127.0.0.1',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    logging: console.log,
  },
  test: {
    username: process.env.DB_TEST_USER || 'postgres',
    password: process.env.DB_TEST_PASS || 'postgres',
    database: process.env.DB_TEST || 'postgres',
    host: process.env.DB_HOST || 'localhost',
    port: process.env.DB_PORT || '5432',
    dialect: 'postgres',
    logging: false,
  },
  production: {
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres',
    logging: false,
  },
};
