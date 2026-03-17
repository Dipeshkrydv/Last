import { sendEmail } from './email';

describe('sendEmail', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
    jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  it('returns success: true and logs the correct message when SMTP is missing', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv };
    delete process.env.SMTP_HOST; // Ensure SMTP is missing

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleSpy).toHaveBeenCalledWith('Email sent to test@example.com with subject: Test Subject (placeholder)');

    process.env = originalEnv;
  });
});
