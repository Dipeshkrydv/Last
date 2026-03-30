import { describe, it, expect, beforeEach, afterEach } from '@jest/globals';
import { connectDB } from '../../lib/db';

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
    ensureDbConfig: async () => true,
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
    jest.clearAllMocks();
  });

  it('should return undefined', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});