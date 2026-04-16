import { connectDB } from '../../lib/db';
import { Sequelize } from 'sequelize';

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

  it('should return undefined upon successful authentication', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
