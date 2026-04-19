import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let loggedMessages;

  beforeEach(() => {
    originalLog = console.log;
    loggedMessages = [];
    console.log = (msg) => {
      loggedMessages.push(msg);
    };
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('sendEmail returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    // Check if any of the logged messages include the expected placeholder text
    const placeholderLogged = loggedMessages.some(msg =>
      msg.includes('Email sent to test@example.com with subject: Test Subject (placeholder)') ||
      msg.includes('To: test@example.com')
    );
    expect(placeholderLogged).toBe(true);
  });
});
