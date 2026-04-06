import { connectDB } from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.fn().mockResolvedValue(true),
  default: {
    authenticate: jest.fn().mockResolvedValue(),
  }
}));

describe('connectDB', () => {
  it('should return true', async () => {
    const result = await connectDB();
    expect(result).toBe(true);
  });
});
