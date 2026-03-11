import { sendEmail } from './email';

describe('sendEmail', () => {
  let originalLog;

  beforeEach(() => {
    originalLog = console.log;
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('returns success: true and logs the correct message', async () => {
    let loggedMessage = '';
    console.log = (msg) => {
      loggedMessage = msg;
    };

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(loggedMessage).toContain('To: test@example.com');
  });
});
