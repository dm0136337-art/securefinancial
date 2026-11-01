export type AccountStatus = "active" | "suspended";
export type UserRole = "user" | "admin";

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  address: string;
  role: UserRole;
  status: AccountStatus;
  photo: string;
  balance: number;
  totalCredited: number;
  totalDebited: number;
  createdAt: string;
};

export type Transaction = {
  id: number;
  userId: number;
  type: "credit" | "debit" | "adjustment";
  amount: number;
  note: string;
  createdAt: string;
  adminName: string;
};

export const mockUsers: UserProfile[] = [
  {
    id: 1,
    firstName: "Jane",
    lastName: "Harper",
    email: "jane@example.com",
    password: "SecurePass123!",
    address: "1450 Market Street, San Francisco, CA",
    role: "user",
    status: "active",
    photo:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=80",
    balance: 8240.5,
    totalCredited: 18500,
    totalDebited: 10259.5,
    createdAt: "2024-01-18T09:30:00.000Z",
  },
  {
    id: 2,
    firstName: "Lucas",
    lastName: "Bennett",
    email: "lucas@example.com",
    password: "SecurePass123!",
    address: "8 Park Avenue, New York, NY",
    role: "user",
    status: "active",
    photo:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=300&q=80",
    balance: 4620,
    totalCredited: 9800,
    totalDebited: 5180,
    createdAt: "2024-02-25T10:15:00.000Z",
  },
  {
    id: 3,
    firstName: "Priya",
    lastName: "Nguyen",
    email: "priya@example.com",
    password: "SecurePass123!",
    address: "2000 Pine Street, Seattle, WA",
    role: "user",
    status: "suspended",
    photo:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=300&q=80",
    balance: 1200,
    totalCredited: 4200,
    totalDebited: 3000,
    createdAt: "2023-10-11T12:00:00.000Z",
  },
  {
    id: 4,
    firstName: "Admin",
    lastName: "Access",
    email: "admin@securefinancial.com",
    password: "AdminPass123!",
    address: "400 Capital Boulevard, Austin, TX",
    role: "admin",
    status: "active",
    photo:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=300&q=80",
    balance: 0,
    totalCredited: 0,
    totalDebited: 0,
    createdAt: "2023-06-02T08:45:00.000Z",
  },
];

export const mockTransactions: Transaction[] = [
  {
    id: 1,
    userId: 1,
    type: "credit",
    amount: 4500,
    note: "Initial account credit",
    createdAt: "2024-02-01T10:00:00.000Z",
    adminName: "Admin Access",
  },
  {
    id: 2,
    userId: 1,
    type: "debit",
    amount: 260,
    note: "Service payment deduction",
    createdAt: "2024-03-02T09:00:00.000Z",
    adminName: "Admin Access",
  },
  {
    id: 3,
    userId: 2,
    type: "credit",
    amount: 2200,
    note: "Monthly account adjustment",
    createdAt: "2024-04-01T14:20:00.000Z",
    adminName: "Admin Access",
  },
  {
    id: 4,
    userId: 3,
    type: "adjustment",
    amount: 150,
    note: "Account correction",
    createdAt: "2024-05-10T16:40:00.000Z",
    adminName: "Admin Access",
  },
  {
    id: 5,
    userId: 1,
    type: "credit",
    amount: 850,
    note: "Administrative balance adjustment",
    createdAt: "2024-06-18T12:05:00.000Z",
    adminName: "Admin Access",
  },
];

export function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 2,
  }).format(value);
}

export function getUserByEmail(email: string) {
  return mockUsers.find((user) => user.email.toLowerCase() === email.toLowerCase());
}

export function getTransactionsForUser(userId: number) {
  return mockTransactions.filter((transaction) => transaction.userId === userId);
}

export function getSummaryTotals() {
  const activeUsers = mockUsers.filter((user) => user.role === "user" && user.status === "active").length;
  const suspendedUsers = mockUsers.filter((user) => user.role === "user" && user.status === "suspended").length;
  const totalBalances = mockUsers
    .filter((user) => user.role === "user")
    .reduce((sum, user) => sum + user.balance, 0);
  const totalCredited = mockUsers
    .filter((user) => user.role === "user")
    .reduce((sum, user) => sum + user.totalCredited, 0);
  const totalDebited = mockUsers
    .filter((user) => user.role === "user")
    .reduce((sum, user) => sum + user.totalDebited, 0);

  return {
    activeUsers,
    suspendedUsers,
    totalBalances,
    totalCredited,
    totalDebited,
    registeredUsers: mockUsers.filter((user) => user.role === "user").length,
  };
}
