import test from 'node:test';
import assert from 'node:assert';
import { sendEmail } from './email.js';

test('sendEmail returns success: true and logs the correct message', async (t) => {
  // Mock console.log
  const originalLog = console.log;
  let loggedMessage = '';
  console.log = (msg) => {
    loggedMessage = msg;
  };

  try {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    assert.deepStrictEqual(result, { success: true });
    assert.strictEqual(loggedMessage, 'Email sent to test@example.com with subject: Test Subject (placeholder)');
  } finally {
    console.log = originalLog;
  }
});
