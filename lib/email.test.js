import { sendEmail } from './email';

describe('sendEmail', () => {
  it('should resolve successfully', async () => {
    const result = await sendEmail({
      to: 'test@example.com',
      subject: 'Test Subject',
      text: 'Test Text'
    });
    expect(result).toEqual({ success: true }); // Assuming it returns undefined on success
  });
});
