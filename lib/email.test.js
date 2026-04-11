import { sendEmail } from './email.js';

describe('email', () => {
  it('sendEmail returns success: true and logs the correct message', async () => {
    // Mock console.log
    const originalLog = console.log;
    let loggedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
    };

    try {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: '<p>Test HTML</p>'
      });

      expect(result).toEqual({ success: true });
      expect(loggedMessage).toBe('To: test@example.com\nSubject: Test Subject\nText: Test Text');
    } finally {
      console.log = originalLog;
    }
  });
});
