import { POST } from '../route';

// Mock dependencies
jest.mock('@/models/index', () => ({
  Otp: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
  User: {
    findOne: jest.fn(),
  },
}));

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
}));

describe('POST /api/auth/otp/send', () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if email is missing', async () => {
    // Create a mock request object with no email in the body
    const req = {
      json: jest.fn().mockResolvedValue({}), // Missing 'email'
    };

    // Call the API route handler
    const response = await POST(req);

    // Parse the JSON response
    const data = await response.json();

    // Assertions
    expect(response.status).toBe(400);
    expect(data).toEqual({ error: 'Email is required' });
  });
});
