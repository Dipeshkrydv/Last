import { sendEmail } from './email.js';

describe('sendEmail', () => {
  it('returns success: true and logs the correct message', async () => {
    // Mock console.log
    const originalLog = console.log;
    let loggedMessage = '';
    console.log = jest.fn((msg) => {
      loggedMessage = msg;
    });

    try {
      const result = await sendEmail({
        to: 'test@example.com',
        subject: 'Test Subject',
        text: 'Test Text',
        html: '<p>Test HTML</p>'
      });

      expect(result).toEqual({ success: true });
      expect(console.log).toHaveBeenCalledWith(
        'To: test@example.com\nSubject: Test Subject\nText: Test Text'
      );
    } finally {
      console.log = originalLog;
    }
  });
});
