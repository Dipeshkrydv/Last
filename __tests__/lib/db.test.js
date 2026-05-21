import { connectDB, ensureDbConfig } from '../../lib/db';
import { Sequelize } from 'sequelize';

jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(),
  };
  return {
    Sequelize: jest.fn(() => mSequelize),
  };
});

describe('db.js', () => {
  let consoleSpy;
  let errorSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
  });

  describe('connectDB', () => {
    it('should log success message on successful authentication', async () => {
      await connectDB();
      expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
    });

    it('should log error message on failed authentication', async () => {
      const error = new Error('Connection failed');
      const sequelizeInstance = new Sequelize();
      sequelizeInstance.authenticate.mockRejectedValueOnce(error);

      await connectDB();
      expect(errorSpy).toHaveBeenCalledWith('Unable to connect to the database:', error);
    });
  });

  describe('ensureDbConfig', () => {
    it('should return true', async () => {
      const result = await ensureDbConfig();
      expect(result).toBe(true);
    });
  });
});
