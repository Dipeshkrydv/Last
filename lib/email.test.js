import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;

  beforeEach(() => {
    originalLog = console.log;
    console.log = jest.fn();
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('returns success: true and logs the correct message', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(console.log).toHaveBeenCalledWith('Email sent to test@example.com with subject: Test Subject (placeholder)');
  });
});
