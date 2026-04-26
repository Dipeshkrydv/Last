import { connectDB } from '../../lib/db';
import { Sequelize } from 'sequelize';

jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(undefined),
  };
  return {
    Sequelize: jest.fn(() => mSequelize),
  };
});

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
  });

  it('should return undefined when connection is successful', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
