/**
 * Role Hierarchy System
 * SuperAdmin > Organization Admin > Team Lead > User
 */

export const ROLES = {
  SUPER_ADMIN: 'SUPER_ADMIN',
  ORG_ADMIN: 'ORG_ADMIN',
  TEAM_LEAD: 'TEAM_LEAD',
  USER: 'USER'
};

export const ROLE_HIERARCHY = {
  [ROLES.SUPER_ADMIN]: 4,
  [ROLES.ORG_ADMIN]: 3,
  [ROLES.TEAM_LEAD]: 2,
  [ROLES.USER]: 1
};

/**
 * Check if user has permission based on role
 */
export const hasPermission = (userRole, requiredRole) => {
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
};

/**
 * Check if user can create a specific role
 */
export const canCreateRole = (user, targetRole) => {
  if (!user) return false;
  const { role } = user;

  // Super Admin can create any role
  if (role === ROLES.SUPER_ADMIN) return true;

  // Org Admin can create: ORG_ADMIN, TEAM_LEAD, USER (within their org)
  if (role === ROLES.ORG_ADMIN) {
    return targetRole === ROLES.ORG_ADMIN || targetRole === ROLES.TEAM_LEAD || targetRole === ROLES.USER;
  }

  // Team Lead can only create: USER (in their team)
  if (role === ROLES.TEAM_LEAD) {
    return targetRole === ROLES.USER;
  }

  return false;
};

/**
 * Check if user can reset password of another user
 */
export const canResetPassword = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  
  const { role: currentRole, organization_id: currentOrgId, team_id: currentTeamId } = currentUser;
  const { role: targetRole, organization_id: targetOrgId, team_id: targetTeamId } = targetUser;

  // Super Admin can reset password of anyone
  if (currentRole === ROLES.SUPER_ADMIN) return true;

  // Org Admin can reset password of: ORG_ADMIN, TEAM_LEAD, USER (within their org)
  if (currentRole === ROLES.ORG_ADMIN) {
    if (targetOrgId !== currentOrgId) return false;
    return targetRole === ROLES.ORG_ADMIN || targetRole === ROLES.TEAM_LEAD || targetRole === ROLES.USER;
  }

  // Team Lead can reset password of: USER (in their team)
  if (currentRole === ROLES.TEAM_LEAD) {
    if (targetTeamId !== currentTeamId) return false;
    return targetRole === ROLES.USER;
  }

  return false;
};
