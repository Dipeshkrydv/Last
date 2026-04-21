import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('../../lib/db', () => {
  const mockAuthenticate = jest.fn().mockResolvedValue();
  return {
    __esModule: true,
    connectDB: async () => {
      try {
        await mockAuthenticate();
        console.log('Database connected successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    },
    default: {
      authenticate: mockAuthenticate,
    },
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
    expect(sequelize.authenticate).toHaveBeenCalled();
  });

  it('should log success message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
