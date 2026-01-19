import { BaseModel } from './BaseModel.js';

/**
 * Organization Model
 */
export class OrganizationModel extends BaseModel {
  constructor() {
    super('organizations');
  }

  /**
   * Find organization by name
   */
  async findByName(name) {
    return this.findOne({ name });
  }
}

export default new OrganizationModel();
