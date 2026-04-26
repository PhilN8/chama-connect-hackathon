"use client";

import { useSession } from "@/lib/auth-client";
import { hasPermission, ResourceMap, User, Role, GlobalRole } from "@/lib/permissions";
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

  if (!session?.user) return fallback;

  const userGlobalRole = (session.user as { globalRole?: string }).globalRole;
  const abacUser: User = {
    id: session.user.id,
    globalRole: (userGlobalRole as GlobalRole) || "USER",
    memberships: (session.user as { memberships?: Record<string, Role> }).memberships || {},
  };

  const allowed = hasPermission(abacUser, resource, action, data);

  return allowed ? children : fallback;
}
