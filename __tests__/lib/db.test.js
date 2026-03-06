import { default as sequelize } from '../../lib/db';

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

  it('should be defined', () => {
    expect(sequelize).toBeDefined();
  });

  it('should have authenticate method', () => {
    expect(typeof sequelize.authenticate).toBe('function');
  });
});
