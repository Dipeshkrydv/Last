import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let loggedMessages = [];

  beforeAll(() => {
    originalLog = console.log;
    console.log = (msg) => {
      loggedMessages.push(msg);
    };
  });

  afterAll(() => {
    console.log = originalLog;
  });

  afterEach(() => {
    loggedMessages = [];
  });

  it('sendEmail returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>',
    });

    expect(result).toEqual({ success: true });
    expect(loggedMessages).toContain('To: test@example.com\nSubject: Test Subject\nText: Test Text');
  });
});
