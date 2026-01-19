import TicketService from '../src/services/TicketService.js';
import {
  createTicketValidation,
  updateTicketValidation,
  getTicketValidation,
  getTicketsValidation,
  addCommentValidation,
  addTagValidation,
  addWatcherValidation,
  addRelationshipValidation,
  logTimeValidation
} from '../src/validators/ticket.validator.js';

export const getTickets = async (req, res, next) => {
  try {
    const tickets = await TicketService.getTickets(req.user, req.query);
    // Frontend expects response.data to be array
    res.json(tickets);
  } catch (error) {
    next(error);
  }
};

export const getTicketById = async (req, res, next) => {
  try {
    const ticket = await TicketService.getTicketById(req.user, req.params.id);
    // Frontend expects response.data to be the ticket object
    res.json(ticket);
  } catch (error) {
    next(error);
  }
};

export const createTicket = async (req, res, next) => {
  try {
    const ticket = await TicketService.createTicket(req.user, req.body);
    res.status(201).json({
      message: 'Ticket created successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const updateTicket = async (req, res, next) => {
  try {
    const ticket = await TicketService.updateTicket(req.user, req.params.id, req.body);
    res.json({
      message: 'Ticket updated successfully',
      data: ticket
    });
  } catch (error) {
    next(error);
  }
};

export const deleteTicket = async (req, res, next) => {
  try {
    await TicketService.deleteTicket(req.user, req.params.id);
    res.json({ message: 'Ticket deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const addComment = async (req, res, next) => {
  try {
    const comment = await TicketService.addComment(req.user, req.params.id, req.body);
    res.status(201).json({
      message: 'Comment added successfully',
      data: comment
    });
  } catch (error) {
    next(error);
  }
};

export const addTag = async (req, res, next) => {
  try {
    await TicketService.addTag(req.user, req.params.id, req.body.tag_id);
    res.json({ message: 'Tag added successfully' });
  } catch (error) {
    next(error);
  }
};

export const removeTag = async (req, res, next) => {
  try {
    await TicketService.removeTag(req.user, req.params.id, req.params.tagId);
    res.json({ message: 'Tag removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const addWatcher = async (req, res, next) => {
  try {
    await TicketService.addWatcher(req.user, req.params.id, req.body.user_id);
    res.json({ message: 'Watcher added successfully' });
  } catch (error) {
    next(error);
  }
};

export const removeWatcher = async (req, res, next) => {
  try {
    await TicketService.removeWatcher(req.user, req.params.id, req.params.userId);
    res.json({ message: 'Watcher removed successfully' });
  } catch (error) {
    next(error);
  }
};

export const addRelationship = async (req, res, next) => {
  try {
    await TicketService.addRelationship(
      req.user,
      req.params.id,
      req.body.related_ticket_id,
      req.body.relationship_type
    );
    res.json({ message: 'Relationship added successfully' });
  } catch (error) {
    next(error);
  }
};

export const logTime = async (req, res, next) => {
  try {
    const timeLog = await TicketService.logTime(req.user, req.params.id, req.body);
    res.status(201).json({
      message: 'Time logged successfully',
      data: timeLog
    });
  } catch (error) {
    next(error);
  }
};

export {
  createTicketValidation,
  updateTicketValidation,
  getTicketValidation,
  getTicketsValidation,
  addCommentValidation,
  addTagValidation,
  addWatcherValidation,
  addRelationshipValidation,
  logTimeValidation
};
