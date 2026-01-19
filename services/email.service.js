import nodemailer from 'nodemailer';
import dotenv from 'dotenv';

dotenv.config();

// Create transporter (configure based on your SMTP settings)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,
  port: parseInt(process.env.SMTP_PORT) || 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  }
});

// Verify connection (optional, for testing)
if (process.env.NODE_ENV === 'development') {
  transporter.verify((error, success) => {
    if (error) {
      console.warn('⚠️  SMTP configuration issue:', error.message);
      console.warn('   Email notifications will be disabled');
    } else {
      console.log('✅ SMTP server ready');
    }
  });
}

export const sendTicketNotification = async (eventType, ticket) => {
  // Skip if SMTP not configured
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  try {
    const subjectMap = {
      created: `New Ticket: ${ticket.title}`,
      status_changed: `Ticket Status Updated: ${ticket.title}`,
      assignee_changed: `Ticket Assigned: ${ticket.title}`,
      commented: `New Comment on Ticket: ${ticket.title}`
    };

    const subject = subjectMap[eventType] || `Ticket Update: ${ticket.title}`;

    // Determine recipients
    const recipients = [];
    if (ticket.assignee_email && ticket.assignee_email !== ticket.reporter_email) {
      recipients.push(ticket.assignee_email);
    }
    if (ticket.reporter_email) {
      recipients.push(ticket.reporter_email);
    }

    if (recipients.length === 0) {
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">${subject}</h2>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Project:</strong> ${ticket.project_name}</p>
          <p><strong>Ticket ID:</strong> #${ticket.id}</p>
          <p><strong>Title:</strong> ${ticket.title}</p>
          <p><strong>Status:</strong> ${ticket.status}</p>
          <p><strong>Priority:</strong> ${ticket.priority}</p>
          ${ticket.assignee_name ? `<p><strong>Assigned to:</strong> ${ticket.assignee_name}</p>` : ''}
          ${ticket.due_date ? `<p><strong>Due Date:</strong> ${new Date(ticket.due_date).toLocaleDateString()}</p>` : ''}
        </div>
        ${ticket.description ? `<p>${ticket.description}</p>` : ''}
        <p style="margin-top: 20px;">
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket.id}" 
             style="background: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Ticket
          </a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients.join(', '),
      subject,
      html
    });
  } catch (error) {
    console.error('Failed to send email notification:', error);
    // Don't throw - email failure shouldn't break the API
  }
};

export const sendBreachNotification = async (ticket) => {
  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    return;
  }

  try {
    const recipients = [];
    if (ticket.assignee_email) {
      recipients.push(ticket.assignee_email);
    }

    // Also notify admin (you might want to fetch admin emails from DB)
    // For now, we'll just notify the assignee

    if (recipients.length === 0) {
      return;
    }

    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #dc3545;">⚠️ SLA Breach Alert</h2>
        <div style="background: #fff3cd; padding: 15px; border-radius: 5px; margin: 20px 0; border-left: 4px solid #dc3545;">
          <p><strong>Ticket:</strong> ${ticket.title}</p>
          <p><strong>Ticket ID:</strong> #${ticket.id}</p>
          <p><strong>Project:</strong> ${ticket.project_name}</p>
          <p><strong>Due Date:</strong> ${ticket.due_date ? new Date(ticket.due_date).toLocaleString() : 'N/A'}</p>
          <p><strong>Current Status:</strong> ${ticket.status}</p>
          <p style="color: #dc3545; font-weight: bold;">This ticket has passed its due date and is marked as BREACHED.</p>
        </div>
        <p>
          <a href="${process.env.FRONTEND_URL || 'http://localhost:5173'}/tickets/${ticket.id}" 
             style="background: #dc3545; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
            View Ticket
          </a>
        </p>
      </div>
    `;

    await transporter.sendMail({
      from: process.env.SMTP_FROM || process.env.SMTP_USER,
      to: recipients.join(', '),
      subject: `🚨 SLA Breach: ${ticket.title}`,
      html
    });
  } catch (error) {
    console.error('Failed to send breach notification:', error);
  }
};
