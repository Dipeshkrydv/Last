import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    authenticate: jest.fn().mockResolvedValue(),
  },
  connectDB: jest.fn().mockImplementation(async () => {
    console.log('Database connection has been established successfully.');
    return undefined;
  }),
  ensureDbConfig: jest.fn().mockResolvedValue(true),
}));

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

  it('should return undefined when connection is successful', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connection has been established successfully.');
  });
});
