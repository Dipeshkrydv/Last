import { sendEmail } from './email.js';

describe('sendEmail', () => {
  it('returns success: true and logs the correct message', async () => {
    const consoleSpy = jest.spyOn(console, 'log').mockImplementation();

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleSpy).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');

    consoleSpy.mockRestore();
  });
});
