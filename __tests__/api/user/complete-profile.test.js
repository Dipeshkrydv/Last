import { POST } from '@/app/api/user/complete-profile/route';

// Mock dependencies
jest.mock('next-auth', () => ({
  getServerSession: jest.fn(),
}));

jest.mock('@/app/api/auth/[...nextauth]/route', () => ({
  authOptions: {},
}));

jest.mock('@/models/index', () => ({
  User: {
    findOne: jest.fn(),
  },
}));

// Mock NextResponse completely
jest.mock('next/server', () => {
  return {
    NextResponse: {
      json: jest.fn().mockImplementation((body, init) => {
        return {
          status: init?.status || 200,
          json: async () => body,
        };
      }),
    },
  };
});

describe('POST /api/user/complete-profile', () => {
  let mockReq;
  let mockUser;

  beforeEach(() => {
    jest.clearAllMocks();

    // Set up default request mock
    mockReq = {
      json: jest.fn().mockResolvedValue({
        role: 'buyer',
        phone: '1234567890',
        city: 'Test City',
        latitude: 12.34,
        longitude: 56.78,
        state: 'Test State',
        province: 'Test Province',
        address: 'Test Address',
        pincode: '123456'
      })
    };

    // Set up default user model mock
    mockUser = {
      role: '',
      phone: '',
      city: '',
      latitude: '',
      longitude: '',
      state: '',
      province: '',
      address: '',
      pincode: '',
      save: jest.fn().mockResolvedValue(true)
    };
  });

  it('should successfully update user profile', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({
      user: { email: 'test@example.com' }
    });

    const { User } = require('@/models/index');
    User.findOne.mockResolvedValue(mockUser);

    const response = await POST(mockReq);
    const data = await response.json();

    expect(getServerSession).toHaveBeenCalled();
    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });

    expect(mockUser.role).toBe('buyer');
    expect(mockUser.phone).toBe('1234567890');
    expect(mockUser.city).toBe('Test City');
    expect(mockUser.latitude).toBe(12.34);
    expect(mockUser.longitude).toBe(56.78);
    expect(mockUser.state).toBe('Test State');
    expect(mockUser.province).toBe('Test Province');
    expect(mockUser.address).toBe('Test Address');
    expect(mockUser.pincode).toBe('123456');

    expect(mockUser.save).toHaveBeenCalled();

    expect(response.status).toBe(200);
    expect(data.success).toBe(true);
    expect(data.message).toBe('Profile updated successfully');
    expect(data.user).toEqual({
      role: 'buyer',
      phone: '1234567890'
    });
  });

  it('should return 401 if user is not authenticated', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue(null); // No session

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 401 if user email is missing from session', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: {} }); // Session without email

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 400 for invalid role', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } });

    mockReq.json.mockResolvedValue({
      role: 'admin', // Invalid role
      phone: '1234567890',
      city: 'Test City',
      latitude: 12.34,
      longitude: 56.78
    });

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid role selected');
  });

  it('should return 400 for invalid phone length', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } });

    mockReq.json.mockResolvedValue({
      role: 'buyer',
      phone: '12345', // Short phone
      city: 'Test City',
      latitude: 12.34,
      longitude: 56.78
    });

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Valid phone number is required');
  });

  it('should return 400 if coordinates are missing', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } });

    mockReq.json.mockResolvedValue({
      role: 'buyer',
      phone: '1234567890',
      city: 'Test City',
      // Missing latitude & longitude
    });

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Location coordinates are required');
  });

  it('should return 404 if user is not found in database', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'notfound@example.com' } });

    const { User } = require('@/models/index');
    User.findOne.mockResolvedValue(null); // User not found

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBe('User not found');
  });

  it('should handle SequelizeUniqueConstraintError (phone already registered)', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } });

    const { User } = require('@/models/index');
    User.findOne.mockResolvedValue(mockUser);

    const error = new Error('Validation error');
    error.name = 'SequelizeUniqueConstraintError';
    mockUser.save.mockRejectedValue(error);

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('This phone number is already registered with another account.');
  });

  it('should return 500 for generic internal server error', async () => {
    const { getServerSession } = require('next-auth');
    getServerSession.mockResolvedValue({ user: { email: 'test@example.com' } });

    const { User } = require('@/models/index');
    User.findOne.mockRejectedValue(new Error('Database explosion')); // Generic error

    const response = await POST(mockReq);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');
  });
});
