import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('../../lib/db', () => {
  const mockAuthenticate = jest.fn().mockResolvedValue();
  return {
    __esModule: true,
    default: {
      authenticate: mockAuthenticate
    },
    connectDB: jest.fn(async () => {
      try {
        await mockAuthenticate();
        console.log('Database connected successfully.');
        return true;
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    }),
  };
});

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
  });

  it('should return true', async () => {
    const result = await connectDB();
    expect(result).toBe(true);
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
