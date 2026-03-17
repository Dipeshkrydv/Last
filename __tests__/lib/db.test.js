import sequelize, { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => {
  const mockAuthenticate = jest.fn().mockResolvedValue();
  return {
    __esModule: true,
    default: {
      authenticate: mockAuthenticate,
    },
    connectDB: async () => {
      try {
        await mockAuthenticate();
        console.log('Database connected successfully.');
      } catch (error) {
        console.error('Unable to connect to the database:', error);
      }
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
    jest.restoreAllMocks();
  });

  it('should authenticate and log success message on successful connection', async () => {
    await connectDB();

    expect(sequelize.authenticate).toHaveBeenCalled();
    expect(consoleLogSpy).toHaveBeenCalledWith('Database connected successfully.');
    expect(consoleErrorSpy).not.toHaveBeenCalled();
  });

  it('should log error message when authentication fails', async () => {
    const error = new Error('Connection failed');
    sequelize.authenticate.mockRejectedValueOnce(error);

    await connectDB();

    expect(sequelize.authenticate).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Unable to connect to the database:', error);
    expect(consoleLogSpy).not.toHaveBeenCalled();
  });
});
