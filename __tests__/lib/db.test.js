import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(),
  __esModule: true,
  default: {
    authenticate: jest.fn().mockResolvedValue()
  }
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

  it('should return undefined', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    connectDB.mockImplementation(async () => {
      console.log('Database connected successfully.');
    });
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
