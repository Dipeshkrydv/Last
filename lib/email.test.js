import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let originalWarn;

  beforeEach(() => {
    originalLog = console.log;
    originalWarn = console.warn;
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
  });

  it('returns success: true and logs the correct message when SMTP is not configured', async () => {
    let loggedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
    };

    const originalEnv = process.env.NODE_ENV;
    process.env.NODE_ENV = 'production';

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(loggedMessage).toBe('Email content suppressed for security. (placeholder)');

    process.env.NODE_ENV = originalEnv;
  });
});
