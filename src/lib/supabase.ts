import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

export const supabase =
  supabaseUrl && supabaseAnonKey ? createClient(supabaseUrl, supabaseAnonKey) : null;

export type ContactSubmission = {
  name: string;
  email: string;
  subject: string;
  message: string;
};

export async function saveContactSubmission(submission: ContactSubmission) {
  if (!supabase) {
    return { ok: true, mode: "local-demo" };
  }

  const { error } = await supabase.from("contact_messages").insert([
    {
      name: submission.name,
      email: submission.email,
      subject: submission.subject,
      message: submission.message,
      created_at: new Date().toISOString(),
    },
  ]);

  if (error) {
    throw new Error(error.message);
  }

  return { ok: true, mode: "supabase" };
}
