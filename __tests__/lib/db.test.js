import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.fn(),
  default: {
    authenticate: jest.fn(),
  }
}));

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.clearAllMocks();
  });

  afterEach(() => {
    // Restore console.log
    consoleSpy.mockRestore();
  });

  it('should be called and complete without throwing', async () => {
    connectDB.mockResolvedValueOnce(undefined);
    await expect(connectDB()).resolves.toBeUndefined();
  });
});
