import {
  LayoutDashboard,
  HelpCircle,
  Settings,
  Users,
  Ticket,
  BarChart3,
  Shield,
  FileText,
  Clock,
  MessageSquare,
  Star,
} from "lucide-react";
import { UserRole } from "@/context/AuthContext";

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  href: string;
  roles: UserRole[];
  permissions?: string[];
  description?: string;
}

// Define all possible menu items
export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: ["admin", "manager", "agent", "user"],
    description: "Main dashboard view",
  },
  {
    id: "tickets",
    label: "Tickets",
    icon: Ticket,
    href: "/tickets",
    roles: ["admin", "manager", "agent"],
    permissions: ["read:tickets"],
    description: "View and manage tickets",
  },
  {
    id: "my-tickets",
    label: "My Tickets",
    icon: Ticket,
    href: "/my-tickets",
    roles: ["user"],
    description: "View your submitted tickets",
  },
  {
    id: "users",
    label: "Users",
    icon: Users,
    href: "/users",
    roles: ["admin", "manager"],
    permissions: ["read:users"],
    description: "Manage users and permissions",
  },
  {
    id: "analytics",
    label: "Analytics",
    icon: BarChart3,
    href: "/analytics",
    roles: ["admin", "manager"],
    permissions: ["read:analytics"],
    description: "View system analytics and reports",
  },
  {
    id: "reports",
    label: "Reports",
    icon: FileText,
    href: "/reports",
    roles: ["admin", "manager"],
    permissions: ["read:reports"],
    description: "Generate and view reports",
  },
  {
    id: "activity",
    label: "Activity Log",
    icon: Clock,
    href: "/activity",
    roles: ["admin"],
    permissions: ["read:activity"],
    description: "View system activity logs",
  },
  {
    id: "chat",
    label: "Chat Support",
    icon: MessageSquare,
    href: "/chat",
    roles: ["admin", "manager", "agent"],
    description: "Chat with customers",
  },
  {
    id: "feedback",
    label: "Feedback",
    icon: Star,
    href: "/feedback",
    roles: ["admin", "manager"],
    description: "View customer feedback",
  },
  {
    id: "admin",
    label: "Admin Panel",
    icon: Shield,
    href: "/admin",
    roles: ["admin"],
    permissions: ["admin:access"],
    description: "Administrative functions",
  },
  {
    id: "settings",
    label: "Settings",
    icon: Settings,
    href: "/settings",
    roles: ["admin", "manager", "agent", "user"],
    description: "Application settings",
  },
  {
    id: "help",
    label: "Help",
    icon: HelpCircle,
    href: "/help",
    roles: ["admin", "manager", "agent", "user"],
    description: "Help and documentation",
  },
];

// Helper function to filter menu items based on user role and permissions
export function getMenuItemsForUser(
  userRole: UserRole,
  userPermissions: string[] = []
): MenuItem[] {
  return menuItems.filter((item) => {
    // Check if user has required role
    const hasRole = item.roles.includes(userRole);

    // Check if user has required permissions (if any)
    const hasPermissions =
      !item.permissions ||
      item.permissions.every((permission) =>
        userPermissions.includes(permission)
      );

    return hasRole && hasPermissions;
  });
}

// Role-based menu presets for easier management
export const roleMenuPresets = {
  admin: menuItems, // Admin gets all menu items
  manager: menuItems.filter((item) => item.roles.includes("manager")),
  agent: menuItems.filter((item) => item.roles.includes("agent")),
  user: menuItems.filter((item) => item.roles.includes("user")),
};