import { sendEmail } from './email';

describe('sendEmail', () => {
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('returns success: true and logs the correct message when SMTP is not configured', async () => {
    const originalEnv = process.env;
    process.env = { ...originalEnv, SMTP_HOST: '' };

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>',
    });

    expect(result).toEqual({ success: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('Email sent to test@example.com with subject: Test Subject (placeholder)');

    process.env = originalEnv;
  });
});
