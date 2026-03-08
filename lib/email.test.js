import { sendEmail } from './email.js';

describe('sendEmail', () => {
  let originalLog;

  beforeEach(() => {
    originalLog = console.log;
    process.env = {};
  });

  afterEach(() => {
    console.log = originalLog;
  });

  it('returns success: true and logs the correct message when SMTP config is missing', async () => {
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
    expect(loggedMessage).toEqual(`To: test@example.com\nSubject: Test Subject\nText: Test Text`);
  });
});
