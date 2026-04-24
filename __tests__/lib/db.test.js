import { connectDB } from '../../lib/db';
import sequelize from 'sequelize';

jest.mock('sequelize', () => {
  return {
    Sequelize: jest.fn(() => ({
      authenticate: jest.fn().mockResolvedValue(),
    })),
  };
});

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should return undefined when successful', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
