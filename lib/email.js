// lib/email.js
// This is a placeholder for your email service (e.g., Nodemailer, SendGrid)
// Replace with your actual email logic

export const sendEmail = async ({ to, subject, text, html }) => {
  console.log(`Email sent to ${to} with subject: ${subject} (placeholder)`);
  return { success: true };
};

export default sendEmail;
