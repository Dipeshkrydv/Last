import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let consoleLogSpy;

  beforeEach(() => {
    consoleLogSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleLogSpy.mockRestore();
  });

  it('returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('To: test@example.com'));
    expect(consoleLogSpy).toHaveBeenCalledWith(expect.stringContaining('Subject: Test Subject'));
  });
});
