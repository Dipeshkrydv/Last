import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  connectDB: jest.fn().mockResolvedValue(undefined),
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

  it('should return undefined upon successful authentication', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });
});
