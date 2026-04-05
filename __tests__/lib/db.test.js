import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('sequelize', () => {
  return {
    Sequelize: jest.fn().mockImplementation(() => ({
      authenticate: jest.fn().mockResolvedValue(),
    })),
  };
});

// Since the db is initialized right away, we have to mock it. The memory says: "When testing database connection logic (connectDB in lib/db.js), mock the sequelize module (e.g., returning { Sequelize: jest.fn(() => ({ authenticate: jest.fn().mockResolvedValue() })) }) instead of mocking the lib/db module itself to correctly verify the connection flow."
describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    // Spy on console.log
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    // Mock the authenticate method on the default export which is the sequelize instance
    sequelize.authenticate = jest.fn().mockResolvedValue();
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
