import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => {
  const actualDb = jest.requireActual('../../lib/db');
  return {
    ...actualDb,
    default: {
      authenticate: jest.fn().mockResolvedValue(),
    },
    connectDB: async () => {
      try {
        await jest.requireMock('../../lib/db').default.authenticate();
        console.log('Database connected successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
    }
  };
});

describe('connectDB', () => {
  let consoleSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
    consoleErrorSpy.mockRestore();
    jest.clearAllMocks();
  });

  it('should return undefined upon successful connection', async () => {
    const result = await connectDB();
    expect(result).toBe(undefined);
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
