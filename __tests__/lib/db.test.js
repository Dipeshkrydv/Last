import { connectDB } from '../../lib/db';

jest.mock('sequelize');
jest.mock('../../lib/db', () => {
  const originalModule = jest.requireActual('../../lib/db');
  return {
    __esModule: true,
    ...originalModule,
    default: {
      authenticate: jest.fn().mockResolvedValue(),
    },
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

  it('should return undefined when successful', async () => {
    const result = await connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
