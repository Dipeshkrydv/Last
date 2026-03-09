import { sendEmail } from './email.js';

describe('sendEmail', () => {
  it('returns success: true and logs the correct message when SMTP is missing', async () => {
    const originalLog = console.log;
    let loggedMessage = '';
    console.log = (msg) => {
      loggedMessage += msg + '\n';
    };

    try {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: '<p>Test HTML</p>'
      });

      expect(result).toEqual({ success: true });
      expect(loggedMessage).toContain('To: test@example.com\nSubject: Test Subject\nText: Test Text');
    } finally {
      console.log = originalLog;
    }
  });
});
