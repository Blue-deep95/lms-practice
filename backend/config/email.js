const nodemailer = require('nodemailer');

const sendEmail = async ({ to, subject, text, html }) => {
  const emailUser = process.env.EMAIL_USER;
  const emailPass = process.env.EMAIL_PASS;

  // Graceful fallback to console simulator if credentials are not filled in yet
  if (!emailUser || !emailPass || emailUser === 'your-email@gmail.com' || emailPass === 'your-app-password') {
    console.log(`\n==================================================`);
    console.log(`[EMAIL SIMULATOR - NO CREDENTIALS IN .env]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Body (text): ${text}`);
    console.log(`==================================================\n`);
    return { success: true, simulated: true };
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: emailUser,
      pass: emailPass
    }
  });

  const mailOptions = {
    from: `"LearnSphere LMS" <${emailUser}>`,
    to,
    subject,
    text,
    html
  };

  const info = await transporter.sendMail(mailOptions);
  return info;
};

module.exports = sendEmail;
