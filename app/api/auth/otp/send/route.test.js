import { POST } from './route';
import { User, Otp } from '@/models/index';
import { sendEmail } from '@/lib/email';
import crypto from 'crypto';

jest.mock('@/models/index', () => ({
  User: {
    findOne: jest.fn(),
  },
  Otp: {
    findOne: jest.fn(),
    create: jest.fn(),
  },
}));

jest.mock('@/lib/email', () => ({
  sendEmail: jest.fn(),
}));

jest.mock('crypto', () => ({
  randomInt: jest.fn(),
}));

describe('POST /api/auth/otp/send', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return 400 if user already exists', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'test@example.com' }),
    };

    User.findOne.mockResolvedValue({ id: 1, email: 'test@example.com' });

    const response = await POST(req);
    const responseData = await response.json();

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'test@example.com' } });
    expect(response.status).toBe(400);
    expect(responseData.error).toBe('User already exists with this email');
  });

  it('should return 400 if email is not provided', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({}),
    };

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(400);
    expect(responseData.error).toBe('Email is required');
  });

  it('should create new OTP and send email if user does not exist', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'new@example.com' }),
    };

    User.findOne.mockResolvedValue(null);
    Otp.findOne.mockResolvedValue(null);
    Otp.create.mockResolvedValue(true);
    crypto.randomInt.mockReturnValue(123456);
    sendEmail.mockResolvedValue({ success: true });
    sendEmail.mockResolvedValue({ success: true });

    const response = await POST(req);
    const responseData = await response.json();

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
    expect(crypto.randomInt).toHaveBeenCalledWith(100000, 999999);
    expect(Otp.findOne).toHaveBeenCalledWith({ where: { email: 'new@example.com' } });
    expect(Otp.create).toHaveBeenCalledWith(expect.objectContaining({
      email: 'new@example.com',
      otp: '123456',
    }));
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'new@example.com',
      subject: 'Your Verification Code - Pustaklinu',
      text: expect.stringContaining('123456'),
      html: expect.stringContaining('123456')
    }));
    expect(response.status).toBe(200);
    expect(responseData.message).toBe('OTP sent successfully');
  });

  it('should update existing OTP and send email if user does not exist but OTP does', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'existingotp@example.com' }),
    };

    const mockOtpUpdate = jest.fn().mockResolvedValue(true);

    User.findOne.mockResolvedValue(null);
    Otp.findOne.mockResolvedValue({ update: mockOtpUpdate });
    crypto.randomInt.mockReturnValue(654321);
    sendEmail.mockResolvedValue({ success: true });

    const response = await POST(req);
    const responseData = await response.json();

    expect(User.findOne).toHaveBeenCalledWith({ where: { email: 'existingotp@example.com' } });
    expect(crypto.randomInt).toHaveBeenCalledWith(100000, 999999);
    expect(Otp.findOne).toHaveBeenCalledWith({ where: { email: 'existingotp@example.com' } });
    expect(mockOtpUpdate).toHaveBeenCalledWith(expect.objectContaining({
      otp: '654321',
    }));
    expect(sendEmail).toHaveBeenCalledWith(expect.objectContaining({
      to: 'existingotp@example.com',
      subject: 'Your Verification Code - Pustaklinu',
      text: expect.stringContaining('654321'),
      html: expect.stringContaining('654321')
    }));
    expect(response.status).toBe(200);
    expect(responseData.message).toBe('OTP sent successfully');
  });

  it('should return 500 if email fails to send', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'fail@example.com' }),
    };

    User.findOne.mockResolvedValue(null);
    Otp.findOne.mockResolvedValue(null);
    Otp.create.mockResolvedValue(true);
    crypto.randomInt.mockReturnValue(111111);
    sendEmail.mockResolvedValue({ success: false });

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Failed to send email. Please check server configuration.');
  });

  it('should return 500 if an exception is thrown', async () => {
    const req = {
      json: jest.fn().mockResolvedValue({ email: 'error@example.com' }),
    };

    User.findOne.mockRejectedValue(new Error('Database error'));

    // Suppress console.error for this test
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    const response = await POST(req);
    const responseData = await response.json();

    expect(response.status).toBe(500);
    expect(responseData.error).toBe('Internal server error');

    consoleSpy.mockRestore();
  });
});
