const nodemailer = require('nodemailer');

function getTransporter() {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587', 10);
  const user = process.env.MAIL_USER;
  const pass = process.env.MAIL_PASSWORD;

  if (!user || !pass) {
    const err = new Error(
      'Email not configured. Set MAIL_USER and MAIL_PASSWORD in .env. For Gmail, use an App Password: https://myaccount.google.com/apppasswords'
    );
    err.code = 'MAIL_NOT_CONFIGURED';
    throw err;
  }

  const secure = port === 465;
  const transporter = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
    connectionTimeout: 30000,
    greetingTimeout: 20000,
    family: 4,
  });

  return transporter;
}

module.exports = async ({ from, to, subject, text, html }) => {
  const transporter = getTransporter();
  const info = await transporter.sendMail({
    from: `inShare <${from}>`,
    to,
    subject,
    text,
    html,
  });
  return info;
};
