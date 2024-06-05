import nodemailer from 'nodemailer'
// Create a transporter object using SMTP transport

export default async function handler(req, res) {
const transporter = nodemailer.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
      user: process.env.USER,
      pass: process.env.PASS,
    },
});

try {
    // Send email
    await transporter.sendMail({
      from: process.env.USER,
      to: req.body.to,
      subject: req.body.subject,
      text: req.body.text,
    });

    res.status(200).json({ message: 'Email sent successfully' });
  } catch (error) {
    console.error('Error sending email:', error);
    res.status(500).json({ message: 'Failed to send email' });
  }
}
