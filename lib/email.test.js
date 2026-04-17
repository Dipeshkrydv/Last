import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let loggedMessage;

  beforeEach(() => {
    originalLog = console.log;
    loggedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
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
    expect(loggedMessage).toBe('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
