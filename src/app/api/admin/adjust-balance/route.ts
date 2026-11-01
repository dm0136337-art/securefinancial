import { NextResponse } from "next/server";

import { createClient } from "@/lib/supabase/server";

type AdjustmentRequest = {
  userId?: unknown;
  type?: unknown;
  amount?: unknown;
  note?: unknown;
  idempotencyKey?: unknown;
};

const uuidPattern = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
const amountPattern = /^\d+(?:\.\d{1,2})?$/;

export async function POST(request: Request) {
  let body: AdjustmentRequest;

  try {
    const parsedBody: unknown = await request.json();
    if (!parsedBody || typeof parsedBody !== "object" || Array.isArray(parsedBody)) {
      return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
    }
    body = parsedBody as AdjustmentRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body." }, { status: 400 });
  }

  const userId = typeof body.userId === "string" ? body.userId : "";
  const type = body.type === "credit" || body.type === "debit" ? body.type : "";
  const amountText =
    typeof body.amount === "string" || typeof body.amount === "number"
      ? String(body.amount)
      : "";
  const note = typeof body.note === "string" ? body.note.trim() : "";
  const idempotencyKey =
    typeof body.idempotencyKey === "string" ? body.idempotencyKey : "";

  if (!uuidPattern.test(userId) || !uuidPattern.test(idempotencyKey)) {
    return NextResponse.json({ error: "Invalid customer or request identifier." }, { status: 400 });
  }

  if (!type) {
    return NextResponse.json({ error: "Choose credit or debit." }, { status: 400 });
  }

  if (!amountPattern.test(amountText) || !Number.isFinite(Number(amountText)) || Number(amountText) <= 0) {
    return NextResponse.json(
      { error: "Amount must be greater than zero and have no more than two decimal places." },
      { status: 400 },
    );
  }

  if (note.length < 3 || note.length > 500) {
    return NextResponse.json(
      { error: "A transaction note between 3 and 500 characters is required." },
      { status: 400 },
    );
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

    const { data: adminProfile, error: adminProfileError } = await supabase
      .from("profiles")
      .select("role, status")
      .eq("id", user.id)
      .maybeSingle();

    if (adminProfileError) {
      console.error("Could not verify administrator for balance adjustment:", adminProfileError);
      return NextResponse.json({ error: "Unable to verify administrator access." }, { status: 500 });
    }

    if (adminProfile?.role !== "admin" || adminProfile.status !== "active") {
      return NextResponse.json({ error: "Active administrator access is required." }, { status: 403 });
    }

    const { data: customer, error: customerError } = await supabase
      .from("profiles")
      .select("id")
      .eq("id", userId)
      .eq("role", "user")
      .maybeSingle();

    if (customerError) {
      console.error("Could not verify balance adjustment target:", customerError);
      return NextResponse.json({ error: "Unable to verify the selected customer." }, { status: 500 });
    }

    if (!customer) {
      return NextResponse.json({ error: "The selected customer was not found." }, { status: 404 });
    }

    const { data: previousTransaction, error: previousTransactionError } = await supabase
      .from("transactions")
      .select("id, user_id, type, amount, note")
      .eq("idempotency_key", idempotencyKey)
      .maybeSingle();

    if (previousTransactionError) {
      console.error("Could not check the balance adjustment idempotency key:", previousTransactionError);
      return NextResponse.json({ error: "Unable to verify this adjustment request." }, { status: 500 });
    }

    if (previousTransaction) {
      const sameRequest =
        previousTransaction.user_id === userId &&
        previousTransaction.type === type &&
        Number(previousTransaction.amount) === Number(amountText) &&
        previousTransaction.note === note;

      if (sameRequest) {
        return NextResponse.json({ transactionId: previousTransaction.id, repeated: true });
      }

      return NextResponse.json(
        { error: "This request identifier was already used for a different adjustment." },
        { status: 409 },
      );
    }

    const rpcArgs = {
      p_user_id: userId,
      p_type: type,
      p_amount: amountText,
      p_note: note,
      p_idempotency_key: idempotencyKey,
    };
    const { data: transactionId, error: rpcError } = await supabase.rpc(
      "admin_adjust_balance",
      rpcArgs,
    );

    if (rpcError) {
      if (rpcError.code === "23505") {
        const { data: existingTransaction, error: lookupError } = await supabase
          .from("transactions")
          .select("id, user_id, type, amount, note")
          .eq("idempotency_key", idempotencyKey)
          .maybeSingle();

        if (lookupError) {
          console.error("Could not verify idempotent adjustment retry:", lookupError);
          return NextResponse.json({ error: "Unable to verify the previous adjustment." }, { status: 500 });
        }

        const sameRequest =
          existingTransaction &&
          existingTransaction.user_id === userId &&
          existingTransaction.type === type &&
          Number(existingTransaction.amount) === Number(amountText) &&
          existingTransaction.note === note;

        if (sameRequest) {
          return NextResponse.json({ transactionId: existingTransaction.id, repeated: true });
        }
      }

      return NextResponse.json({ error: rpcError.message }, { status: 400 });
    }

    if (typeof transactionId !== "string" || !uuidPattern.test(transactionId)) {
      console.error("admin_adjust_balance returned an invalid transaction ID:", transactionId);
      return NextResponse.json(
        { error: "The adjustment response could not be verified. Contact support before retrying." },
        { status: 500 },
      );
    }

    return NextResponse.json({ transactionId, repeated: false });
  } catch (error) {
    console.error("Unexpected balance adjustment route error:", error);
    return NextResponse.json({ error: "Unable to process the balance adjustment." }, { status: 500 });
  }
}
