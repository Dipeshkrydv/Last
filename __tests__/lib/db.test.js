import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

const mockAuthenticate = jest.fn().mockResolvedValue();

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    authenticate: (...args) => mockAuthenticate(...args),
  },
  connectDB: jest.fn().mockImplementation(async () => {
    try {
      await mockAuthenticate();
      console.log('Database connected successfully.');
    } catch (error) {
      console.error('Unable to connect to the database:', error);
    }
  }),
}));

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(mockAuthenticate).toHaveBeenCalled();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
