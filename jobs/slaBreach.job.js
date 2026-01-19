import cron from 'node-cron';
import pool from '../config/database.js';
import { sendBreachNotification } from '../services/email.service.js';

// Run every 5 minutes
cron.schedule('*/5 * * * *', async () => {
  try {
    console.log('🔍 Checking for SLA breaches...');

    // Find tickets that are breached but haven't been notified recently (within last hour)
    const [breachedTickets] = await pool.execute(
      `SELECT t.*, 
              p.name as project_name,
              r.name as reporter_name, r.email as reporter_email,
              a.name as assignee_name, a.email as assignee_email
       FROM tickets t
       LEFT JOIN projects p ON t.project_id = p.id
       LEFT JOIN users r ON t.reporter_id = r.id
       LEFT JOIN users a ON t.assignee_id = a.id
       WHERE t.due_date IS NOT NULL
         AND t.due_date < NOW()
         AND t.status NOT IN ('SOLVED', 'CLOSED')
         AND (
           t.is_breached = FALSE
           OR (t.is_breached = TRUE AND (
             t.last_breach_notified_at IS NULL
             OR t.last_breach_notified_at < DATE_SUB(NOW(), INTERVAL 1 HOUR)
           ))
         )`
    );

    for (const ticket of breachedTickets) {
      // Mark as breached
      await pool.execute(
        'UPDATE tickets SET is_breached = TRUE, last_breach_notified_at = NOW() WHERE id = ?',
        [ticket.id]
      );

      // Send notification
      await sendBreachNotification(ticket);

      console.log(`⚠️  Ticket #${ticket.id} marked as breached`);
    }

    if (breachedTickets.length > 0) {
      console.log(`✅ Processed ${breachedTickets.length} breached ticket(s)`);
    }
  } catch (error) {
    console.error('❌ Error in SLA breach check:', error);
  }
});

console.log('⏰ SLA breach monitoring job started (runs every 5 minutes)');
