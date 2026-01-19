import bcrypt from 'bcrypt';
import pool from '../config/database.js';
import dotenv from 'dotenv';

dotenv.config();

async function seed() {
  try {
    console.log('🌱 Starting database seed...');

    // Hash password for all users
    const passwordHash = await bcrypt.hash('password123', 10);

    // Clear existing data (optional - be careful in production!)
    await pool.execute('DELETE FROM ticket_comments');
    await pool.execute('DELETE FROM tickets');
    await pool.execute('DELETE FROM project_members');
    await pool.execute('DELETE FROM projects');
    await pool.execute('DELETE FROM users');
    await pool.execute('DELETE FROM teams');

    // Insert Teams
    const [teamResult] = await pool.execute('INSERT INTO teams (name) VALUES (?)', [
      'Development Team'
    ]);
    const teamId = teamResult.insertId;
    console.log('✅ Created team:', teamId);

    // Insert Users
    const users = [
      {
        name: 'Admin User',
        email: 'admin@tracker.com',
        role: 'ADMIN',
        team_id: teamId
      },
      {
        name: 'John Doe',
        email: 'user1@tracker.com',
        role: 'USER',
        team_id: teamId
      },
      {
        name: 'Jane Smith',
        email: 'user2@tracker.com',
        role: 'USER',
        team_id: teamId
      }
    ];

    const userIds = [];
    for (const user of users) {
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password_hash, role, team_id, is_active) VALUES (?, ?, ?, ?, ?, ?)',
        [user.name, user.email, passwordHash, user.role, user.team_id, true]
      );
      userIds.push(result.insertId);
      console.log(`✅ Created user: ${user.email} (ID: ${result.insertId})`);
    }

    const [adminId, user1Id, user2Id] = userIds;

    // Insert Project
    const [projectResult] = await pool.execute(
      'INSERT INTO projects (name, description, created_by, team_id) VALUES (?, ?, ?, ?)',
      [
        'Website Redesign',
        'Complete redesign of company website with modern UI/UX',
        adminId,
        teamId
      ]
    );
    const projectId = projectResult.insertId;
    console.log('✅ Created project:', projectId);

    // Add project members
    await pool.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [
      projectId,
      adminId
    ]);
    await pool.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [
      projectId,
      user1Id
    ]);
    await pool.execute('INSERT INTO project_members (project_id, user_id) VALUES (?, ?)', [
      projectId,
      user2Id
    ]);
    console.log('✅ Added project members');

    // Insert Sample Tickets
    const tickets = [
      {
        project_id: projectId,
        type: 'TASK',
        title: 'Design new homepage layout',
        description: 'Create wireframes and mockups for the new homepage',
        reporter_id: adminId,
        assignee_id: user1Id,
        status: 'IN_PROGRESS',
        priority: 'HIGH',
        due_date: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days from now
      },
      {
        project_id: projectId,
        type: 'BUG',
        title: 'Fix mobile menu not working',
        description: 'Mobile navigation menu is not responsive on iOS devices',
        reporter_id: user1Id,
        assignee_id: user2Id,
        status: 'CREATED',
        priority: 'MEDIUM',
        due_date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000) // 3 days from now
      },
      {
        project_id: projectId,
        type: 'SUGGESTION',
        title: 'Add dark mode support',
        description: 'Implement dark mode toggle for better user experience',
        reporter_id: user2Id,
        assignee_id: null,
        status: 'CREATED',
        priority: 'LOW',
        due_date: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000) // 14 days from now
      }
    ];

    for (const ticket of tickets) {
      const [result] = await pool.execute(
        `INSERT INTO tickets 
         (project_id, type, title, description, reporter_id, assignee_id, status, priority, due_date)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
        [
          ticket.project_id,
          ticket.type,
          ticket.title,
          ticket.description,
          ticket.reporter_id,
          ticket.assignee_id,
          ticket.status,
          ticket.priority,
          ticket.due_date
        ]
      );
      console.log(`✅ Created ticket: ${ticket.title} (ID: ${result.insertId})`);
    }

    console.log('\n✅ Database seed completed successfully!');
    console.log('\n📝 Test Credentials:');
    console.log('   Admin: admin@tracker.com / password123');
    console.log('   User1: user1@tracker.com / password123');
    console.log('   User2: user2@tracker.com / password123');
  } catch (error) {
    console.error('❌ Seed failed:', error);
    throw error;
  } finally {
    await pool.end();
    process.exit(0);
  }
}

seed();
