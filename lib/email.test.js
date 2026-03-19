import { sendEmail } from './email.js';

describe('email utility', () => {
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
      expect(loggedMessage).toEqual('Email sent to test@example.com with subject: Test Subject (placeholder)');
    } finally {
      console.log = originalLog;
    }
  });
});
