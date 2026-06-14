import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

export const sendStatusUpdateEmail = async (userEmail, complaintId, newStatus) => {
  try {
    if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
      console.log(`[Email Mock] Would send email to ${userEmail} regarding complaint ${complaintId} status: ${newStatus}`);
      return;
    }

    const transporter = nodemailer.createTransport({
      service: 'gmail', // You can change this to any provider
      auth: {
        user: process.env.SMTP_EMAIL,
        pass: process.env.SMTP_PASSWORD,
      },
    });

    const mailOptions = {
      from: process.env.SMTP_EMAIL,
      to: userEmail,
      subject: `[Urban Eye] Complaint Status Update`,
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #1e3a5f;">Urban Eye — Status Update</h2>
          <p>Your complaint (ID: <strong>${complaintId}</strong>) has been reviewed by a city official.</p>
          <p>New Status: <strong style="color: ${newStatus === 'Resolved' ? '#16a34a' : newStatus === 'In Progress' ? '#d97706' : '#2563eb'}">${newStatus}</strong></p>
          <p>${newStatus === 'Resolved' ? '✅ Great news! Your reported issue has been resolved. Thank you for helping improve your city!' : '🔧 Officials are actively working on your reported issue. We appreciate your patience.'}</p>
          <hr style="margin: 24px 0; border-color: #e2e8f0;" />
          <p style="color: #64748b; font-size: 12px;">This email was sent by <strong>Urban Eye</strong> — Smart Civic Complaint Management.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Email sent to ${userEmail}`);
  } catch (error) {
    console.error('Error sending email:', error);
  }
};
