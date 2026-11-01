import { Suspense } from "react";
import { redirect } from "next/navigation";

import { FinancialDemo } from "@/components/financial-demo";
import type { AdminCustomer, AdminDashboardPayload } from "@/lib/admin-dashboard-types";
import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

const AUDIT_PAGE_SIZE = 25;

async function AuthorizedAdminDashboard() {
  const supabase = await createClient();
  const {
    data: { user },
    error: authError,
  } = await supabase.auth.getUser();

  if (authError || !user) {
    redirect("/login?reason=session-missing");
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("role, status")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError || !profile) {
    redirect("/login?reason=unauthorized");
  }

  if (profile.status !== "active") {
    redirect("/login?reason=suspended");
  }

  if (profile.role !== "admin") {
    redirect("/dashboard?reason=unauthorized");
  }

  const payload: AdminDashboardPayload = {
    customers: [],
    archivedCustomers: [],
    transactions: [],
    auditLogs: [],
    auditHasMore: false,
    loadError: null,
    transactionError: null,
    auditError: null,
    photoWarning: false,
  };
  const photoAdminClient = createAdminClient();

  const { data: profileRows, error: customersError } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "user")
    .order("created_at", { ascending: false });

  if (customersError) {
    payload.loadError = `Unable to load customer profiles: ${customersError.message}`;
  } else {
    const allCustomerProfiles = profileRows ?? [];
    const customerProfiles = allCustomerProfiles.filter((customer) => !customer.archived_at);
    const archivedProfiles = allCustomerProfiles.filter((customer) => Boolean(customer.archived_at));
    const customerIds = allCustomerProfiles.map((customer) => String(customer.id));
    const { data: accountRows, error: accountsError } = customerIds.length
      ? await supabase.from("accounts").select("*").in("user_id", customerIds)
      : { data: [], error: null };

    if (accountsError) {
      payload.loadError = `Unable to load customer accounts: ${accountsError.message}`;
    } else {
      const accountsByUser = new Map<string, number>();
      for (const account of accountRows ?? []) {
        const accountUserId = String(account.user_id);
        accountsByUser.set(
          accountUserId,
          (accountsByUser.get(accountUserId) ?? 0) + Number(account.balance ?? 0),
        );
      }

      const mapCustomer = async (customer: (typeof allCustomerProfiles)[number]): Promise<AdminCustomer> => {
          const storedPhoto = typeof customer.photo_url === "string" ? customer.photo_url : "";
          let photoUrl = "";

          if (storedPhoto && !storedPhoto.startsWith("http")) {
            const { data: signedUrl, error: photoError } = await photoAdminClient.storage
              .from("profile-photos")
              .createSignedUrl(storedPhoto, 5 * 60);
            if (photoError) {
              payload.photoWarning = true;
            } else {
              photoUrl = signedUrl.signedUrl;
            }
          } else if (storedPhoto.startsWith("http")) {
            payload.photoWarning = true;
          }

          return {
            id: String(customer.id),
            firstName: String(customer.first_name ?? ""),
            lastName: String(customer.last_name ?? ""),
            email: String(customer.email ?? ""),
            address: String(customer.address ?? ""),
            photoUrl,
            status: String(customer.status ?? "unknown"),
            createdAt: String(customer.created_at ?? ""),
            balance: accountsByUser.get(String(customer.id)) ?? 0,
            archivedAt: typeof customer.archived_at === "string" ? customer.archived_at : null,
          };
      };

      const customers: AdminCustomer[] = await Promise.all(customerProfiles.map(mapCustomer));
      payload.archivedCustomers = await Promise.all(archivedProfiles.map(mapCustomer));

      payload.customers = customers;

      if (customerIds.length) {
        const { data: transactionRows, error: transactionsError } = await supabase
          .from("transactions")
          .select("*")
          .in("user_id", customerIds)
          .order("created_at", { ascending: false });

        if (transactionsError) {
          payload.transactionError = `Unable to load customer transactions: ${transactionsError.message}`;
        } else {
          payload.transactions = (transactionRows ?? []) as Record<string, unknown>[];
        }
      }
    }
  }

  const { data: auditRows, error: auditError } = await supabase
    .from("audit_logs")
    .select("*")
    .order("created_at", { ascending: false })
    .order("id", { ascending: false })
    .limit(AUDIT_PAGE_SIZE + 1);

  if (auditError) {
    payload.auditError = `Unable to load audit logs: ${auditError.message}`;
  } else {
    const rows = auditRows ?? [];
    payload.auditHasMore = rows.length > AUDIT_PAGE_SIZE;
    payload.auditLogs = rows.slice(0, AUDIT_PAGE_SIZE) as Record<string, unknown>[];
  }

  return <FinancialDemo page="admin" adminData={payload} />;
}

export default function Page() {
  return (
    <Suspense
      fallback={
        <main className="min-h-screen bg-slate-50 px-4 py-20 text-center text-slate-700">
          Verifying administrator access...
        </main>
      }
    >
      <AuthorizedAdminDashboard />
    </Suspense>
  );
}
