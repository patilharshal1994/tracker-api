import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Issue Tracker API',
      version: '1.0.0',
      description: 'RESTful API for Issue Tracker application with role-based access control',
      contact: {
        name: 'API Support',
        email: 'support@issuetracker.com'
      },
      license: {
        name: 'ISC',
        url: 'https://opensource.org/licenses/ISC'
      }
    },
    servers: [
      {
        url: process.env.API_URL || 'http://localhost:3001',
        description: 'Development server'
      },
      {
        url: 'https://api.issuetracker.com',
        description: 'Production server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'JWT token obtained from /api/auth/login endpoint'
        }
      },
      schemas: {
        User: {
          type: 'object',
          required: ['name', 'email', 'role'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'User unique identifier'
            },
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER'],
              description: 'User role in the system'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Organization ID'
            },
            team_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Team ID'
            },
            phone: {
              type: 'string',
              nullable: true,
              description: 'User phone number'
            },
            designation: {
              type: 'string',
              nullable: true,
              description: 'User designation'
            },
            department: {
              type: 'string',
              nullable: true,
              description: 'User department'
            },
            specialty: {
              type: 'string',
              nullable: true,
              description: 'User specialty'
            },
            is_active: {
              type: 'boolean',
              default: true,
              description: 'Whether user is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'User creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'User last update timestamp'
            }
          }
        },
        Organization: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Organization unique identifier'
            },
            name: {
              type: 'string',
              description: 'Organization name'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Organization description'
            },
            is_active: {
              type: 'boolean',
              default: true,
              description: 'Whether organization is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Organization creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Organization last update timestamp'
            }
          }
        },
        Team: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Team unique identifier'
            },
            name: {
              type: 'string',
              description: 'Team name'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Organization ID'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Team description'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Team creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Team last update timestamp'
            }
          }
        },
        Project: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Project unique identifier'
            },
            name: {
              type: 'string',
              description: 'Project name'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Project description'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who created the project'
            },
            team_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Team ID'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Organization ID'
            },
            is_active: {
              type: 'boolean',
              default: true,
              description: 'Whether project is active'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Project creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Project last update timestamp'
            }
          }
        },
        Ticket: {
          type: 'object',
          required: ['project_id', 'title', 'type'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Ticket unique identifier'
            },
            project_id: {
              type: 'string',
              format: 'uuid',
              description: 'Project ID'
            },
            type: {
              type: 'string',
              enum: ['TASK', 'BUG', 'ISSUE', 'SUGGESTION'],
              description: 'Ticket type'
            },
            title: {
              type: 'string',
              description: 'Ticket title'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Ticket description'
            },
            module: {
              type: 'string',
              nullable: true,
              description: 'Module name'
            },
            reporter_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who reported the ticket'
            },
            assignee_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'User ID assigned to the ticket'
            },
            branch_name: {
              type: 'string',
              nullable: true,
              description: 'Git branch name'
            },
            scenario: {
              type: 'string',
              nullable: true,
              description: 'Ticket scenario'
            },
            start_date: {
              type: 'string',
              format: 'date',
              nullable: true,
              description: 'Ticket start date'
            },
            due_date: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Ticket due date'
            },
            duration_hours: {
              type: 'integer',
              nullable: true,
              description: 'Expected duration in hours'
            },
            breach_threshold_minutes: {
              type: 'integer',
              default: 0,
              description: 'SLA breach threshold in minutes'
            },
            status: {
              type: 'string',
              enum: ['CREATED', 'IN_PROGRESS', 'DEPENDENCY', 'HOLD', 'SOLVED', 'CLOSED'],
              default: 'CREATED',
              description: 'Ticket status'
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              default: 'MEDIUM',
              description: 'Ticket priority'
            },
            is_breached: {
              type: 'boolean',
              default: false,
              description: 'Whether SLA is breached'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Ticket creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Ticket last update timestamp'
            }
          }
        },
        Comment: {
          type: 'object',
          required: ['ticket_id', 'comment_text'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Comment unique identifier'
            },
            ticket_id: {
              type: 'string',
              format: 'uuid',
              description: 'Ticket ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who created the comment'
            },
            comment_text: {
              type: 'string',
              description: 'Comment text content'
            },
            mentioned_user_ids: {
              type: 'array',
              items: {
                type: 'string',
                format: 'uuid'
              },
              nullable: true,
              description: 'Array of mentioned user IDs'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Comment creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Comment last update timestamp'
            }
          }
        },
        Notification: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Notification unique identifier'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who receives the notification'
            },
            title: {
              type: 'string',
              description: 'Notification title'
            },
            message: {
              type: 'string',
              description: 'Notification message'
            },
            type: {
              type: 'string',
              description: 'Notification type'
            },
            related_entity_type: {
              type: 'string',
              nullable: true,
              description: 'Related entity type (e.g., ticket, comment)'
            },
            related_entity_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Related entity ID'
            },
            is_read: {
              type: 'boolean',
              default: false,
              description: 'Whether notification is read'
            },
            read_at: {
              type: 'string',
              format: 'date-time',
              nullable: true,
              description: 'Timestamp when notification was read'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Notification creation timestamp'
            }
          }
        },
        Tag: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Tag unique identifier'
            },
            name: {
              type: 'string',
              description: 'Tag name'
            },
            color: {
              type: 'string',
              default: '#1976d2',
              description: 'Tag color in hex format'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Tag description'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Tag creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Tag last update timestamp'
            }
          }
        },
        TicketTemplate: {
          type: 'object',
          required: ['name'],
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Template unique identifier'
            },
            name: {
              type: 'string',
              description: 'Template name'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Template description'
            },
            type: {
              type: 'string',
              enum: ['TASK', 'BUG', 'ISSUE', 'SUGGESTION'],
              default: 'TASK',
              description: 'Default ticket type'
            },
            priority: {
              type: 'string',
              enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
              default: 'MEDIUM',
              description: 'Default ticket priority'
            },
            default_title: {
              type: 'string',
              nullable: true,
              description: 'Default ticket title'
            },
            default_description: {
              type: 'string',
              nullable: true,
              description: 'Default ticket description'
            },
            default_module: {
              type: 'string',
              nullable: true,
              description: 'Default module name'
            },
            created_by: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who created the template'
            },
            is_shared: {
              type: 'boolean',
              default: false,
              description: 'Whether template is shared'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Template creation timestamp'
            },
            updated_at: {
              type: 'string',
              format: 'date-time',
              description: 'Template last update timestamp'
            }
          }
        },
        Activity: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'uuid',
              description: 'Activity unique identifier'
            },
            ticket_id: {
              type: 'string',
              format: 'uuid',
              description: 'Ticket ID'
            },
            user_id: {
              type: 'string',
              format: 'uuid',
              description: 'User ID who performed the activity'
            },
            activity_type: {
              type: 'string',
              description: 'Activity type (e.g., TICKET_CREATED, STATUS_CHANGED)'
            },
            old_value: {
              type: 'string',
              nullable: true,
              description: 'Old value (JSON string)'
            },
            new_value: {
              type: 'string',
              nullable: true,
              description: 'New value (JSON string)'
            },
            description: {
              type: 'string',
              nullable: true,
              description: 'Activity description'
            },
            created_at: {
              type: 'string',
              format: 'date-time',
              description: 'Activity creation timestamp'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            error: {
              type: 'string',
              description: 'Error message'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string'
                  },
                  param: {
                    type: 'string'
                  },
                  location: {
                    type: 'string'
                  }
                }
              },
              description: 'Validation errors array'
            }
          }
        },
        PaginationMeta: {
          type: 'object',
          properties: {
            totalItems: {
              type: 'integer',
              description: 'Total number of items'
            },
            totalPages: {
              type: 'integer',
              description: 'Total number of pages'
            },
            currentPage: {
              type: 'integer',
              description: 'Current page number'
            },
            itemsPerPage: {
              type: 'integer',
              description: 'Number of items per page'
            }
          }
        },
        LoginRequest: {
          type: 'object',
          required: ['email', 'password'],
          properties: {
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              description: 'User password'
            }
          }
        },
        LoginResponse: {
          type: 'object',
          properties: {
            user: {
              $ref: '#/components/schemas/User'
            },
            accessToken: {
              type: 'string',
              description: 'JWT access token'
            },
            refreshToken: {
              type: 'string',
              description: 'JWT refresh token'
            }
          }
        },
        RegisterRequest: {
          type: 'object',
          required: ['name', 'email', 'password'],
          properties: {
            name: {
              type: 'string',
              description: 'User full name'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'User email address'
            },
            password: {
              type: 'string',
              format: 'password',
              minLength: 8,
              description: 'User password (minimum 8 characters)'
            },
            role: {
              type: 'string',
              enum: ['SUPER_ADMIN', 'ORG_ADMIN', 'TEAM_LEAD', 'USER'],
              default: 'USER',
              description: 'User role'
            },
            organization_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Organization ID'
            },
            team_id: {
              type: 'string',
              format: 'uuid',
              nullable: true,
              description: 'Team ID'
            }
          }
        }
      }
    },
    tags: [
      {
        name: 'Authentication',
        description: 'User authentication and authorization endpoints'
      },
      {
        name: 'Users',
        description: 'User management endpoints'
      },
      {
        name: 'Organizations',
        description: 'Organization management endpoints'
      },
      {
        name: 'Teams',
        description: 'Team management endpoints'
      },
      {
        name: 'Projects',
        description: 'Project management endpoints'
      },
      {
        name: 'Tickets',
        description: 'Ticket/Issue management endpoints'
      },
      {
        name: 'Comments',
        description: 'Ticket comment endpoints'
      },
      {
        name: 'Notifications',
        description: 'User notification endpoints'
      },
      {
        name: 'Tags',
        description: 'Tag management endpoints'
      },
      {
        name: 'Templates',
        description: 'Ticket template endpoints'
      },
      {
        name: 'Activities',
        description: 'Ticket activity log endpoints'
      }
    ]
  },
  apis: [
    './routes/*.js',  // Route files with JSDoc annotations
    './controllers/*.js'  // Controller files (if adding annotations there)
  ]
};

const swaggerSpec = swaggerJsdoc(options);

export default swaggerSpec;
