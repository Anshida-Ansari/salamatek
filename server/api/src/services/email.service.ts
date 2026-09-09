import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Abstraction for email service
// Using a mock transporter or the provided SMTP config from environment variables
const createTransporter = () => {
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    return nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 587,
      secure: process.env.SMTP_PORT === '465', // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  // If no SMTP configuration is provided, use a mock stream transport for development
  // This will log the email instead of actually sending it.
  return nodemailer.createTransport({
    streamTransport: true,
    newline: 'windows',
    logger: true,
  });
};

const transporter = createTransporter();

export const sendContactEnquiryNotification = async (enquiry: {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}) => {
  try {
    const toEmail = process.env.CONTACT_EMAIL_RECIPIENT || 'info@salamatekgroup.com';
    
    const info = await transporter.sendMail({
      from: `"Salamatek Contact System" <${process.env.SMTP_FROM || 'noreply@salamatekgroup.com'}>`,
      to: toEmail,
      subject: `New Contact Enquiry: ${enquiry.subject}`,
      text: `
You have received a new contact enquiry from the Salamatek website.

Details:
-------------------------
Name: ${enquiry.name}
Email: ${enquiry.email}
Phone: ${enquiry.phone}
Subject: ${enquiry.subject}

Message:
${enquiry.message}
-------------------------

Please log in to the admin dashboard to manage this enquiry.
      `,
      html: `
        <h2>New Contact Enquiry</h2>
        <p>You have received a new contact enquiry from the Salamatek website.</p>
        <table style="border-collapse: collapse; width: 100%; max-width: 600px;">
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${enquiry.name}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${enquiry.email}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Phone:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${enquiry.phone}</td></tr>
          <tr><td style="padding: 8px; border: 1px solid #ddd;"><strong>Subject:</strong></td><td style="padding: 8px; border: 1px solid #ddd;">${enquiry.subject}</td></tr>
        </table>
        <h3>Message:</h3>
        <p style="padding: 12px; background-color: #f9f9f9; border-left: 4px solid #8E2829;">
          ${enquiry.message.replace(/\n/g, '<br/>')}
        </p>
        <p>Please log in to the admin dashboard to manage this enquiry.</p>
      `,
    });

    console.log('Message sent: %s', info.messageId);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error('Error sending email notification:', error);
    return { success: false, error };
  }
};
