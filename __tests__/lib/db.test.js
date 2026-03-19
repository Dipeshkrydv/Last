import { connectDB } from '../../lib/db';

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

  it('should return undefined on success', async () => {
    const db = require('../../lib/db');
    jest.spyOn(db.default, 'authenticate').mockResolvedValueOnce();

    const result = await db.connectDB();
    expect(result).toBeUndefined();
  });

  it('should log connection message', async () => {
    const db = require('../../lib/db');
    jest.spyOn(db.default, 'authenticate').mockResolvedValueOnce();

    await db.connectDB();
    expect(consoleSpy).toHaveBeenCalledWith('Database connected successfully.');
  });
});
