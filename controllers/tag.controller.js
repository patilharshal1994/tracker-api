import pool from '../config/database.js';

export const getTags = async (req, res, next) => {
  try {
    const [tags] = await pool.execute(
      'SELECT * FROM tags ORDER BY name ASC'
    );
    res.json({ data: tags });
  } catch (error) {
    next(error);
  }
};

export const createTag = async (req, res, next) => {
  try {
    const { name, color } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Tag name is required' });
    }

    const [result] = await pool.execute(
      'INSERT INTO tags (name, color) VALUES (?, ?)',
      [name, color || null]
    );

    const [newTag] = await pool.execute(
      'SELECT * FROM tags WHERE id = ?',
      [result.insertId]
    );

    res.status(201).json({ data: newTag[0] });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Tag already exists' });
    }
    next(error);
  }
};

export const updateTag = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, color } = req.body;

    await pool.execute(
      'UPDATE tags SET name = ?, color = ? WHERE id = ?',
      [name, color, id]
    );

    const [updatedTag] = await pool.execute(
      'SELECT * FROM tags WHERE id = ?',
      [id]
    );

    res.json({ data: updatedTag[0] });
  } catch (error) {
    next(error);
  }
};

export const deleteTag = async (req, res, next) => {
  try {
    const { id } = req.params;

    await pool.execute('DELETE FROM tags WHERE id = ?', [id]);

    res.json({ message: 'Tag deleted' });
  } catch (error) {
    next(error);
  }
};

export const getTicketTags = async (req, res, next) => {
  try {
    const { ticketId } = req.params;

    const [tags] = await pool.execute(
      `SELECT t.* FROM tags t
       JOIN ticket_tags tt ON t.id = tt.tag_id
       WHERE tt.ticket_id = ?`,
      [ticketId]
    );

    res.json({ data: tags });
  } catch (error) {
    next(error);
  }
};

export const addTagToTicket = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    const { tagId } = req.body;

    await pool.execute(
      'INSERT INTO ticket_tags (ticket_id, tag_id) VALUES (?, ?)',
      [ticketId, tagId]
    );

    res.json({ message: 'Tag added to ticket' });
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({ error: 'Tag already added to ticket' });
    }
    next(error);
  }
};

export const removeTagFromTicket = async (req, res, next) => {
  try {
    const { ticketId, tagId } = req.params;

    await pool.execute(
      'DELETE FROM ticket_tags WHERE ticket_id = ? AND tag_id = ?',
      [ticketId, tagId]
    );

    res.json({ message: 'Tag removed from ticket' });
  } catch (error) {
    next(error);
  }
};
