require('dotenv').config();
const { Sequelize } = require('sequelize');

const cls = require('cls-hooked');
const namespace = cls.createNamespace('restaurantNamespace');

Sequelize.useCLS(namespace);

const sequelize = new Sequelize(
  process.env.DATABASE_NAME,
  process.env.DATABASE_USERNAME,
  process.env.DATABASE_PASSWORD,
  {
    host: process.env.DATABASE_HOST,
    dialect: 'postgres',
    dialectOptions: {
      ssl: {
        require: 'true',
      },
    },
  }
);

const testDbConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('Connection has been established successfully.');
    // add to the sync() { force: true } or { alter: true } if you have pre data in you database. Note: { force: true } will delete all you data!! but it also will allow sequlize to work properly.
    sequelize
      .sync()
      .then(() => console.log('Models synced successfully!'))
      .catch((error) => console.error('Error syncing models:', error));
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};


module.exports = { sequelize, testDbConnection };
