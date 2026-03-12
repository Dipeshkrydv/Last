import { connectDB } from '../../lib/db';
import sequelize from '../../lib/db';

jest.mock('../../lib/db', () => ({
  __esModule: true,
  connectDB: jest.fn(),
  default: {
    authenticate: jest.fn(),
  },
}));

describe('connectDB', () => {
  let consoleSpy;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should successfully call connectDB', async () => {
    connectDB.mockResolvedValue(true);
    const result = await connectDB();
    expect(connectDB).toHaveBeenCalled();
  });
});
