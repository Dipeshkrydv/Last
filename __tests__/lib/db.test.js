import { connectDB, ensureDbConfig } from '../../lib/db';

jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(),
  };
  return {
    Sequelize: jest.fn(() => mSequelize)
  };
});

import { Sequelize } from 'sequelize';

describe('connectDB', () => {
  let consoleSpy;
  let errorSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    errorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    errorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should log connection message and return undefined on success', async () => {
    const mSequelize = new Sequelize();
    mSequelize.authenticate.mockResolvedValueOnce();

    const result = await connectDB();

    expect(mSequelize.authenticate).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
    expect(result).toBeUndefined();
  });

  it('should log error message and return undefined on failure', async () => {
    const error = new Error('Connection failed');
    const mSequelize = new Sequelize();
    mSequelize.authenticate.mockRejectedValueOnce(error);

    const result = await connectDB();

    expect(mSequelize.authenticate).toHaveBeenCalled();
    expect(errorSpy).toHaveBeenCalledWith('Unable to connect to the database:', error);
    expect(result).toBeUndefined();
  });
});

describe('ensureDbConfig', () => {
  it('should return true', async () => {
    const result = await ensureDbConfig();
    expect(result).toBe(true);
  });
});
