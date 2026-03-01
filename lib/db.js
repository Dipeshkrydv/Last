import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const globalForSequelize = global;

const sequelize =
  globalForSequelize.sequelize ||
  new Sequelize(
    process.env.DB_NAME || 'pustaklinu',
    process.env.DB_USER || 'root',
    process.env.DB_PASSWORD || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      dialectModule: mysql2,
      logging: false,
    }
  );

if (process.env.NODE_ENV !== 'production') {
  globalForSequelize.sequelize = sequelize;
}

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connection has been established successfully.');
    return true;
  } catch (error) {
    console.error('Unable to connect to the database:', error);
    return false;
  }
};

export default sequelize;
