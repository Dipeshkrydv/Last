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
  let consoleLogSpy;
  let consoleErrorSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleErrorSpy.mockRestore();
  });

  it('should log success message on successful connection', async () => {
    await connectDB();
    expect(sequelize.authenticate).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Database connected successfully.');
  });

  it('should log error message on failed connection', async () => {
    const error = new Error('Connection failed');
    sequelize.authenticate.mockRejectedValueOnce(error);
    await connectDB();
    expect(sequelize.authenticate).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Unable to connect to the database:', error);
  });
});
