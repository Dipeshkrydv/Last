import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let loggedMessage = '';

  beforeEach(() => {
    originalLog = console.log;
    console.log = (msg) => {
      loggedMessage = msg;
    };
  });

  afterEach(() => {
    console.log = originalLog;
    loggedMessage = '';
  });

  it('sendEmail returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(loggedMessage).toBe('Email sent to test@example.com with subject: Test Subject (placeholder)');
  });
});
