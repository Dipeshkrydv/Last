import { Sequelize } from 'sequelize';
import mysql2 from 'mysql2';

const sequelizeClient = () => {
  return new Sequelize(
    process.env.DB_NAME || 'pustaklinu',
    process.env.DB_USER || 'root',
    process.env.DB_PASS || '',
    {
      host: process.env.DB_HOST || 'localhost',
      dialect: 'mysql',
      dialectModule: mysql2,
      logging: false,
      pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
      }
    }
  );
};

const globalForSequelize = global;

const sequelize = globalForSequelize.sequelize || sequelizeClient();

if (process.env.NODE_ENV !== 'production') globalForSequelize.sequelize = sequelize;

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
