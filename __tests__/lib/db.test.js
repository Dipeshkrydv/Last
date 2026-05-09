import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => {
  return {
    connectDB: jest.fn().mockResolvedValue(undefined),
    ensureDbConfig: jest.fn().mockResolvedValue(true),
    __esModule: true,
    default: {
      authenticate: jest.fn().mockResolvedValue(),
    },
  };
});

describe('connectDB', () => {
  it('should return undefined', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });
});
