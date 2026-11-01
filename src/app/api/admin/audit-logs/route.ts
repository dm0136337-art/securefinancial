import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

const PAGE_SIZE = 25;
const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const timestampPattern =
  /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(?:\.\d{1,6})?(?:Z|[+-]\d{2}:\d{2})$/;
const actionPattern = /^[a-zA-Z0-9_.:-]{1,100}$/;

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams;
  const customerId = searchParams.get("customerId")?.trim() ?? "";
  const action = searchParams.get("action")?.trim() ?? "";
  const cursorCreatedAt = searchParams.get("cursorCreatedAt") ?? "";
  const cursorId = searchParams.get("cursorId") ?? "";

  if (customerId && !uuidPattern.test(customerId)) {
    return NextResponse.json({ error: "Invalid customer filter." }, { status: 400 });
  }

  if (action && !actionPattern.test(action)) {
    return NextResponse.json({ error: "Invalid action filter." }, { status: 400 });
  }

  if (
    Boolean(cursorCreatedAt) !== Boolean(cursorId) ||
    (cursorCreatedAt &&
      (!timestampPattern.test(cursorCreatedAt) || !Number.isFinite(Date.parse(cursorCreatedAt)))) ||
    (cursorId && !uuidPattern.test(cursorId))
  ) {
    return NextResponse.json({ error: "Invalid audit pagination cursor." }, { status: 400 });
  }

  try {
    const supabase = await createClient();
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json({ error: "Sign in again to continue." }, { status: 401 });
    }

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (profileError) {
      console.error("Could not verify administrator for audit history:", profileError);
      return NextResponse.json({ error: "Unable to verify administrator access." }, { status: 500 });
    }

    if (profile?.role !== "admin" || profile.status !== "active") {
      return NextResponse.json({ error: "Active administrator access is required." }, { status: 403 });
    }

    let query = supabase
      .from("audit_logs")
      .select("*")
      .order("created_at", { ascending: false })
      .order("id", { ascending: false })
      .limit(PAGE_SIZE + 1);

    if (customerId) query = query.eq("target_user_id", customerId);
    if (action) query = query.eq("action", action);
    if (cursorCreatedAt && cursorId) {
      query = query.or(
        `created_at.lt.${cursorCreatedAt},and(created_at.eq.${cursorCreatedAt},id.lt.${cursorId})`,
      );
    }

    const { data: rows, error: auditError } = await query;
    if (auditError) {
      console.error("Could not load administrator audit history:", auditError);
      return NextResponse.json({ error: "Unable to load audit history." }, { status: 500 });
    }

    const pageRows = rows ?? [];
    const hasMore = pageRows.length > PAGE_SIZE;

    return NextResponse.json({
      auditLogs: pageRows.slice(0, PAGE_SIZE) as Record<string, unknown>[],
      hasMore,
    });
  } catch (error) {
    console.error("Unexpected audit history route error:", error);
    return NextResponse.json({ error: "Unable to load audit history." }, { status: 500 });
  }
}
