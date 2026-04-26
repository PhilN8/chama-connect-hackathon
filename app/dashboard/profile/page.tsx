"use client";

import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import { motion } from "framer-motion";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import {
  User,
  Mail,
  Phone,
  Shield,
  Clock,
  Eye,
  EyeOff,
  UserPlus,
  Loader2,
} from "lucide-react";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";

interface SessionUser {
  id: string;
  name?: string;
  email: string;
  emailVerified: boolean;
  image?: string;
  phoneNumber?: string;
  globalRole: "USER" | "SYSTEM_ADMIN";
  createdAt: Date;
}

export default function ProfilePage() {
  const { data: session } = useSession();

  if (!session?.user) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="size-8 animate-spin text-emerald-600" />
      </div>
    );
  }

  const user = session.user as SessionUser;
  const joinDate = user.createdAt
    ? new Date(user.createdAt).toLocaleDateString("en-KE", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <div className="w-full px-2 py-8 sm:px-4 sm:py-12">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
          Profile Settings
        </h1>
        <p className="mt-2 text-base text-zinc-600 dark:text-zinc-400">
          Manage your account, security, and membership settings.
        </p>
      </motion.div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-4 mb-6">
          <TabsTrigger value="info">Info</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="invite">Invite</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
              <CardDescription>
                Your account details and contact information.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center gap-4 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300">
                  <User className="size-7" />
                </div>
                <div>
                  <p className="font-semibold text-lg">{user.name || "No name set"}</p>
                  <p className="text-sm text-zinc-500">{user.email}</p>
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Mail className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Email
                    </p>
                    <p className="font-medium">{user.email}</p>
                    {user.emailVerified ? (
                      <span className="text-xs text-emerald-600 dark:text-emerald-400">
                        Verified
                      </span>
                    ) : (
                      <span className="text-xs text-amber-600 dark:text-amber-400">
                        Unverified
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Phone className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Phone
                    </p>
                    <p className="font-medium">{user.phoneNumber || "Not set"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Shield className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      System Role
                    </p>
                    <p className="font-medium">{user.globalRole || "USER"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-4 rounded-lg border border-zinc-200 dark:border-zinc-800">
                  <Clock className="size-5 text-zinc-400" />
                  <div>
                    <p className="text-xs font-medium uppercase text-zinc-500 dark:text-zinc-400">
                      Member Since
                    </p>
                    <p className="font-medium">{joinDate}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle>Change Password</CardTitle>
              <CardDescription>
                Update your password to keep your account secure.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangePasswordForm />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="email">
          <Card>
            <CardHeader>
              <CardTitle>Change Email</CardTitle>
              <CardDescription>
                Update your email address. A verification link will be sent to the new email.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ChangeEmailForm currentEmail={user.email} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invite">
          <Card>
            <CardHeader>
              <CardTitle>Invite Members</CardTitle>
              <CardDescription>
                Invite new members to your chama. They will receive an email with instructions to join.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <InviteMemberForm />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}

function ChangePasswordForm() {
  const [loading, setLoading] = useState(false);
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [form, setForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (form.newPassword !== form.confirmPassword) {
      setError("New passwords do not match");
      return;
    }

    if (form.newPassword.length < 8) {
      setError("New password must be at least 8 characters");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/profile/change-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword: form.currentPassword,
          newPassword: form.newPassword,
        }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setError(data.message || "Failed to change password");
        return;
      }

      toast.success("Password changed", {
        description: "Your password has been updated successfully.",
      });
      setForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="p-3 rounded-lg bg-red-50 text-red-700 text-sm dark:bg-red-950/20 dark:text-red-300">
          {error}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="currentPassword">Current Password</Label>
        <div className="relative">
          <Input
            id="currentPassword"
            type={showCurrent ? "text" : "password"}
            value={form.currentPassword}
            onChange={(e) => setForm({ ...form, currentPassword: e.target.value })}
            placeholder="Enter current password"
            required
          />
          <button
            type="button"
            onClick={() => setShowCurrent(!showCurrent)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showCurrent ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="newPassword">New Password</Label>
        <div className="relative">
          <Input
            id="newPassword"
            type={showNew ? "text" : "password"}
            value={form.newPassword}
            onChange={(e) => setForm({ ...form, newPassword: e.target.value })}
            placeholder="Enter new password"
            required
          />
          <button
            type="button"
            onClick={() => setShowNew(!showNew)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600"
          >
            {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
          </button>
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirm New Password</Label>
        <Input
          id="confirmPassword"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
          placeholder="Confirm new password"
          required
        />
      </div>

      <Button type="submit" disabled={loading} className="w-full">
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Changing password...
          </>
        ) : (
          "Change Password"
        )}
      </Button>
    </form>
  );
}

function ChangeEmailForm({ currentEmail }: { currentEmail: string }) {
  const [loading, setLoading] = useState(false);
  const [newEmail, setNewEmail] = useState("");
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch("/api/profile/change-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ newEmail }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        toast.error("Failed to send verification", { description: data.message });
        return;
      }

      setSent(true);
      toast.success("Verification email sent", {
        description: `Check ${newEmail} for a link to confirm your new email.`,
      });
    } catch {
      toast.error("Network error", { description: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="text-center py-6">
        <div className="mx-auto mb-4 flex size-12 items-center justify-center rounded-full bg-emerald-100 dark:bg-emerald-900/40">
          <Mail className="size-6 text-emerald-600 dark:text-emerald-400" />
        </div>
        <p className="font-medium">Verification email sent!</p>
        <p className="mt-1 text-sm text-zinc-500">
          We sent a verification link to <span className="font-semibold">{newEmail}</span>.
          Click the link to confirm your new email address.
        </p>
        <Button variant="outline" className="mt-4" onClick={() => setSent(false)}>
          Send to different email
        </Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="currentEmail">Current Email</Label>
        <Input id="currentEmail" value={currentEmail} disabled />
      </div>

      <div className="space-y-2">
        <Label htmlFor="newEmail">New Email</Label>
        <Input
          id="newEmail"
          type="email"
          value={newEmail}
          onChange={(e) => setNewEmail(e.target.value)}
          placeholder="Enter new email address"
          required
        />
      </div>

      <Button type="submit" disabled={loading || newEmail === currentEmail}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending...
          </>
        ) : (
          "Send Verification Email"
        )}
      </Button>
    </form>
  );
}

function InviteMemberForm() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    chamaId: "",
    email: "",
    role: "MEMBER",
  });
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const res = await fetch("/api/profile/invite", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setMessage({ type: "error", text: data.message });
        return;
      }

      setMessage({ type: "success", text: data.message });
      setForm({ ...form, email: "" });
      toast.success("Invitation sent", { description: data.message });
    } catch {
      setMessage({ type: "error", text: "Network error. Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {message && (
        <div
          className={cn(
            "p-3 rounded-lg text-sm",
            message.type === "success"
              ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/20 dark:text-emerald-300"
              : "bg-red-50 text-red-700 dark:bg-red-950/20 dark:text-red-300"
          )}
        >
          {message.text}
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="inviteEmail">Member Email</Label>
        <Input
          id="inviteEmail"
          type="email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          placeholder="member@example.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="inviteRole">Role</Label>
        <select
          id="inviteRole"
          value={form.role}
          onChange={(e) => setForm({ ...form, role: e.target.value })}
          className="w-full px-3 py-2 rounded-lg border border-zinc-200 dark:border-zinc-700 bg-white dark:bg-zinc-800 outline-none focus:border-emerald-700 dark:focus:border-emerald-300"
        >
          <option value="MEMBER">Member</option>
          <option value="TREASURER">Treasurer</option>
          <option value="SECRETARY">Secretary</option>
          <option value="ADMIN">Admin</option>
        </select>
      </div>

      <Button type="submit" disabled={loading}>
        {loading ? (
          <>
            <Loader2 className="size-4 animate-spin" />
            Sending invitation...
          </>
        ) : (
          <>
            <UserPlus className="size-4" />
            Send Invitation
          </>
        )}
      </Button>

      <p className="text-xs text-zinc-500">
        The member will receive an email with instructions to join your chama.
        Invitations expire after 48 hours.
      </p>
    </form>
  );
}