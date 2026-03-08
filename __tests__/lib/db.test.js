import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('sequelize', () => {
  return {
    Sequelize: jest.fn().mockImplementation(() => ({
      authenticate: jest.fn().mockResolvedValue(),
    })),
  };
});

// Since the db module creates the sequelize instance on load,
// we don't mock the module itself, but we intercept the sequelize authenticate call.
jest.spyOn(sequelize, 'authenticate').mockResolvedValue();

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

  it('should log connection message', async () => {
    await connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
