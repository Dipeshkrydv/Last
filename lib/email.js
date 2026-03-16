import nodemailer from 'nodemailer';

export const sendEmail = async ({ to, subject, text, html }) => {
  try {
    const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD } = process.env;

    // Fallback for development if SMTP is not configured
    if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
      console.warn('SMTP configuration is missing. Logging email to console:');
      console.log(`Email sent to ${to} with subject: ${subject} (placeholder)`);
      return { success: true }; // Return object to prevent breaking flows
    }

    const transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: parseInt(SMTP_PORT, 10),
      secure: parseInt(SMTP_PORT, 10) === 465, // true for 465, false for other ports
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASSWORD,
      },
    });

    const info = await transporter.sendMail({
      from: `"Pustaklinu" <${SMTP_USER}>`,
      to,
      subject,
      text,
      html,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true };
  } catch (error) {
    console.error('Error sending email:', error);
    return { success: false, error: error.message };
  }
};

export default sendEmail;
