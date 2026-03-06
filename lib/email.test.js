import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation();
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('To: test@example.com'));
    expect(consoleSpy).toHaveBeenCalledWith(expect.stringContaining('Subject: Test Subject'));
  });
});
