export type User = {
  id: number;
  username: string;
  email: string;
  balance: number;
  spent: number;
  registrationDate: string;
  lastSeen: string;
  status: "online" | "offline" | "away";
};

// Generate a larger dataset for testing pagination
export const generateMockUsers = (count: number): User[] => {
  const statusOptions: User["status"][] = ["online", "offline", "away"];
  const users: User[] = [];

  for (let i = 1; i <= count; i++) {
    const randomStatus =
      statusOptions[Math.floor(Math.random() * statusOptions.length)];
    const randomBalance = Math.floor(Math.random() * 5000);
    const randomSpent = Math.floor(Math.random() * 1000);

    // Generate random dates within the last month
    const today = new Date();
    const randomDaysAgo = Math.floor(Math.random() * 30);
    const randomDate = new Date(today);
    randomDate.setDate(today.getDate() - randomDaysAgo);

    const registrationDate = `Jun ${15 - (i % 15)}th, 2025`;

    // For last seen, mix between dates and relative times
    let lastSeen: string;
    if (i % 3 === 0) {
      lastSeen = `${Math.floor(Math.random() * 60)} minutes ago`;
    } else if (i % 3 === 1) {
      lastSeen = `${Math.floor(Math.random() * 24)} hours ago`;
    } else {
      lastSeen = `Jun ${15 - (i % 15)}th, 2025`;
    }

    users.push({
      id: i,
      username: `user${i}`,
      email: `user${i}@example.com`,
      balance: randomBalance,
      spent: randomSpent,
      registrationDate,
      lastSeen,
      status: randomStatus,
    });
  }

  // Add the original two users at the beginning
  users[0] = {
    id: 2,
    username: "josh",
    email: "takyijoshua019@gmail.com",
    balance: 1212,
    spent: 0,
    registrationDate: "Jun 16th, 2025",
    lastSeen: "28 minutes ago",
    status: "offline",
  };

  users[1] = {
    id: 1,
    username: "Validplug",
    email: "irnpfin@gmsil.com",
    balance: 0,
    spent: 0,
    registrationDate: "Jun 15th, 2025",
    lastSeen: "Jun 15th, 2025",
    status: "offline",
  };

  return users;
};

export const mockUsers = generateMockUsers(50);
