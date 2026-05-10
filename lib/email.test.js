import { sendEmail } from './email';

describe('sendEmail', () => {
  let originalLog;
  let originalWarn;
  let loggedMessage;
  let warnedMessage;

  beforeEach(() => {
    originalLog = console.log;
    originalWarn = console.warn;
    loggedMessage = '';
    warnedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
    };
    console.warn = (msg) => {
      warnedMessage = msg;
    };
    delete process.env.SMTP_HOST;
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
  });

  it('returns success: true and logs the correct message when SMTP is missing', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(warnedMessage).toBe('SMTP configuration is missing. Logging email to console:');
    expect(loggedMessage).toBe('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
