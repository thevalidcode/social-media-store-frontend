import { User } from "@/types";

export const mockUsers: User[] = Array.from({ length: 47 }).map((_, i) => {
  const id = i + 1;
  const statuses: User["status"][] = ["active", "offline", "away", "banned"];
  return {
    id,
    uid: `u-${1000 + id}`,
    username: `user${id}`,
    email: `user${id}@example.com`,
    image: `https://i.pravatar.cc/150?img=${(id % 70) + 1}`,
    role: id % 7 === 0 ? "admin" : "user",
    status: statuses[id % statuses.length],
    balance: Math.round(Math.random() * 10000) / 100,
    spent: Math.round(Math.random() * 4000) / 100,
    timestamp: new Date(Date.now() - id * 86400000).toISOString(),
    lastSeen: new Date(Date.now() - (id % 5) * 3600000).toISOString(),
    currency: "USD",
  };
});
