const { Sequelize } = require('sequelize');
require('dotenv').config();
const sequelize = new Sequelize(
  // process.env.DATABASE_NAME,
  // process.env.DATABASE_USERNAME,
  // process.env.DATABASE_PASSWORD,
  // {
  //   host: process.env.DATABASE_HOST,
  //   dialect: 'postgres',
  //   dialectOptions: {
  //     ssl: {
  //       require: 'true',
  //     },
  //   },
  // }
  process.env.LOCAL_DATABASE_NAME,
  process.env.LOCAL_DATABASE_USERNAME,
  process.env.LOCAL_DATABASE_PASSWORD,
  {
    host: process.env.LOCAL_DATABASE_HOST,
    dialect: 'postgres',
  }
);

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // add to the sync() { force: true } or { alter: true } if you have pre data in you database. Note: { force: true } will delete all you data!! but it also will allow sequlize to work properly.
    sequelize
      .sync({ force: true })
      .then(() => console.log('Models synced successfully!'))
      .catch((error) => console.error('Error syncing models:', error));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

// redis configuration
const redis = require('redis')

const redisClient = redis.createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    }
}).on('error', error => console.log('Redis Client Error', error)).connect();

module.exports = { sequelize, testDbConnection, redisClient };
