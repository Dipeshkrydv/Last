import { sendEmail } from './email.js';

describe('sendEmail utility', () => {
  let consoleSpy;

  beforeEach(() => {
    consoleSpy = jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  afterEach(() => {
    consoleSpy.mockRestore();
  });

  it('sendEmail returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    // Check if any of the calls contains the "To: " string indicating raw email dump or placeholder
    const loggedCalls = consoleSpy.mock.calls.map(call => call[0]);
    const hasLog = loggedCalls.some(log => log && typeof log === 'string' && (log.includes('To: test@example.com') || log.includes('Email sent to')));
    expect(hasLog).toBe(true);
  });
});
