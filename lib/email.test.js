import { sendEmail } from './email';

describe('sendEmail', () => {
  let originalConsoleLog;
  let originalConsoleWarn;

  beforeEach(() => {
    originalConsoleLog = console.log;
    originalConsoleWarn = console.warn;
    console.log = jest.fn();
    console.warn = jest.fn();
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;
  });

  afterEach(() => {
    console.log = originalConsoleLog;
    console.warn = originalConsoleWarn;
  });

  it('returns success: true and logs the correct message when SMTP is missing', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(console.log).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
