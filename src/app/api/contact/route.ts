import { NextResponse } from "next/server";

import { saveContactSubmission, type ContactSubmission } from "@/lib/supabase";

const contactMessages: ContactSubmission[] = [];

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<ContactSubmission>;
    const submission: ContactSubmission = {
      name: String(body.name ?? "").trim(),
      email: String(body.email ?? "").trim(),
      subject: String(body.subject ?? "").trim(),
      message: String(body.message ?? "").trim(),
    };

    if (!submission.name || !submission.email || !submission.subject || !submission.message) {
      return NextResponse.json({ error: "Missing required contact fields." }, { status: 400 });
    }

    contactMessages.push(submission);
    await saveContactSubmission(submission);

    return NextResponse.json({ success: true, saved: true }, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Unable to submit your message." },
      { status: 500 },
    );
  }
}
