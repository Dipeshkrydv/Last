import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;
  let loggedMessage;

  beforeEach(() => {
    originalLog = console.log;
    loggedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
    };
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
    // In test environment, sendEmail logs the raw email info
    expect(loggedMessage).toContain('To: test@example.com');
  });
});
