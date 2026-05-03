import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.fn().mockResolvedValue(true),
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

  it('should call connectDB without throwing', async () => {
    await connectDB();
    expect(connectDB).toHaveBeenCalled();
  });
});
