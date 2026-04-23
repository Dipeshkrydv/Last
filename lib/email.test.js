import { sendEmail } from './email.js';

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
    // Ensure SMTP is "not configured" by clearing relevant env vars
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;
    delete process.env.SMTP_HOST;

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');

    // Restore env vars
    process.env.SMTP_HOST = SMTP_HOST;
    process.env.SMTP_PORT = SMTP_PORT;
    process.env.SMTP_USER = SMTP_USER;
    process.env.SMTP_PASSWORD = SMTP_PASSWORD;
  });
});
