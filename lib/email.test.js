import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let originalWarn;

  beforeEach(() => {
    originalLog = console.log;
    originalWarn = console.warn;
    console.log = jest.fn();
    console.warn = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
    console.warn = originalWarn;
  });

  it('sendEmail returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(console.log).toHaveBeenCalledWith('Email content suppressed for security. (placeholder)');
  });
});
