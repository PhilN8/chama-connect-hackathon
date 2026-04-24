"use client";

import { useSession } from "@/lib/auth-client";
import { hasPermission, ResourceMap, User, Role } from "@/lib/permissions";
import { ReactNode } from "react";

interface GuardProps<K extends keyof ResourceMap> {
  resource: K;
  action: string;
  data?: ResourceMap[K];
  children: ReactNode;
  fallback?: ReactNode;
}

export function PermissionGuard<K extends keyof ResourceMap>({
  resource,
  action,
  data,
  children,
  fallback = null,
}: GuardProps<K>) {
  const { data: session } = useSession();

  if (!session?.user) return fallback as any;

  // Transform Better-Auth user to ABAC User
  // In a real app, memberships would be fetched or included in session
  const abacUser: User = {
    id: session.user.id,
    globalRole: (session.user as any).globalRole || "USER",
    memberships: (session.user as any).memberships || {},
  };

  const allowed = hasPermission(abacUser, resource, action, data);

  return allowed ? children : fallback;
}
