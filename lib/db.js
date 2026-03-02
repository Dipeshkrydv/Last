import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

// Setup database connection
const sequelize = new Sequelize(
  process.env.DB_NAME || 'pustaklinu',
  process.env.DB_USER || 'root',
  process.env.DB_PASS || '',
  {
    host: process.env.DB_HOST || 'localhost',
    dialect: 'mysql',
    dialectModule: mysql2,
    logging: false,
  }
);

export const connectDB = async () => {
  try {
    await sequelize.authenticate();
    console.log('Database connected successfully.');
  } catch (error) {
    console.error('Unable to connect to the database:', error);
  }
};

export const ensureDbConfig = async () => {
  return true;
};

export default sequelize;
