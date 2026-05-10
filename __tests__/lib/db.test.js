import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.requireActual('../../lib/db').connectDB,
  ensureDbConfig: jest.fn().mockResolvedValue(true),
  default: {
    authenticate: jest.fn().mockResolvedValue(),
  },
}));

jest.mock('sequelize', () => {
  const mSequelize = {
    authenticate: jest.fn().mockResolvedValue(),
  };
  return { Sequelize: jest.fn(() => mSequelize) };
});

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

  it('should return undefined upon successful database authentication', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
