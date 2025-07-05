# Role-Based Dashboard Menu System

This implementation provides a comprehensive role-based access control system for your React application. Here's how to use it:

## Features

### 1. User Roles

- **Admin**: Full system access with all permissions
- **Manager**: Management-level access (users, analytics, reports)
- **Agent**: Ticket management and customer support
- **User**: Basic user access (submit tickets, view own tickets)

### 2. Permission System

Each role has specific permissions:

- `read:users`, `write:users` - User management
- `read:tickets`, `write:tickets` - Ticket management
- `read:analytics` - Analytics access
- `read:reports` - Report generation
- `admin:access` - Admin panel access
- `read:activity` - Activity logs

## How to Use

### 1. Setting Up Authentication

The `AuthContext` provides user state management:

```tsx
import { useAuth } from "@/context/AuthContext";

function MyComponent() {
  const { user, hasRole, hasPermission } = useAuth();

  if (hasRole("admin")) {
    // Admin-only content
  }
}
```

### 2. Menu Configuration

The menu system is configured in `src/config/menuConfig.ts`:

```tsx
export const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    roles: ["admin", "manager", "agent", "user"], // Who can see this
    description: "Main dashboard view",
  },
  // ... more items
];
```

### 3. Role-Based Access Hook

Use the `useRoleAccess` hook for convenient access checking:

```tsx
import { useRoleAccess } from "@/hooks/useRoleAccess";

function MyComponent() {
  const { canManageUsers, canViewAnalytics, canAccessAdminPanel, isAdmin } =
    useRoleAccess();

  return (
    <div>
      {canManageUsers() && <UserManagementPanel />}
      {canViewAnalytics() && <AnalyticsPanel />}
      {isAdmin() && <AdminPanel />}
    </div>
  );
}
```

### 4. Route Protection

Use the `ProtectedRoute` component to protect specific routes:

```tsx
import { ProtectedRoute } from "@/components/ProtectedRoute";

function AdminPage() {
  return (
    <ProtectedRoute
      allowedRoles={["admin"]}
      requiredPermissions={["admin:access"]}
    >
      <AdminContent />
    </ProtectedRoute>
  );
}
```

### 5. Higher-Order Component Protection

You can also use the HOC for route protection:

```tsx
import { withRoleProtection } from "@/components/ProtectedRoute";

const AdminPage = withRoleProtection(AdminContent, ["admin"], ["admin:access"]);
```

## Testing Different Roles

### 1. Using the Role Demo

Visit `/dashboard` to see the role demo component that allows you to switch between different user roles in real-time.

### 2. Changing the Default Role

In `src/context/AuthContext.tsx`, you can change the default role for testing:

```tsx
useEffect(() => {
  setTimeout(() => {
    setUser({
      id: "1",
      name: "John Doe",
      email: "john@example.com",
      avatar: "/avatars/john.jpg",
      role: "admin", // Change this to test different roles
      permissions: [
        "read:users",
        "write:users",
        "read:tickets",
        "write:tickets",
      ],
    });
    setLoading(false);
  }, 1000);
}, []);
```

## Customization

### 1. Adding New Roles

1. Add the new role to the `UserRole` type in `src/context/AuthContext.tsx`
2. Update the menu configuration in `src/config/menuConfig.ts`
3. Add role-specific logic in your components

### 2. Adding New Permissions

1. Add permissions to the user's `permissions` array
2. Update menu items to require the new permissions
3. Use `hasPermission()` to check for the new permissions

### 3. Adding New Menu Items

Add new items to the `menuItems` array in `src/config/menuConfig.ts`:

```tsx
{
  id: "new-feature",
  label: "New Feature",
  icon: NewFeatureIcon,
  href: "/new-feature",
  roles: ["admin", "manager"],
  permissions: ["read:new-feature"],
  description: "Description of the new feature"
}
```

## Best Practices

1. **Principle of Least Privilege**: Only grant the minimum permissions needed
2. **Centralized Configuration**: Keep all role and permission logic in the config files
3. **Consistent Naming**: Use clear, descriptive names for roles and permissions
4. **Error Handling**: Always handle cases where users don't have required permissions
5. **Testing**: Test all role combinations to ensure proper access control

## Integration with Backend

In a real application, you would:

1. **Authenticate**: Get user data from your authentication endpoint
2. **Store**: Store user role and permissions in your backend
3. **Validate**: Always validate permissions on the backend as well
4. **Sync**: Keep frontend and backend permissions in sync

```tsx
// Example API integration
useEffect(() => {
  const fetchUser = async () => {
    const response = await fetch("/api/user/me");
    const userData = await response.json();
    setUser(userData);
  };

  fetchUser();
}, []);
```

This system provides a solid foundation for role-based access control in your React application. You can extend it further based on your specific requirements.