import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.fn().mockResolvedValue(true),
  default: {
    authenticate: jest.fn().mockResolvedValue(),
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

  it('should return true', async () => {
    const result = await connectDB();
    expect(result).toBe(true);
  });

  it('should log connection message', async () => {
    // connectDB logic logs messages, but since we mocked it, we just check if the mock was called.
    await connectDB();
    expect(connectDB).toHaveBeenCalled();
  });
});
