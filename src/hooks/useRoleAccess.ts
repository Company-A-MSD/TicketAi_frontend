import { useAuth, UserRole } from "@/context/AuthContext";

export function useRoleAccess() {
  const { user, hasRole, hasPermission } = useAuth();

  const canAccess = (
    allowedRoles: UserRole[],
    requiredPermissions?: string[]
  ) => {
    if (!user) return false;

    const hasRequiredRole = allowedRoles.includes(user.role);
    const hasRequiredPermissions =
      !requiredPermissions ||
      requiredPermissions.every((permission) => hasPermission(permission));

    return hasRequiredRole && hasRequiredPermissions;
  };

  const isAdmin = () => hasRole("admin");
  const isManager = () => hasRole("manager");
  const isAgent = () => hasRole("agent");
  const isUser = () => hasRole("user");

  const canManageUsers = () => canAccess(["admin", "manager"], ["read:users"]);
  const canViewAnalytics = () =>
    canAccess(["admin", "manager"], ["read:analytics"]);
  const canAccessAdminPanel = () => canAccess(["admin"], ["admin:access"]);
  const canManageTickets = () =>
    canAccess(["admin", "manager", "agent"], ["read:tickets"]);

  return {
    user,
    canAccess,
    isAdmin,
    isManager,
    isAgent,
    isUser,
    canManageUsers,
    canViewAnalytics,
    canAccessAdminPanel,
    canManageTickets,
  };
}