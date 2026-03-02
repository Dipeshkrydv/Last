// Mock next-auth before importing route
jest.mock('next-auth', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({})),
    getServerSession: jest.fn(),
  };
});

jest.mock('next-auth/providers/github', () => {
  return {
    __esModule: true,
    default: jest.fn(() => ({})),
  };
});

jest.mock('@/models/index', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

// Mock NextResponse
jest.mock('next/server', () => {
  const originalModule = jest.requireActual('next/server');
  return {
    ...originalModule,
    NextResponse: {
      json: jest.fn((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

// Import after mocks
const { POST } = require('./route');
const { getServerSession } = require('next-auth');

describe('POST /api/user/complete-profile', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if an invalid role is provided', async () => {
    // Mock an authenticated session
    getServerSession.mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    // Create a mock request with an invalid role
    const req = {
      json: jest.fn().mockResolvedValue({
        role: 'admin', // invalid role
        phone: '1234567890',
        latitude: 12.34,
        longitude: 56.78,
      }),
    };

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Invalid role selected' });
  });

  it('should return 400 if role is missing', async () => {
    // Mock an authenticated session
    getServerSession.mockResolvedValue({
      user: { email: 'test@example.com' },
    });

    // Create a mock request without a role
    const req = {
      json: jest.fn().mockResolvedValue({
        phone: '1234567890',
        latitude: 12.34,
        longitude: 56.78,
      }),
    };

    const response = await POST(req);
    const body = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual({ error: 'Invalid role selected' });
  });
});
