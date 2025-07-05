import { useState } from "react";
import { useAuth, UserRole } from "@/context/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useRoleAccess } from "@/hooks/useRoleAccess";

export default function RoleDemo() {
  const { user, login } = useAuth();
  const {
    canManageUsers,
    canViewAnalytics,
    canAccessAdminPanel,
    canManageTickets,
  } = useRoleAccess();

  const mockUsers = [
    {
      id: "1",
      name: "Admin User",
      email: "admin@example.com",
      avatar: "/avatars/admin.jpg",
      role: "admin" as UserRole,
      permissions: [
        "read:users",
        "write:users",
        "read:tickets",
        "write:tickets",
        "read:analytics",
        "admin:access",
        "read:reports",
        "read:activity",
      ],
    },
    {
      id: "2",
      name: "Manager User",
      email: "manager@example.com",
      avatar: "/avatars/manager.jpg",
      role: "manager" as UserRole,
      permissions: [
        "read:users",
        "read:tickets",
        "write:tickets",
        "read:analytics",
        "read:reports",
      ],
    },
    {
      id: "3",
      name: "Agent User",
      email: "agent@example.com",
      avatar: "/avatars/agent.jpg",
      role: "agent" as UserRole,
      permissions: ["read:tickets", "write:tickets"],
    },
    {
      id: "4",
      name: "Regular User",
      email: "user@example.com",
      avatar: "/avatars/user.jpg",
      role: "user" as UserRole,
      permissions: [],
    },
  ];

  const switchRole = (mockUser: (typeof mockUsers)[0]) => {
    login(mockUser);
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">Role-Based Access Control Demo</h1>
        <p className="text-muted-foreground">
          Switch between different user roles to see how the menu changes
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Current User Info */}
        <Card>
          <CardHeader>
            <CardTitle>Current User</CardTitle>
            <CardDescription>Your current role and permissions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {user ? (
              <>
                <div className="flex items-center gap-2">
                  <span className="font-medium">{user.name}</span>
                  <Badge variant="secondary">{user.role}</Badge>
                </div>
                <p className="text-sm text-muted-foreground">{user.email}</p>
                <div className="space-y-2">
                  <p className="text-sm font-medium">Permissions:</p>
                  <div className="flex flex-wrap gap-1">
                    {user.permissions?.map((permission) => (
                      <Badge
                        key={permission}
                        variant="outline"
                        className="text-xs"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </div>
              </>
            ) : (
              <p>No user logged in</p>
            )}
          </CardContent>
        </Card>

        {/* Access Rights */}
        <Card>
          <CardHeader>
            <CardTitle>Access Rights</CardTitle>
            <CardDescription>
              What you can access with current role
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm">Manage Users:</span>
              <Badge variant={canManageUsers() ? "default" : "secondary"}>
                {canManageUsers() ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">View Analytics:</span>
              <Badge variant={canViewAnalytics() ? "default" : "secondary"}>
                {canViewAnalytics() ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Admin Panel:</span>
              <Badge variant={canAccessAdminPanel() ? "default" : "secondary"}>
                {canAccessAdminPanel() ? "Yes" : "No"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-sm">Manage Tickets:</span>
              <Badge variant={canManageTickets() ? "default" : "secondary"}>
                {canManageTickets() ? "Yes" : "No"}
              </Badge>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Role Switcher */}
      <Card>
        <CardHeader>
          <CardTitle>Switch Roles</CardTitle>
          <CardDescription>
            Test different user roles to see menu changes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {mockUsers.map((mockUser) => (
              <Button
                key={mockUser.id}
                variant={user?.role === mockUser.role ? "default" : "outline"}
                onClick={() => switchRole(mockUser)}
                className="h-auto p-4 flex flex-col items-start gap-2"
              >
                <div className="flex items-center gap-2">
                  <span className="font-medium">{mockUser.role}</span>
                  <Badge variant="secondary" className="text-xs">
                    {mockUser.role}
                  </Badge>
                </div>
                <p className="text-xs text-left">{mockUser.name}</p>
                <p className="text-xs text-muted-foreground text-left">
                  {mockUser.permissions.length} permissions
                </p>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Instructions */}
      <Card>
        <CardHeader>
          <CardTitle>How to Use</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>
              Click on different role buttons above to switch between user roles
            </li>
            <li>
              Notice how the sidebar menu changes based on the selected role
            </li>
            <li>
              Check the "Access Rights" section to see what each role can do
            </li>
            <li>Admin users see all menu items</li>
            <li>Manager users see management-related items</li>
            <li>Agent users see ticket-related items</li>
            <li>Regular users see limited menu items</li>
          </ol>
        </CardContent>
      </Card>
    </div>
  );
}