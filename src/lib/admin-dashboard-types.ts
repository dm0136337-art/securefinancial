export type AdminCustomer = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  address: string;
  photoUrl: string;
  status: string;
  createdAt: string;
  balance: number;
  archivedAt: string | null;
};

export type AdminDashboardPayload = {
  customers: AdminCustomer[];
  archivedCustomers: AdminCustomer[];
  transactions: Record<string, unknown>[];
  auditLogs: Record<string, unknown>[];
  auditHasMore: boolean;
  loadError: string | null;
  transactionError: string | null;
  auditError: string | null;
  photoWarning: boolean;
};
