"use client";

import { useState } from "react";
import { Bell, Check, X } from "lucide-react";
import { useNotifications, type Notification } from "@/hooks/use-notifications";
import { cn } from "@/lib/utils";

export function NotificationBell() {
  const [open, setOpen] = useState(false);
  const { data: notifications = [], isLoading } = useNotifications();
  const unreadCount = notifications.filter((n) => !n.read).length;

  const getTypeStyles = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-emerald-50 text-emerald-700 dark:bg-emerald-900/20 dark:text-emerald-300";
      case "warning":
        return "bg-amber-50 text-amber-700 dark:bg-amber-900/20 dark:text-amber-300";
      case "error":
        return "bg-red-50 text-red-700 dark:bg-red-900/20 dark:text-red-300";
      default:
        return "bg-blue-50 text-blue-700 dark:bg-blue-900/20 dark:text-blue-300";
    }
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (hours < 1) return "Just now";
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="relative">
      <button
        type="button"
        aria-label="Notifications"
        onClick={() => setOpen(!open)}
        className="relative rounded-md p-2 text-zinc-700 hover:bg-zinc-100 dark:text-zinc-300 dark:hover:bg-zinc-900 transition-colors"
      >
        <Bell className="size-5" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-4 items-center justify-center rounded-full bg-emerald-500 text-[10px] font-bold text-white">
            {unreadCount}
          </span>
        )}
      </button>

      {open && (
        <>
          <div
            className="fixed inset-0 z-40"
            onClick={() => setOpen(false)}
          />
          <div className="absolute right-0 top-full z-50 mt-2 w-80 rounded-xl border border-zinc-200 bg-white shadow-lg dark:border-zinc-800 dark:bg-zinc-900">
            <div className="flex items-center justify-between border-b border-zinc-100 p-4 dark:border-zinc-800">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400">
                  {unreadCount} unread
                </span>
              )}
            </div>

            <div className="max-h-80 overflow-y-auto">
              {isLoading ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  Loading...
                </div>
              ) : notifications.length === 0 ? (
                <div className="p-4 text-center text-sm text-zinc-500">
                  No notifications
                </div>
              ) : (
                <div className="divide-y divide-zinc-100 dark:divide-zinc-800">
                  {notifications.slice(0, 5).map((notification) => (
                    <div
                      key={notification.id}
                      className={cn(
                        "flex gap-3 p-4 transition-colors",
                        !notification.read && "bg-zinc-50 dark:bg-zinc-800/50"
                      )}
                    >
                      <div
                        className={cn(
                          "mt-0.5 rounded-full p-1.5",
                          getTypeStyles(notification.type)
                        )}
                      >
                        <Check className="size-3" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm font-medium">{notification.title}</p>
                          <span className="text-xs text-zinc-400 whitespace-nowrap">
                            {formatTime(notification.createdAt)}
                          </span>
                        </div>
                        <p className="mt-0.5 text-xs text-zinc-500 line-clamp-2">
                          {notification.message}
                        </p>
                      </div>
                      {!notification.read && (
                        <div className="size-2 rounded-full bg-emerald-500 mt-2" />
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="border-t border-zinc-100 p-2 dark:border-zinc-800">
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex w-full items-center justify-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-zinc-800"
              >
                <X className="size-4" />
                Close
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}