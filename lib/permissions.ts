import { users, chamaMemberships, contributions } from "./db/schema";

export type Role = "ADMIN" | "TREASURER" | "SECRETARY" | "MEMBER";
export type GlobalRole = "USER" | "SYSTEM_ADMIN";

export type User = {
  id: string;
  globalRole: GlobalRole;
  memberships: Record<string, Role>;
};

export type ResourceMap = {
  contributions: typeof contributions.$inferSelect;
  chamas: { id: string; minContributionAmount: number };
};

type PermissionCheck<K extends keyof ResourceMap> =
  | boolean
  | ((user: User, data: ResourceMap[K]) => boolean);

type RolePermissions = {
  [K in keyof ResourceMap]?: {
    [action: string]: PermissionCheck<K>;
  };
};

export const POLICIES: Record<Role, RolePermissions> = {
  ADMIN: {
    contributions: {
      view: true,
      verify: (user, data) => data.memberId !== user.id,
      delete: true,
    },
    chamas: {
      edit: true,
    },
  },
  TREASURER: {
    contributions: {
      view: true,
      verify: (user, data) => data.memberId !== user.id,
    },
  },
  SECRETARY: {
    contributions: {
      view: true,
    },
  },
  MEMBER: {
    contributions: {
      view: (user, data) => data.memberId === user.id,
      create: (user, data) => {
        // This is a placeholder for a more complex check
        // In reality, we'd check the chama's minContributionAmount
        return true; 
      },
    },
  },
};

export function hasPermission<K extends keyof ResourceMap>(
  user: User,
  resource: K,
  action: string,
  data?: ResourceMap[K]
): boolean {
  if (user.globalRole === "SYSTEM_ADMIN") return true;

  // Context required for non-global checks
  const chamaId = (data as any)?.chamaId;
  if (!chamaId) return false;

  const role = user.memberships[chamaId];
  if (!role) return false;

  const permission = POLICIES[role]?.[resource]?.[action];
  if (permission == null) return false;

  if (typeof permission === "boolean") return permission;
  return data != null && permission(user, data);
}
