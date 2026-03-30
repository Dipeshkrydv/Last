import { describe, it, expect, jest } from '@jest/globals';
import { sendEmail } from './email.js';

describe('sendEmail', () => {
  it('returns success: true and logs the correct message', async () => {
    // Mock console.log
    const consoleLogSpy = jest.spyOn(console, 'log').mockImplementation();
    const consoleWarnSpy = jest.spyOn(console, 'warn').mockImplementation();

    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text',
      html: '<p>Test HTML</p>'
    });

    expect(result).toEqual({ success: true });
    expect(consoleLogSpy).toHaveBeenCalledWith('To: test@example.com\nSubject: Test Subject\nText: Test Text');

    consoleLogSpy.mockRestore();
    consoleWarnSpy.mockRestore();
  });
});