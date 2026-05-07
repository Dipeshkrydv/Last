import { sendEmail } from './email';

describe('sendEmail', () => {
  let consoleLogSpy;
  let consoleWarnSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
    consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });

  it('should return success: true and log the correct message when SMTP is not configured', async () => {
    // Ensuring SMTP is missing for this test
    delete process.env.SMTP_HOST;

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleWarnSpy).toHaveBeenCalledWith('SMTP configuration is missing. Logging email to console:');
    expect(consoleLogSpy).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
