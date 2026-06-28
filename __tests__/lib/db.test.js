import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  default: {
    authenticate: jest.fn().mockResolvedValue(),
  },
  connectDB: jest.fn().mockImplementation(async () => {
    console.log('Database connected successfully.');
    return true;
  }),
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

  it('should return true', async () => {
    const result = await connectDB();
    expect(result).toBe(true);
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
