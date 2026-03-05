import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let originalWarn;

  beforeEach(() => {
    originalLog = console.log;
    originalWarn = console.warn;
    console.log = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
    jest.clearAllMocks();
  });

  it('sendEmail returns success: true and logs the correct message when SMTP is not configured', async () => {
    // Ensure no SMTP config is present for this test
    delete process.env.SMTP_HOST;
    delete process.env.SMTP_PORT;
    delete process.env.SMTP_USER;
    delete process.env.SMTP_PASSWORD;

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(console.warn).toHaveBeenCalledWith('SMTP configuration is missing. Logging email to console:');
    expect(console.log).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
