import { v4 as uuidv4 } from 'uuid';

/**
 * Generate a new UUID
 * @returns {string} UUID v4 string
 */
export const generateUUID = () => {
  return uuidv4();
};

/**
 * Validate UUID format
 * @param {string} uuid - UUID string to validate
 * @returns {boolean} True if valid UUID format
 */
export const isValidUUID = (uuid) => {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
};
