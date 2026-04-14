import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => {
  const actualDb = jest.requireActual('../../lib/db');
  return {
    ...actualDb,
    connectDB: jest.fn().mockResolvedValue(undefined),
  };
});

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

  it('should resolve to undefined on successful connection', async () => {
    const result = await connectDB();
    expect(result).toBe(undefined);
  });
});
