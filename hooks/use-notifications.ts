"use client";

import { useQuery } from "@tanstack/react-query";

export interface Notification {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  createdAt: string;
}

const mockNotifications: Notification[] = [
  {
    id: "1",
    title: "Welcome to ChamaConnect",
    message: "Your account has been created successfully. Start by onboarding your chama.",
    type: "success",
    read: false,
    createdAt: new Date().toISOString(),
  },
  {
    id: "2",
    title: "New member joined",
    message: "Grace Wambui has joined your chama.",
    type: "info",
    read: false,
    createdAt: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: "3",
    title: "Contribution received",
    message: "KES 5,000 received from Brian Otieno.",
    type: "success",
    read: true,
    createdAt: new Date(Date.now() - 172800000).toISOString(),
  },
];

async function fetchNotifications(): Promise<Notification[]> {
  await new Promise((resolve) => setTimeout(resolve, 500));
  return mockNotifications;
}

export function useNotifications() {
  return useQuery({
    queryKey: ["notifications"],
    queryFn: fetchNotifications,
    staleTime: 60 * 1000,
  });
}