import TicketModel from '../models/TicketModel.js';
import ProjectModel from '../models/ProjectModel.js';
import ActivityModel from '../models/ActivityModel.js';
import UserModel from '../models/UserModel.js';
import CommentModel from '../models/CommentModel.js';
import TagModel from '../models/TagModel.js';
import TicketTagModel from '../models/TicketTagModel.js';
import WatcherModel from '../models/WatcherModel.js';
import RelationshipModel from '../models/RelationshipModel.js';
import TimeLogModel from '../models/TimeLogModel.js';
import NotificationService from './NotificationService.js';
import { getPaginationParams, createPaginationMeta } from '../utils/pagination.js';
import { ROLES } from '../utils/roleHierarchy.js';

/**
 * Ticket Service - Business logic for ticket operations with activity logging
 */
class TicketService {
  /**
   * Get all tickets with filtering and pagination
   */
  async getTickets(currentUser, query = {}) {
    const pagination = getPaginationParams(query);
    const filters = {};

    // Apply filters
    if (query.project_id) filters.project_id = query.project_id;
    if (query.status) filters.status = query.status;
    if (query.priority) filters.priority = query.priority;
    if (query.type) filters.type = query.type;
    if (query.module) filters.module = query.module;
    if (query.assignee_id) filters.assignee_id = query.assignee_id;
    if (query.reporter_id) filters.reporter_id = query.reporter_id;
    if (query.is_breached !== undefined) filters.is_breached = query.is_breached === 'true';
    if (query.search) filters.search = query.search;

    // Handle assigned_to_me and reported_by_me filters
    if (query.assigned_to_me === 'true') {
      filters.assignee_id = currentUser.id;
    }
    if (query.reported_by_me === 'true') {
      filters.reporter_id = currentUser.id;
    }

    const tickets = await TicketModel.findWithFilters(currentUser, filters, pagination);
    const total = await TicketModel.countWithFilters(currentUser, filters);

    // Return with pagination metadata for consistency with other services
    return {
      data: tickets,
      pagination: createPaginationMeta(total, pagination.page, pagination.limit)
    };
  }

  /**
   * Get ticket by ID with all details
   */
  async getTicketById(currentUser, ticketId) {
    const ticket = await TicketModel.findByIdWithDetails(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && ticket.project_organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }
    if (currentUser.role === 'USER' && ticket.reporter_id !== currentUser.id && ticket.assignee_id !== currentUser.id) {
      throw new Error('Access denied');
    }

    // Get related data
    const tags = await TagModel.findByTicketId(ticketId);
    const watchersData = await WatcherModel.findByTicketId(ticketId);
    const comments = await CommentModel.findByTicketId(ticketId);
    const activities = await ActivityModel.findByTicketId(ticketId);
    const relationships = await RelationshipModel.findByTicketId(ticketId);
    const timeLogs = await TimeLogModel.findByTicketId(ticketId);

    // Extract watcher user IDs for frontend compatibility
    const watchers = watchersData.map(w => w.user_id);

    return {
      ...ticket,
      tags: tags.map(t => ({ id: t.id, name: t.name, color: t.color })),
      watchers,
      comments,
      activities,
      relationships,
      timeLogs,
      attachments: [] // Attachments will be added when file upload is implemented
    };
  }

  /**
   * Create a new ticket
   */
  async createTicket(currentUser, ticketData) {
    // Validate project exists and user has access
    const project = await ProjectModel.findById(ticketData.project_id);
    if (!project) {
      throw new Error('Project not found');
    }

    // Check access permissions
    if (currentUser.role === 'ORG_ADMIN' && project.organization_id !== currentUser.organization_id) {
      throw new Error('Access denied');
    }

    // Extract mentioned_users (if provided) - they will be notified after ticket creation
    const mentionedUsers = ticketData.mentioned_users || [];
    delete ticketData.mentioned_users; // Remove from ticketData as it's not a ticket field

    // Extract tags (if provided) - they will be added after ticket creation
    const tagIds = ticketData.tags || [];
    delete ticketData.tags; // Remove from ticketData as it's not a ticket field

    // Set reporter
    ticketData.reporter_id = currentUser.id;

    // Only include valid ticket fields to prevent SQL errors
    const validTicketFields = [
      'project_id', 'type', 'title', 'description', 'module', 'reporter_id',
      'assignee_id', 'branch_name', 'scenario', 'start_date', 'due_date',
      'duration_hours', 'breach_threshold_minutes', 'status', 'priority',
      'is_breached', 'last_breach_notified_at'
    ];
    
    const cleanTicketData = {};
    for (const key of validTicketFields) {
      // Only include if key exists and is not undefined
      if (ticketData.hasOwnProperty(key) && ticketData[key] !== undefined) {
        // For optional string fields, convert empty strings to null
        if (ticketData[key] === '' && ['description', 'module', 'branch_name', 'scenario'].includes(key)) {
          cleanTicketData[key] = null;
        } else {
          // Include the value (null is allowed for nullable columns)
          cleanTicketData[key] = ticketData[key];
        }
      }
    }
    
    // Ensure required fields are present
    if (!cleanTicketData.project_id) {
      throw new Error('Project ID is required');
    }
    if (!cleanTicketData.title || cleanTicketData.title.trim() === '') {
      throw new Error('Title is required');
    }
    if (!cleanTicketData.assignee_id) {
      throw new Error('Assignee ID is required');
    }

    // Debug logging
    if (process.env.NODE_ENV !== 'production') {
      console.log('Clean Ticket Data:', JSON.stringify(cleanTicketData, null, 2));
    }

    console.log('Clean Ticket Data:', cleanTicketData);
    // Create ticket
    const ticket = await TicketModel.create(cleanTicketData);

    // Log activity
    await ActivityModel.logTicketCreated(ticket.id, currentUser.id, ticket);

    // Create notification for assignee if assigned
    if (ticket.assignee_id && ticket.assignee_id !== currentUser.id) {
      await NotificationService.createNotification({
        user_id: ticket.assignee_id,
        title: 'New Ticket Assigned',
        message: `You have been assigned to ticket: ${ticket.title}`,
        type: 'ticket_assigned',
        related_entity_type: 'ticket',
        related_entity_id: ticket.id
      });
    }

    // Notify mentioned users
    if (mentionedUsers.length > 0) {
      for (const userId of mentionedUsers) {
        if (userId !== currentUser.id) {
          await NotificationService.createNotification({
            user_id: userId,
            title: 'Mentioned in Ticket',
            message: `${currentUser.name} mentioned you in ticket: ${ticket.title}`,
            type: 'mention',
            related_entity_type: 'ticket',
            related_entity_id: ticket.id
          });
        }
      }
    }

    // Add tags to ticket
    if (tagIds.length > 0) {
      for (const tagId of tagIds) {
        try {
          const tag = await TagModel.findById(tagId);
          if (tag) {
            // Check if already exists
            const exists = await TicketTagModel.exists(ticket.id, tagId);
            if (!exists) {
              await TicketTagModel.create({
                ticket_id: ticket.id,
                tag_id: tagId
              });
            }
          }
        } catch (error) {
          // Log error but don't fail ticket creation if tag doesn't exist
          console.error(`Failed to add tag ${tagId} to ticket:`, error);
        }
      }
    }

    return ticket;
  }

  /**
   * Update ticket
   */
  async updateTicket(currentUser, ticketId, updateData) {
    const existingTicket = await TicketModel.findById(ticketId);
    if (!existingTicket) {
      throw new Error('Ticket not found');
    }

    // Check access permissions
    if (currentUser.role === 'USER' && existingTicket.reporter_id !== currentUser.id) {
      throw new Error('Access denied');
    }

    // Only include valid ticket fields
    const validTicketFields = [
      'type', 'title', 'description', 'module', 'assignee_id', 'branch_name', 
      'scenario', 'start_date', 'due_date', 'duration_hours', 'breach_threshold_minutes', 
      'status', 'priority', 'is_breached', 'last_breach_notified_at'
    ];
    
    const cleanUpdateData = {};
    for (const key of validTicketFields) {
      if (updateData.hasOwnProperty(key) && updateData[key] !== undefined) {
        // For optional string fields, convert empty strings to null
        if (updateData[key] === '' && ['description', 'module', 'branch_name', 'scenario'].includes(key)) {
          cleanUpdateData[key] = null;
        } else {
          cleanUpdateData[key] = updateData[key];
        }
      }
    }

    // Log changes before update
    const changes = {};

    // Log status change
    if (cleanUpdateData.status && cleanUpdateData.status !== existingTicket.status) {
      await ActivityModel.logStatusChange(
        ticketId,
        currentUser.id,
        existingTicket.status,
        cleanUpdateData.status
      );
      changes.status = { old: existingTicket.status, new: cleanUpdateData.status };
    }

    // Log assignee change
    if (cleanUpdateData.assignee_id !== undefined && cleanUpdateData.assignee_id !== existingTicket.assignee_id) {
      const oldAssignee = cleanUpdateData.assignee_id !== existingTicket.assignee_id && existingTicket.assignee_id
        ? await UserModel.findById(existingTicket.assignee_id)
        : null;
      const newAssignee = cleanUpdateData.assignee_id
        ? await UserModel.findById(cleanUpdateData.assignee_id)
        : null;

      await ActivityModel.logAssigneeChange(
        ticketId,
        currentUser.id,
        existingTicket.assignee_id,
        cleanUpdateData.assignee_id,
        oldAssignee?.name || null,
        newAssignee?.name || null
      );

      // Notify new assignee
      if (newAssignee && cleanUpdateData.assignee_id !== currentUser.id) {
        await NotificationService.createNotification({
          user_id: cleanUpdateData.assignee_id,
          title: 'Ticket Assigned',
          message: `You have been assigned to ticket: ${existingTicket.title}`,
          type: 'ticket_assigned',
          related_entity_type: 'ticket',
          related_entity_id: ticketId
        });
      }
    }

    // Log priority change
    if (cleanUpdateData.priority && cleanUpdateData.priority !== existingTicket.priority) {
      await ActivityModel.logPriorityChange(
        ticketId,
        currentUser.id,
        existingTicket.priority,
        cleanUpdateData.priority
      );
    }

    // Log other field changes
    const fieldsToLog = ['title', 'description', 'module', 'type', 'due_date'];
    for (const field of fieldsToLog) {
      if (cleanUpdateData[field] !== undefined && cleanUpdateData[field] !== existingTicket[field]) {
        await ActivityModel.logFieldUpdate(
          ticketId,
          currentUser.id,
          field,
          existingTicket[field],
          cleanUpdateData[field]
        );
      }
    }

    const updatedTicket = await TicketModel.update(ticketId, cleanUpdateData);
    return updatedTicket;
  }

  /**
   * Delete ticket
   */
  async deleteTicket(currentUser, ticketId) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Only Super Admin, Org Admin, or ticket reporter can delete
    if (currentUser.role !== 'SUPER_ADMIN' && 
        currentUser.role !== 'ORG_ADMIN' && 
        ticket.reporter_id !== currentUser.id) {
      throw new Error('Access denied');
    }

    const deleted = await TicketModel.delete(ticketId);
    if (!deleted) {
      throw new Error('Failed to delete ticket');
    }

    return { success: true };
  }

  /**
   * Add comment to ticket
   */
  async addComment(currentUser, ticketId, commentData) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const comment = await CommentModel.create({
      ticket_id: ticketId,
      user_id: currentUser.id,
      comment_text: commentData.comment_text,
      mentioned_user_ids: commentData.mentioned_user_ids ? JSON.stringify(commentData.mentioned_user_ids) : null
    });

    // Log activity
    await ActivityModel.logCommentAdded(ticketId, currentUser.id, comment.id);

    // Notify mentioned users
    if (commentData.mentioned_user_ids && commentData.mentioned_user_ids.length > 0) {
      for (const userId of commentData.mentioned_user_ids) {
        if (userId !== currentUser.id) {
          await NotificationService.createNotification({
            user_id: userId,
            title: 'Mentioned in Comment',
            message: `${currentUser.name} mentioned you in a comment on ticket: ${ticket.title}`,
            type: 'mention',
            related_entity_type: 'comment',
            related_entity_id: comment.id
          });
        }
      }
    }

    // Notify ticket watchers
    const watchers = await WatcherModel.findByTicketId(ticketId);
    for (const watcher of watchers) {
      if (watcher.user_id !== currentUser.id) {
        await NotificationService.createNotification({
          user_id: watcher.user_id,
          title: 'New Comment',
          message: `${currentUser.name} added a comment to ticket: ${ticket.title}`,
          type: 'comment_added',
          related_entity_type: 'ticket',
          related_entity_id: ticketId
        });
      }
    }

    return CommentModel.findByIdWithUser(comment.id);
  }

  /**
   * Add tag to ticket
   */
  async addTag(currentUser, ticketId, tagId) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const tag = await TagModel.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    // Check if already exists
    const exists = await TicketTagModel.exists(ticketId, tagId);
    if (exists) {
      throw new Error('Tag already added to ticket');
    }

    await TicketTagModel.create({
      ticket_id: ticketId,
      tag_id: tagId
    });

    // Log activity
    await ActivityModel.logTagAdded(ticketId, currentUser.id, tagId, tag.name);

    return { success: true };
  }

  /**
   * Remove tag from ticket
   */
  async removeTag(currentUser, ticketId, tagId) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const tag = await TagModel.findById(tagId);
    if (!tag) {
      throw new Error('Tag not found');
    }

    const removed = await TagModel.removeFromTicket(ticketId, tagId);
    if (!removed) {
      throw new Error('Tag not found on ticket');
    }

    // Log activity
    await ActivityModel.logTagRemoved(ticketId, currentUser.id, tagId, tag.name);

    return { success: true };
  }

  /**
   * Add watcher to ticket
   */
  async addWatcher(currentUser, ticketId, userId) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    // Check if already watching
    const exists = await WatcherModel.exists(ticketId, userId);
    if (exists) {
      throw new Error('User is already watching this ticket');
    }

    await WatcherModel.create({
      ticket_id: ticketId,
      user_id: userId
    });

    const user = await UserModel.findById(userId);
    
    // Log activity
    await ActivityModel.logWatcherAdded(ticketId, currentUser.id, userId, user.name);

    return { success: true };
  }

  /**
   * Remove watcher from ticket
   */
  async removeWatcher(currentUser, ticketId, userId) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const user = await UserModel.findById(userId);
    const removed = await WatcherModel.deleteByTicketAndUser(ticketId, userId);
    
    if (!removed) {
      throw new Error('Watcher not found');
    }

    // Log activity
    await ActivityModel.logWatcherRemoved(ticketId, currentUser.id, userId, user.name);

    return { success: true };
  }

  /**
   * Add relationship between tickets
   */
  async addRelationship(currentUser, ticketId, relatedTicketId, relationshipType) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const relatedTicket = await TicketModel.findById(relatedTicketId);
    if (!relatedTicket) {
      throw new Error('Related ticket not found');
    }

    // Check if relationship already exists
    const exists = await RelationshipModel.exists(ticketId, relatedTicketId, relationshipType);
    if (exists) {
      throw new Error('Relationship already exists');
    }

    await RelationshipModel.create({
      ticket_id: ticketId,
      related_ticket_id: relatedTicketId,
      relationship_type: relationshipType,
      created_by: currentUser.id
    });

    // Log activity
    await ActivityModel.logRelationshipAdded(ticketId, currentUser.id, relatedTicketId, relationshipType);

    return { success: true };
  }

  /**
   * Log time for ticket
   */
  async logTime(currentUser, ticketId, timeData) {
    const ticket = await TicketModel.findById(ticketId);
    if (!ticket) {
      throw new Error('Ticket not found');
    }

    const timeLog = await TimeLogModel.create({
      ticket_id: ticketId,
      user_id: currentUser.id,
      hours: timeData.hours,
      description: timeData.description,
      logged_date: timeData.logged_date || new Date().toISOString().split('T')[0]
    });

    // Log activity
    await ActivityModel.logTimeLogged(ticketId, currentUser.id, timeData.hours, timeData.description);

    return timeLog;
  }
}

export default new TicketService();
