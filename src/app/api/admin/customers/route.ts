import { NextResponse } from "next/server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

type CustomerActionRequest = {
  userId?: unknown;
  action?: unknown;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export async function POST(request: Request) {
  let body: CustomerActionRequest;

  try {
    const parsedBody: unknown = await request.json();
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    body = parsedBody as CustomerActionRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const action =
    body.action === "suspend" || body.action === "unsuspend" || body.action === "delete"
      ? body.action
      : null;

  if (!uuidPattern.test(userId) || !action) {
    return NextResponse.json({ error: "Invalid customer action." }, { status: 400 });
  }

  try {
    const sessionClient = await createClient();
    const {
      data: { user: actor },
      error: authError,
    } = await sessionClient.auth.getUser();

    if (authError || !actor) {
      return NextResponse.json({ error: "Sign in again to continue." }, { status: 401 });
    }

    const { data: actorProfile, error: actorProfileError } = await sessionClient
      .from("profiles")
      .select("role, status")
      .eq("id", actor.id)
      .maybeSingle();

    if (actorProfileError) {
      console.error("Could not verify administrator for customer action:", actorProfileError);
      return NextResponse.json({ error: "Unable to verify administrator access." }, { status: 500 });
    }

    if (actorProfile?.role !== "admin" || actorProfile.status !== "active") {
      return NextResponse.json({ error: "Active administrator access is required." }, { status: 403 });
    }

    if (actor.id === userId) {
      return NextResponse.json({ error: "You cannot perform this action on your own account." }, { status: 400 });
    }

    const adminClient = createAdminClient();
    const { data: customer, error: customerError } = await adminClient
      .from("profiles")
      .select("id, role, status, archived_at")
      .eq("id", userId)
      .maybeSingle();

    if (customerError) {
      console.error("Could not load customer for administrator action:", customerError);
      return NextResponse.json({ error: "Unable to load the selected customer." }, { status: 500 });
    }

    if (!customer || customer.role !== "user") {
      return NextResponse.json({ error: "The selected customer was not found." }, { status: 404 });
    }

    if (action === "delete") {
      if (!customer.archived_at) {
        const { error: archiveError } = await adminClient.rpc("admin_archive_customer", {
          p_actor_id: actor.id,
          p_user_id: userId,
        });

        if (archiveError) {
          console.error("Could not archive customer:", archiveError);
          return NextResponse.json({ error: archiveError.message }, { status: 400 });
        }
      }

      const { error: banError } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "876000h",
      });

      if (banError) {
        console.error("Customer archived but Auth deactivation failed:", banError);
        return NextResponse.json(
          {
            error:
              "The customer was archived and protected routes are blocked, but authentication deactivation did not complete. Retry the delete action or contact support.",
            archived: true,
            authActionIncomplete: true,
          },
          { status: 502 },
        );
      }

      return NextResponse.json({ success: true, archived: true });
    }

    if (customer.archived_at) {
      return NextResponse.json({ error: "Archived customers cannot change status." }, { status: 409 });
    }

    const requestedStatus = action === "suspend" ? "suspended" : "active";
    if (action === "unsuspend") {
      const { error: unbanError } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "none",
      });

      if (unbanError) {
        console.error("Could not restore customer Auth access:", unbanError);
        return NextResponse.json(
          {
            error: "Unable to restore the customer's authentication access; the account remains suspended.",
            status: "suspended",
            authActionIncomplete: true,
          },
          { status: 502 },
        );
      }
    }

    const { error: statusError } = await adminClient.rpc("admin_set_customer_status", {
      p_actor_id: actor.id,
      p_user_id: userId,
      p_status: requestedStatus,
    });

    if (statusError) {
      console.error("Could not update customer status:", statusError);
      return NextResponse.json(
        {
          error:
            action === "unsuspend"
              ? "Authentication is restored, but the account is still suspended. Retry Unsuspend or contact support."
              : statusError.message,
          ...(action === "unsuspend"
            ? { status: "suspended", authActionIncomplete: true }
            : {}),
        },
        { status: action === "unsuspend" ? 502 : 400 },
      );
    }

    if (action === "suspend") {
      const { error: banError } = await adminClient.auth.admin.updateUserById(userId, {
        ban_duration: "876000h",
      });

      if (banError) {
        console.error("Customer is suspended but Auth sign-in ban failed:", banError);
        return NextResponse.json(
          {
            error:
              "The customer status is suspended and database access is blocked, but authentication deactivation did not complete. Retry Suspend or contact support.",
            status: "suspended",
            authActionIncomplete: true,
          },
          { status: 502 },
        );
      }
    }

    return NextResponse.json({ success: true, status: requestedStatus });
  } catch (error) {
    console.error("Unexpected administrator customer-action error:", error);
    return NextResponse.json({ error: "Unable to process the customer action." }, { status: 500 });
  }
}
