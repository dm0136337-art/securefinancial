"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  ArrowRight,
  Ban,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Globe,
  House,
  Lock,
  LogOut,
  Mail,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShieldEllipsis,
  Trash2,
  UserCog,
  UserRoundCheck,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  formatCurrency,
} from "@/lib/data";
import { createClient } from "@/lib/supabase/client";
import type { AdminDashboardPayload } from "@/lib/admin-dashboard-types";

const featureCards = [
  { title: "Protected account access", text: "Secure user logins and permission-based dashboards." },
  { title: "Real-time financial views", text: "Track balances, credits, deductions, and account status." },
  { title: "Administrator controls", text: "Manage accounts, adjustments, and user support in one place." },
];

const navItems = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Contact", href: "/contact" },
  { label: "Login", href: "/login" },
  { label: "Register", href: "/register" },
];

function SiteHeader() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isSigningOut, setIsSigningOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  useEffect(() => {
    const supabase = createClient();
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setIsAuthenticated(Boolean(session));
    });

    return () => subscription.unsubscribe();
  }, []);

  async function handleSignOut() {
    if (isSigningOut) return;

    setLogoutError("");
    setIsSigningOut(true);

    try {
      const { error } = await createClient().auth.signOut();
      if (error) {
        setLogoutError(error.message);
        return;
      }

      window.location.assign("/login?reason=logout");
    } catch (signOutError) {
      setLogoutError(
        signOutError instanceof Error
          ? signOutError.message
          : "Unable to log out. Please try again.",
      );
    } finally {
      setIsSigningOut(false);
    }
  }

  return (
    <header className="sticky top-0 z-50 border-b border-slate-200 bg-white/90 backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-sm">
            <ShieldCheck className="h-5 w-5" />
          </div>
          <div>
            <div className="text-lg font-bold text-slate-900">Secure Financial</div>
            <div className="text-xs font-medium uppercase tracking-[0.18em] text-slate-500">Virtual account platform</div>
          </div>
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href} className="text-sm font-medium text-slate-600 transition hover:text-blue-600">
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {isAuthenticated ? (
            <button
              type="button"
              onClick={handleSignOut}
              disabled={isSigningOut}
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-70"
            >
              <LogOut className="h-4 w-4" />
              {isSigningOut ? "Logging out..." : "Logout"}
            </button>
          ) : (
            <Link
              href="/login"
              className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
            >
              Access portal
              <ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>

        <button
          type="button"
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-slate-200 text-slate-700 md:hidden"
          onClick={() => setMenuOpen((v) => !v)}
          aria-label="Toggle menu"
        >
          {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      {menuOpen && (
        <div className="border-t border-slate-200 bg-white md:hidden">
          <nav className="mx-auto flex max-w-7xl flex-col gap-2 px-4 py-4 sm:px-6">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="rounded-xl px-3 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100">
                {item.label}
              </Link>
            ))}
            {isAuthenticated && (
              <button
                type="button"
                onClick={handleSignOut}
                disabled={isSigningOut}
                className="inline-flex items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold text-blue-700 hover:bg-blue-50 disabled:opacity-70"
              >
                <LogOut className="h-4 w-4" />
                {isSigningOut ? "Logging out..." : "Logout"}
              </button>
            )}
          </nav>
        </div>
      )}
      {logoutError && (
        <p role="alert" className="mx-auto max-w-7xl px-4 pb-3 text-sm text-rose-600 sm:px-6 lg:px-8">
          Logout failed: {logoutError}
        </p>
      )}
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50">
      <div className="mx-auto grid max-w-7xl gap-8 px-4 py-10 sm:px-6 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white">
              <ShieldCheck className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-bold text-slate-900">Secure Financial</div>
            </div>
          </div>
          <p className="text-sm leading-6 text-slate-600">
            Professional account management for administrators and account holders seeking a secure, modern experience.
          </p>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Platform</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li><Link href="/about">About</Link></li>
            <li><Link href="/contact">Contact</Link></li>
            <li><Link href="/login">Login</Link></li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Security</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li>Role-based access</li>
            <li>Encrypted data flows</li>
            <li>Audit-friendly notes</li>
          </ul>
        </div>
        <div>
          <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.18em] text-slate-500">Contact</h3>
          <ul className="space-y-3 text-sm text-slate-600">
            <li className="flex items-center gap-2"><Mail className="h-4 w-4" /> hello@securefinancial.com</li>
            <li className="flex items-center gap-2"><Phone className="h-4 w-4" /> +1 (415) 555-2024</li>
            <li className="flex items-center gap-2"><Globe className="h-4 w-4" /> securefinancial.com</li>
          </ul>
        </div>
      </div>
      <div className="border-t border-slate-200 px-4 py-5 text-center text-sm text-slate-500">
        © 2026 Secure Financial. All rights reserved.
      </div>
    </footer>
  );
}

function PageShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      <SiteHeader />
      <main>{children}</main>
      <SiteFooter />
    </div>
  );
}

function HomePage() {
  return (
    <PageShell>
      <section className="bg-gradient-to-b from-blue-600 via-blue-600 to-blue-700 text-white">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-20 sm:px-6 lg:grid-cols-2 lg:px-8">
          <div>
            <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-sm font-medium text-blue-50">
              <ShieldCheck className="h-4 w-4" /> Trusted account oversight
            </div>
            <h1 className="max-w-xl text-4xl font-bold tracking-tight sm:text-5xl">
              Secure financial operations for every account.
            </h1>
            <p className="mt-6 max-w-xl text-lg text-blue-50/90">
              Manage personal balances, review account activity, and enable administrators to approve adjustments with confidence.
            </p>
            <div className="mt-8 flex flex-col gap-4 sm:flex-row">
              <Link href="/register" className="inline-flex items-center justify-center rounded-full bg-white px-6 py-3 font-semibold text-blue-700 shadow-sm transition hover:bg-slate-100">
                Create account
              </Link>
              <Link href="/login" className="inline-flex items-center justify-center rounded-full border border-white/30 px-6 py-3 font-semibold text-white transition hover:bg-white/10">
                Sign in
              </Link>
            </div>
            <div className="mt-10 flex flex-wrap gap-5 text-sm text-blue-50/90">
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> RLS-ready data model</span>
              <span className="inline-flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Mobile responsive</span>
            </div>
          </div>

          <div className="rounded-[28px] border border-white/20 bg-white/10 p-4 shadow-2xl shadow-blue-900/20 backdrop-blur-sm">
            <div className="rounded-[24px] bg-white p-6 text-slate-900">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm text-slate-500">Portfolio balance</p>
                  <h2 className="mt-1 text-3xl font-bold">{formatCurrency(8240.5)}</h2>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-700">
                  <Wallet className="h-6 w-6" />
                </div>
              </div>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500"><BanknoteArrowUp className="h-4 w-4 text-emerald-600" /> Total added</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(18500)}</div>
                </div>
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="flex items-center gap-2 text-sm text-slate-500"><BanknoteArrowDown className="h-4 w-4 text-rose-600" /> Total deducted</div>
                  <div className="mt-2 text-xl font-bold text-slate-900">{formatCurrency(10259.5)}</div>
                </div>
              </div>
              <div className="mt-6 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <div className="flex items-center justify-between text-sm text-slate-500">
                  <span>Recent transaction</span>
                  <span>Today</span>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <span className="font-medium text-slate-900">Account adjustment</span>
                  <span className="font-bold text-emerald-600">+{formatCurrency(850)}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Why Secure Financial</p>
          <h2 className="mt-4 text-3xl font-bold text-slate-900">A polished system built for financial clarity.</h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {featureCards.map((feature) => (
            <div key={feature.title} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
                <CreditCard className="h-6 w-6" />
              </div>
              <h3 className="text-xl font-semibold text-slate-900">{feature.title}</h3>
              <p className="mt-3 text-slate-600">{feature.text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-slate-900 text-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-3 lg:px-8">
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <Users className="h-8 w-8 text-blue-400" />
            <div className="mt-5 text-3xl font-bold">18.4K</div>
            <p className="mt-2 text-slate-300">Registered users</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <Wallet className="h-8 w-8 text-emerald-400" />
            <div className="mt-5 text-3xl font-bold">$142.8M</div>
            <p className="mt-2 text-slate-300">Managed balance volume</p>
          </div>
          <div className="rounded-3xl border border-slate-700 bg-slate-800 p-6">
            <ShieldEllipsis className="h-8 w-8 text-amber-400" />
            <div className="mt-5 text-3xl font-bold">99.98%</div>
            <p className="mt-2 text-slate-300">Secure transaction integrity</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function AboutPage() {
  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="max-w-3xl">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Our mission</p>
          <h1 className="mt-4 text-4xl font-bold text-slate-900">Built to help people manage their financial lives with clarity and trust.</h1>
          <p className="mt-6 text-lg text-slate-600">
            Secure Financial brings together account visibility, transaction history, and administrator oversight in a single modern workspace.
          </p>
        </div>

        <div className="mt-12 grid gap-8 md:grid-cols-3">
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <House className="h-8 w-8 text-blue-600" />
            <h3 className="mt-5 text-xl font-semibold">Users</h3>
            <p className="mt-3 text-slate-600">Personal dashboard and profile access with secure transaction history.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <UserCog className="h-8 w-8 text-blue-600" />
            <h3 className="mt-5 text-xl font-semibold">Admin team</h3>
            <p className="mt-3 text-slate-600">Permission-based controls to manage balances and account status.</p>
          </div>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <Building2 className="h-8 w-8 text-blue-600" />
            <h3 className="mt-5 text-xl font-semibold">Operations</h3>
            <p className="mt-3 text-slate-600">Transparent notes, detailed audit trails, and reliable review processes.</p>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function ContactPage() {
  const [values, setValues] = useState({ name: "", email: "", subject: "", message: "" });
  const [status, setStatus] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const response = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });

    if (response.ok) {
      setStatus("Thank you — your message has been submitted successfully.");
      setValues({ name: "", email: "", subject: "", message: "" });
      return;
    }

    setStatus("Something went wrong while saving your message. Please try again.");
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-6xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Contact us</p>
            <h1 className="mt-4 text-4xl font-bold text-slate-900">We are here to help.</h1>
            <p className="mt-4 text-lg text-slate-600">Reach out for support, account configuration, or operational guidance.</p>
            <div className="mt-8 space-y-4 text-slate-600">
              <div className="flex items-center gap-3"><Mail className="h-5 w-5 text-blue-600" /> hello@securefinancial.com</div>
              <div className="flex items-center gap-3"><Phone className="h-5 w-5 text-blue-600" /> +1 (415) 555-2024</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="grid gap-5 sm:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                Name
                <input
                  required
                  value={values.name}
                  onChange={(e) => setValues((v) => ({ ...v, name: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Your name"
                />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Email
                <input
                  required
                  type="email"
                  value={values.email}
                  onChange={(e) => setValues((v) => ({ ...v, email: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </label>
            </div>
            <label className="mt-5 block text-sm font-medium text-slate-700">
              Subject
              <input
                required
                value={values.subject}
                onChange={(e) => setValues((v) => ({ ...v, subject: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="How can we help?"
              />
            </label>
            <label className="mt-5 block text-sm font-medium text-slate-700">
              Message
              <textarea
                required
                rows={6}
                value={values.message}
                onChange={(e) => setValues((v) => ({ ...v, message: e.target.value }))}
                className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                placeholder="Tell us more about your inquiry..."
              />
            </label>

            {status && <p className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-700">{status}</p>}

            <button type="submit" className="mt-6 inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
              Send message
            </button>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function LoginPage({ redirectReason }: { redirectReason?: string }) {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    const email = form.email.trim();
    const password = form.password;

    if (!email || !password) {
      setError("Please enter both your email and password.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: signInError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (signInError) {
        setError(signInError.message || "Invalid email or password.");
        return;
      }

      if (!data.user || !data.session) {
        setError("Sign in did not establish a session. Please try again.");
        return;
      }

      const {
        data: { user: verifiedUser },
        error: sessionError,
      } = await supabase.auth.getUser();

      if (sessionError || !verifiedUser || verifiedUser.id !== data.user.id) {
        setError("Your session could not be verified. Please sign in again.");
        return;
      }

      const { data: userProfile, error: profileError } = await supabase
        .from("profiles")
        .select("role, status")
        .eq("id", verifiedUser.id)
        .maybeSingle();

      if (profileError) {
        setError(`Unable to verify your account permissions: ${profileError.message}`);
        return;
      }

      if (!userProfile) {
        setError("Your account profile was not found. Please contact support.");
        return;
      }

      if (userProfile.status !== "active") {
        setError("This account is suspended. Contact an administrator for assistance.");
        return;
      }

      const designatedAdminEmail = "dm0136337@gmail.com";
      if (
        email.toLowerCase() === designatedAdminEmail &&
        userProfile.role !== "admin"
      ) {
        setError("The designated administrator account is not authorized. Contact support.");
        return;
      }

      if (userProfile.role === "admin") {
        router.replace("/admin");
      } else if (userProfile.role === "user") {
        router.replace("/dashboard");
      } else {
        setError("This account does not have an authorized role.");
      }
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Unable to log in right now. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 overflow-hidden rounded-[32px] border border-slate-200 bg-white shadow-sm lg:grid-cols-2">
          <div className="bg-gradient-to-br from-blue-600 to-blue-800 p-8 text-white">
            <div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/10">
              <Lock className="h-6 w-6" />
            </div>
            <h1 className="text-3xl font-bold">Welcome back.</h1>
            <p className="mt-4 text-blue-50/90">
              Secure access to account management, transaction records, and policy controls.
            </p>
            <div className="mt-8 space-y-3 text-sm text-blue-50/90">
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Instant account overview</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Role-aware dashboard access</div>
              <div className="flex items-center gap-2"><CheckCircle2 className="h-4 w-4" /> Protected identity checks</div>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            <h2 className="text-2xl font-bold text-slate-900">Login to Secure Financial</h2>
            {redirectReason === "session-missing" && (
              <p role="status" className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Your session is missing or has expired. Please sign in again.
              </p>
            )}
            {redirectReason === "logout" && (
              <p role="status" className="mt-5 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
                You have been logged out.
              </p>
            )}
            {redirectReason === "suspended" && (
              <p role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                This account is suspended. Contact an administrator for assistance.
              </p>
            )}
            {redirectReason === "unauthorized" && (
              <p role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
                Your account is not authorized to access that page.
              </p>
            )}
            <div className="mt-7 space-y-5">
              <label className="block text-sm font-medium text-slate-700">
                Email address
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="you@example.com"
                />
              </label>
              <label className="block text-sm font-medium text-slate-700">
                Password
                <input
                  type="password"
                  required
                  value={form.password}
                  onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))}
                  className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500"
                  placeholder="Enter your password"
                />
              </label>
            </div>

            {error && <p className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-600">{error}</p>}

            <div className="mt-6 flex items-center justify-between gap-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? "Signing in..." : "Sign in"}
              </button>
            </div>

            <div className="mt-6 text-sm text-slate-500">
              Need an account? <Link href="/register" className="font-semibold text-blue-600">Register here</Link>
            </div>
          </form>
        </div>
      </section>
    </PageShell>
  );
}

function RegisterPage() {
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    address: "",
  });
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (isSubmitting) {
      return;
    }

    setError("");
    setMessage("");

    const firstName = form.firstName.trim();
    const lastName = form.lastName.trim();
    const email = form.email.trim();
    const password = form.password;
    const address = form.address.trim();

    if (!firstName || !lastName || !email || !password || !address) {
      setError("Please complete all required fields before registering.");
      return;
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsSubmitting(true);

    try {
      const supabase = createClient();
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            first_name: firstName,
            last_name: lastName,
            address,
          },
        },
      });

      if (signUpError) {
        setError(signUpError.message || "Unable to create your account at this time.");
        return;
      }

      if (!data.session) {
        setMessage(
          `Account created for ${firstName} ${lastName}. Please verify your email before logging in.`,
        );
      } else {
        setMessage(`Account profile created for ${firstName} ${lastName}. You can now log in.`);
      }

      setForm({ firstName: "", lastName: "", email: "", password: "", address: "" });
    } catch (submitError) {
      setError(
        submitError instanceof Error
          ? submitError.message
          : "Something went wrong while creating your account.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="rounded-[32px] border border-slate-200 bg-white p-6 shadow-sm sm:p-8 lg:p-10">
          <div className="mb-8">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Registration</p>
            <h1 className="mt-3 text-3xl font-bold text-slate-900">Create your user profile</h1>
          </div>

          <form onSubmit={handleSubmit} className="grid gap-5 md:grid-cols-2">
            <label className="text-sm font-medium text-slate-700">
              First name
              <input required value={form.firstName} onChange={(e) => setForm((v) => ({ ...v, firstName: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="First name" />
            </label>
            <label className="text-sm font-medium text-slate-700">
              Last name
              <input required value={form.lastName} onChange={(e) => setForm((v) => ({ ...v, lastName: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Last name" />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Email address
              <input type="email" required value={form.email} onChange={(e) => setForm((v) => ({ ...v, email: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="you@example.com" />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Password
              <input type="password" required value={form.password} onChange={(e) => setForm((v) => ({ ...v, password: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Create a strong password" />
            </label>
            <label className="text-sm font-medium text-slate-700 md:col-span-2">
              Residential address
              <input required value={form.address} onChange={(e) => setForm((v) => ({ ...v, address: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none transition focus:border-blue-500" placeholder="Street, city, state" />
            </label>

            <div className="md:col-span-2 flex items-center justify-between gap-4 pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:bg-blue-400"
              >
                {isSubmitting ? "Creating account..." : "Register account"}
              </button>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Already have an account?</Link>
            </div>
          </form>

          {error && <p className="mt-6 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}
          {message && <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        </div>
      </section>
    </PageShell>
  );
}

function DashboardPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [userId, setUserId] = useState("");
  const [photoPath, setPhotoPath] = useState("");
  const [photoError, setPhotoError] = useState("");
  const [isUploadingPhoto, setIsUploadingPhoto] = useState(false);
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    photo: "",
    status: "active",
    balance: 0,
    totalCredited: 0,
    totalDebited: 0,
  });
  const [transactions, setTransactions] = useState<Array<{ id: string; amount: number; note: string; type: "credit" | "debit" | "adjustment"; createdAt: string; adminName: string }>>([]);

  useEffect(() => {
    let isMounted = true;
    let currentStep = "Supabase client initialization";

    async function loadDashboardData() {
      try {
        const supabase = createClient();
        currentStep = "auth.getUser()";
        const {
          data: { user },
          error: authError,
        } = await supabase.auth.getUser();

        if (authError) {
          if (
            authError.message === "Auth session missing!" ||
            authError.name === "AuthSessionMissingError"
          ) {
            router.replace("/login?reason=session-missing");
            return;
          }
          throw authError;
        }

        if (!user) {
          router.replace("/login?reason=session-missing");
          return;
        }
        if (isMounted) setUserId(user.id);

        currentStep = "profiles query (profiles.id = authenticated user ID)";
        const { data: profileData, error: profileError } = await supabase
          .from("profiles")
          .select("*")
          .eq("id", user.id)
          .maybeSingle();

        if (profileError) {
          throw profileError;
        }

        currentStep = "accounts query (accounts.user_id = authenticated user ID)";
        const { data: accountData, error: accountError } = await supabase
          .from("accounts")
          .select("*")
          .eq("user_id", user.id)
          .maybeSingle();

        if (accountError) {
          throw accountError;
        }

        if (process.env.NODE_ENV === "development") {
          if (!profileData) {
            console.warn("Dashboard diagnostic: no public.profiles row found for the authenticated user.");
          }
          if (!accountData) {
            console.warn("Dashboard diagnostic: no public.accounts row found for the authenticated user.");
          }
        }

        const profileRow = profileData ?? {};
        const accountRow = accountData ?? {};
        const storedPhotoPath =
          typeof profileRow.photo_url === "string" && !profileRow.photo_url.startsWith("http")
            ? profileRow.photo_url
            : "";
        let photoUrl = "";

        if (storedPhotoPath) {
          currentStep = "signed URL creation for profile photo";
          const { data: signedUrlData, error: signedUrlError } = await supabase.storage
            .from("profile-photos")
            .createSignedUrl(storedPhotoPath, 5 * 60);
          if (signedUrlError) {
            throw signedUrlError;
          }
          photoUrl = signedUrlData.signedUrl;
        }

        const normalizedProfile = {
          firstName: String(profileRow.first_name ?? profileRow.firstName ?? "User"),
          lastName: String(profileRow.last_name ?? profileRow.lastName ?? ""),
          email: String(profileRow.email ?? user.email ?? ""),
          address: String(profileRow.address ?? ""),
          photo: photoUrl,
          status: String(profileRow.status ?? accountRow.status ?? "active"),
          balance: Number(accountRow.balance ?? 0),
          totalCredited: Number(accountRow.total_credited ?? accountRow.totalCredited ?? 0),
          totalDebited: Number(accountRow.total_debited ?? accountRow.totalDebited ?? 0),
        };

        if (!isMounted) return;
        setProfile(normalizedProfile);
        setPhotoPath(storedPhotoPath);

        currentStep = "transactions query (transactions.user_id = authenticated user ID)";
        const { data: transactionData, error: transactionError } = await supabase
          .from("transactions")
          .select("*")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false });

        if (transactionError) {
          throw transactionError;
        }

        if (!isMounted) return;
        setTransactions(
          (transactionData ?? []).map((item) => ({
            id: String(item.id),
            amount: Number(item.amount ?? 0),
            note: String(item.note ?? "Account activity"),
            type: item.type === "debit" ? "debit" : item.type === "adjustment" ? "adjustment" : "credit",
            createdAt: String(item.created_at ?? ""),
            adminName: String(item.admin_name ?? item.adminName ?? "System"),
          })),
        );
      } catch (loadError) {
        if (!isMounted) return;
        const supabaseError =
          loadError && typeof loadError === "object"
            ? (loadError as {
                message?: unknown;
                code?: unknown;
                details?: unknown;
                hint?: unknown;
              })
            : undefined;
        const message =
          loadError instanceof Error
            ? loadError.message
            : typeof supabaseError?.message === "string"
              ? supabaseError.message
              : String(loadError);
        const diagnostics = [
          `Dashboard load failed at ${currentStep}: ${message}`,
          typeof supabaseError?.code === "string" ? `code: ${supabaseError.code}` : "",
          typeof supabaseError?.details === "string" ? `details: ${supabaseError.details}` : "",
          typeof supabaseError?.hint === "string" ? `hint: ${supabaseError.hint}` : "",
        ]
          .filter(Boolean)
          .join(" | ");

        if (process.env.NODE_ENV === "development") {
          console.error("Dashboard Supabase diagnostic:", { step: currentStep, error: loadError });
        }
        setError(
          process.env.NODE_ENV === "development"
            ? diagnostics
            : "Unable to load your account information right now. Please try again later.",
        );
      } finally {
        if (isMounted) setLoading(false);
      }
    }

    loadDashboardData();

    return () => {
      isMounted = false;
    };
  }, [router]);

  async function handlePhotoUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    event.target.value = "";
    if (!file) return;

    const allowedTypes: Record<string, string> = {
      "image/jpeg": "jpg",
      "image/png": "png",
      "image/webp": "webp",
      "image/gif": "gif",
    };

    if (!allowedTypes[file.type]) {
      setPhotoError("Choose a JPEG, PNG, WebP, or GIF image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("Image must be 5 MB or smaller.");
      return;
    }

    if (!userId) {
      setPhotoError("Your session is unavailable. Please sign in again.");
      return;
    }

    setPhotoError("");
    setIsUploadingPhoto(true);
    const supabase = createClient();
    const newPath = `${userId}/${crypto.randomUUID()}.${allowedTypes[file.type]}`;
    const cleanupNewPhoto = async () => {
      const { error } = await supabase.storage.from("profile-photos").remove([newPath]);
      if (error) {
        console.error("Failed to remove an incomplete profile photo upload:", error);
      }
    };

    try {
      const { error: uploadError } = await supabase.storage
        .from("profile-photos")
        .upload(newPath, file, {
          cacheControl: "300",
          contentType: file.type,
          upsert: false,
        });

      if (uploadError) throw uploadError;

      const { data: signedUrlData, error: signedUrlError } = await supabase.storage
        .from("profile-photos")
        .createSignedUrl(newPath, 5 * 60);
      if (signedUrlError) {
        await cleanupNewPhoto();
        throw signedUrlError;
      }

      const { error: profileUpdateError } = await supabase.rpc("set_own_profile_photo", {
        photo_path: newPath,
      });
      if (profileUpdateError) {
        await cleanupNewPhoto();
        throw profileUpdateError;
      }

      setProfile((current) => ({ ...current, photo: signedUrlData.signedUrl }));
      const previousPath = photoPath;
      setPhotoPath(newPath);

      if (previousPath && previousPath !== newPath) {
        const { error: removeError } = await supabase.storage
          .from("profile-photos")
          .remove([previousPath]);
        if (removeError) {
          setPhotoError("Photo updated. The previous stored image could not be removed.");
        }
      }
    } catch (uploadError) {
      setPhotoError(
        uploadError instanceof Error
          ? uploadError.message
          : "Unable to upload your profile photo.",
      );
    } finally {
      setIsUploadingPhoto(false);
    }
  }

  if (loading) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-slate-200 bg-white p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-slate-900">Loading your account...</p>
          </div>
        </section>
      </PageShell>
    );
  }

  if (error) {
    return (
      <PageShell>
        <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-center shadow-sm">
            <p className="text-lg font-semibold text-rose-700">Unable to load your dashboard.</p>
            <p className="mt-2 text-sm text-rose-600">{error}</p>
          </div>
        </section>
      </PageShell>
    );
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">User dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {profile.firstName || "User"}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {profile.status === "suspended" ? "Account suspended" : "Account active"}
          </div>
        </div>

        <div className="grid gap-6 sm:grid-cols-2">
          <StatCard label="Current balance" value={formatCurrency(profile.balance)} tone="blue" icon={<Wallet className="h-5 w-5" />} />
          <StatCard label="Account status" value={profile.status === "suspended" ? "Suspended" : "Active"} tone="slate" icon={<ShieldCheck className="h-5 w-5" />} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Profile</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Secure view</span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Image
                src={profile.photo || "https://ui-avatars.com/api/?name=" + encodeURIComponent(`${profile.firstName} ${profile.lastName}`)}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-50"
              />
              <label className={`inline-flex items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700 ${isUploadingPhoto ? "cursor-wait opacity-70" : "cursor-pointer"}`}>
                {isUploadingPhoto ? "Uploading photo..." : "Upload photo"}
                <input
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/gif"
                  disabled={isUploadingPhoto}
                  className="hidden"
                  onChange={handlePhotoUpload}
                />
              </label>
            </div>
            {photoError && <p role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{photoError}</p>}

            <div className="mt-6 grid gap-5 md:grid-cols-2">
              <label className="text-sm font-medium text-slate-700">
                First name
                <input value={profile.firstName} onChange={(e) => setProfile((v) => ({ ...v, firstName: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="text-sm font-medium text-slate-700">
                Last name
                <input value={profile.lastName} onChange={(e) => setProfile((v) => ({ ...v, lastName: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Email address
                <input value={profile.email} onChange={(e) => setProfile((v) => ({ ...v, email: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
              <label className="text-sm font-medium text-slate-700 md:col-span-2">
                Residential address
                <input value={profile.address} onChange={(e) => setProfile((v) => ({ ...v, address: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3" />
              </label>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Recent activity</h2>
            <div className="mt-5 space-y-4">
              {transactions.length === 0 ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-500">No transactions yet.</div>
              ) : (
                transactions.map((transaction) => (
                  <div key={transaction.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <span className="font-semibold text-slate-900">{transaction.note}</span>
                      <span className={transaction.type === "debit" ? "text-rose-600" : "text-emerald-600"}>
                        {transaction.type === "debit" ? "-" : "+"}{formatCurrency(transaction.amount)}
                      </span>
                    </div>
                    <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                      <span>{transaction.createdAt ? new Date(transaction.createdAt).toLocaleDateString() : "Date unavailable"}</span>
                      <span>{transaction.adminName}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function displayAdminValue(value: unknown) {
  if (value === null || value === undefined || value === "") return "—";
  if (typeof value === "object") return JSON.stringify(value);
  return String(value);
}

function AdminAuditHistory({
  customers,
  initialLogs,
  initialHasMore,
  initialError,
}: {
  customers: AdminDashboardPayload["customers"];
  initialLogs: Record<string, unknown>[];
  initialHasMore: boolean;
  initialError: string | null;
}) {
  const [auditLogs, setAuditLogs] = useState(initialLogs);
  const [auditHasMore, setAuditHasMore] = useState(initialHasMore);
  const [auditError, setAuditError] = useState<string | null>(initialError);
  const [auditLoading, setAuditLoading] = useState(false);
  const [auditCustomerFilter, setAuditCustomerFilter] = useState("");
  const [auditActionFilter, setAuditActionFilter] = useState("");
  const [appliedAuditFilters, setAppliedAuditFilters] = useState({ customerId: "", action: "" });

  function auditLogsUrl(
    filters: { customerId: string; action: string },
    cursor?: { createdAt: string; id: string },
  ) {
    const params = new URLSearchParams();
    if (filters.customerId) params.set("customerId", filters.customerId);
    if (filters.action) params.set("action", filters.action);
    if (cursor) {
      params.set("cursorCreatedAt", cursor.createdAt);
      params.set("cursorId", cursor.id);
    }
    return `/api/admin/audit-logs?${params.toString()}`;
  }

  async function loadAuditPage(
    filters: { customerId: string; action: string },
    cursor?: { createdAt: string; id: string },
  ) {
    setAuditLoading(true);
    setAuditError(null);
    try {
      const response = await fetch(auditLogsUrl(filters, cursor));
      const result = (await response.json()) as {
        error?: string;
        auditLogs?: Record<string, unknown>[];
        hasMore?: boolean;
      };

      if (!response.ok || !result.auditLogs || typeof result.hasMore !== "boolean") {
        throw new Error(result.error || "Unable to load audit history.");
      }

      const loadedLogs = result.auditLogs;
      setAuditLogs((current) => cursor ? [...current, ...loadedLogs] : loadedLogs);
      setAuditHasMore(result.hasMore);
      setAppliedAuditFilters(filters);
    } catch (error) {
      setAuditError(error instanceof Error ? error.message : "Unable to load audit history.");
    } finally {
      setAuditLoading(false);
    }
  }

  function applyAuditFilters(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void loadAuditPage({
      customerId: auditCustomerFilter,
      action: auditActionFilter.trim(),
    });
  }

  function loadMoreAuditLogs() {
    if (auditLoading || !auditHasMore || auditLogs.length === 0) return;
    const lastEntry = auditLogs[auditLogs.length - 1];
    if (typeof lastEntry.created_at !== "string" || typeof lastEntry.id !== "string") {
      setAuditError("Cannot load more audit records because the last record has no pagination cursor.");
      return;
    }
    void loadAuditPage(appliedAuditFilters, {
      createdAt: lastEntry.created_at,
      id: lastEntry.id,
    });
  }

  return (
    <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="text-xl font-bold text-slate-900">Administrative audit log</h2>
      <form onSubmit={applyAuditFilters} className="mt-5 grid gap-3 sm:grid-cols-[1fr_1fr_auto]">
        <label className="text-xs font-semibold text-slate-600">
          Customer
          <select
            value={auditCustomerFilter}
            onChange={(event) => setAuditCustomerFilter(event.target.value)}
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800"
          >
            <option value="">All customers</option>
            {customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.firstName} {customer.lastName} ({customer.email})
                {customer.archivedAt ? " — archived" : ""}
              </option>
            ))}
          </select>
        </label>
        <label className="text-xs font-semibold text-slate-600">
          Action type
          <input
            type="text"
            maxLength={100}
            value={auditActionFilter}
            onChange={(event) => setAuditActionFilter(event.target.value)}
            placeholder="Exact action, e.g. customer_archived"
            className="mt-1 w-full rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm font-normal text-slate-800"
          />
        </label>
        <button
          type="submit"
          disabled={auditLoading}
          className="self-end rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:bg-slate-400"
        >
          {auditLoading && !auditLogs.length ? "Loading..." : "Apply filters"}
        </button>
      </form>

      {auditError && (
        <p role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
          {auditError}
        </p>
      )}
      {!auditError && auditLogs.length === 0 ? (
        <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
          {appliedAuditFilters.customerId || appliedAuditFilters.action
            ? "No audit records match these filters."
            : "No audit records available."}
        </p>
      ) : (
        <div className="mt-5 space-y-4">
          {auditLogs.map((entry, index) => (
            <article key={displayAdminValue(entry.id ?? index)} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <dl className="grid gap-2 text-xs sm:grid-cols-2">
                {Object.entries(entry).map(([key, value]) => (
                  <div key={key} className="min-w-0">
                    <dt className="font-semibold capitalize text-slate-500">{key.replaceAll("_", " ")}</dt>
                    <dd className="break-words text-slate-800">{displayAdminValue(value)}</dd>
                  </div>
                ))}
              </dl>
            </article>
          ))}
        </div>
      )}
      {auditHasMore && !auditError && (
        <button
          type="button"
          disabled={auditLoading}
          onClick={loadMoreAuditLogs}
          className="mt-5 w-full rounded-full border border-slate-200 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 disabled:cursor-wait disabled:opacity-60"
        >
          {auditLoading ? "Loading audit history..." : "Load more audit records"}
        </button>
      )}
    </section>
  );
}

function AdminDashboardPage({ data }: { data: AdminDashboardPayload }) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [transactionForm, setTransactionForm] = useState({
    type: "credit",
    amount: "",
    note: "",
  });
  const [confirmingAdjustment, setConfirmingAdjustment] = useState(false);
  const [isSubmittingAdjustment, setIsSubmittingAdjustment] = useState(false);
  const [adjustmentError, setAdjustmentError] = useState<string | null>(null);
  const [adjustmentMessage, setAdjustmentMessage] = useState<string | null>(null);
  const [pendingIdempotencyKey, setPendingIdempotencyKey] = useState<string | null>(null);
  const [customerAction, setCustomerAction] = useState<{
    userId: string;
    action: "suspend" | "unsuspend" | "delete";
  } | null>(null);
  const [isSubmittingCustomerAction, setIsSubmittingCustomerAction] = useState(false);
  const [customerActionError, setCustomerActionError] = useState<string | null>(null);
  const [customerActionMessage, setCustomerActionMessage] = useState<string | null>(null);

  function prepareAdjustment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSubmittingAdjustment || !selectedUser) return;

    const amount = Number(transactionForm.amount);
    if (!Number.isFinite(amount) || amount <= 0 || !/^\d+(?:\.\d{1,2})?$/.test(transactionForm.amount)) {
      setAdjustmentError("Enter an amount greater than zero with no more than two decimal places.");
      return;
    }

    const note = transactionForm.note.trim();
    if (note.length < 3 || note.length > 500) {
      setAdjustmentError("Enter a transaction note between 3 and 500 characters.");
      return;
    }

    setAdjustmentError(null);
    setAdjustmentMessage(null);
    setPendingIdempotencyKey(crypto.randomUUID());
    setConfirmingAdjustment(true);
  }

  async function submitAdjustment() {
    if (isSubmittingAdjustment || !selectedUser || !pendingIdempotencyKey) return;

    setIsSubmittingAdjustment(true);
    setAdjustmentError(null);

    try {
      const response = await fetch("/api/admin/adjust-balance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: selectedUser.id,
          type: transactionForm.type,
          amount: transactionForm.amount,
          note: transactionForm.note.trim(),
          idempotencyKey: pendingIdempotencyKey,
        }),
      });
      const result = (await response.json()) as {
        error?: string;
        transactionId?: string;
        repeated?: boolean;
      };

      if (!response.ok || !result.transactionId) {
        throw new Error(result.error || "Unable to process this adjustment.");
      }

      setConfirmingAdjustment(false);
      setTransactionForm((current) => ({ ...current, amount: "", note: "" }));
      setPendingIdempotencyKey(null);
      setAdjustmentMessage(
        `${result.repeated ? "This adjustment was already processed" : "Adjustment completed"} (transaction ${result.transactionId}).`,
      );
      router.refresh();
    } catch (error) {
      setAdjustmentError(
        error instanceof Error ? error.message : "Unable to process this adjustment. Please try again.",
      );
    } finally {
      setIsSubmittingAdjustment(false);
    }
  }

  const customers = data.customers;
  const archivedCustomers = data.archivedCustomers;
  const allCustomers = [...customers, ...archivedCustomers];
  const customerById = new Map(allCustomers.map((customer) => [customer.id, customer]));
  const actionTarget = customerAction ? customerById.get(customerAction.userId) : undefined;
  const filteredUsers = customers.filter((user) => {
    const query = search.toLowerCase();
    return (
      user.firstName.toLowerCase().includes(query) ||
      user.lastName.toLowerCase().includes(query) ||
      user.email.toLowerCase().includes(query)
    );
  });
  const selectedUser =
    (selectedUserId ? customerById.get(selectedUserId) : undefined) ?? customers[0];
  const activeUsers = customers.filter((user) => user.status === "active").length;
  const suspendedUsers = customers.filter((user) => user.status === "suspended").length;
  const totalBalances = customers.reduce((sum, user) => sum + user.balance, 0);
  const totalAdjusted = data.transactions.reduce((sum, transaction) => {
    const amount = Number(transaction.amount ?? 0);
    return Number.isFinite(amount) ? sum + Math.abs(amount) : sum;
  }, 0);

  async function submitCustomerAction() {
    if (!customerAction || isSubmittingCustomerAction) return;
    const target = customerById.get(customerAction.userId);
    if (!target) return;

    setIsSubmittingCustomerAction(true);
    setCustomerActionError(null);
    setCustomerActionMessage(null);

    try {
      const response = await fetch("/api/admin/customers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: target.id, action: customerAction.action }),
      });
      const result = (await response.json()) as {
        error?: string;
        success?: boolean;
        archived?: boolean;
        status?: string;
        authActionIncomplete?: boolean;
      };

      if (!response.ok || !result.success) {
        if (result.archived || result.status) router.refresh();
        if (result.authActionIncomplete) {
          setCustomerAction(null);
          setCustomerActionError(
            result.error || "The database update succeeded, but Auth synchronization needs to be retried.",
          );
          return;
        }
        throw new Error(result.error || "Unable to complete the customer action.");
      }

      const message =
        customerAction.action === "suspend"
          ? `${target.firstName} ${target.lastName} was suspended.`
          : customerAction.action === "unsuspend"
            ? `${target.firstName} ${target.lastName} was reactivated.`
            : `${target.firstName} ${target.lastName} was archived and sign-in was deactivated. Financial records were preserved.`;

      setCustomerActionMessage(message);
      setCustomerAction(null);
      setCustomerActionError(null);
      router.refresh();
    } catch (error) {
      setCustomerActionError(
        error instanceof Error ? error.message : "Unable to complete the customer action.",
      );
    } finally {
      setIsSubmittingCustomerAction(false);
    }
  }

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Admin dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Account operations center</h1>
          </div>
          <div className="flex items-center gap-2 rounded-full bg-blue-50 px-3 py-1.5 text-sm font-medium text-blue-700">
            <ShieldCheck className="h-4 w-4" /> Administrator access
          </div>
        </div>

        {data.loadError && (
          <div role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
            {data.loadError}
          </div>
        )}

        {!data.loadError && (
          <>
            {adjustmentMessage && (
              <p role="status" className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {adjustmentMessage}
              </p>
            )}
            {adjustmentError && !confirmingAdjustment && (
              <p role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {adjustmentError}
              </p>
            )}
            {customerActionMessage && (
              <p role="status" className="mb-6 rounded-2xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800">
                {customerActionMessage}
              </p>
            )}
            {customerActionError && !customerAction && (
              <p role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
                {customerActionError}
              </p>
            )}
            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
              <StatCard label="Registered users" value={String(customers.length)} tone="blue" icon={<Users className="h-5 w-5" />} />
              <StatCard label="Active users" value={String(activeUsers)} tone="green" icon={<CheckCircle2 className="h-5 w-5" />} />
              <StatCard label="Suspended users" value={String(suspendedUsers)} tone="red" icon={<ShieldEllipsis className="h-5 w-5" />} />
              <StatCard label="Total balances" value={formatCurrency(totalBalances)} tone="slate" icon={<Wallet className="h-5 w-5" />} />
              <StatCard label="Amounts adjusted" value={data.transactionError ? "Unavailable" : formatCurrency(totalAdjusted)} tone="amber" icon={<CircleDollarSign className="h-5 w-5" />} />
            </div>
            <p className="mt-3 text-xs text-slate-500">
              Amounts adjusted is the sum of absolute transaction amounts for customer accounts.
            </p>

            {data.photoWarning && (
              <p role="status" className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
                Some private customer photos cannot be previewed under the current Storage access policies.
              </p>
            )}

            <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <h2 className="text-xl font-bold text-slate-900">User management</h2>
                  <label className="relative block w-full max-w-xs">
                    <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                    <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Search by name or email" />
                  </label>
                </div>

                {filteredUsers.length === 0 ? (
                  <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 px-5 py-10 text-center">
                    <Users className="mx-auto h-8 w-8 text-slate-400" />
                    <p className="mt-3 font-semibold text-slate-800">
                      {customers.length === 0
                        ? "No registered customers yet. Customer accounts will appear here when users register."
                        : "No customers match your search."}
                    </p>
                  </div>
                ) : (
                  <div className="overflow-x-auto rounded-2xl border border-slate-200">
                    <table className="min-w-full text-left text-sm">
                      <thead className="bg-slate-50 text-slate-600">
                        <tr>
                          <th className="px-4 py-3 font-semibold">Customer</th>
                          <th className="px-4 py-3 font-semibold">Email</th>
                          <th className="px-4 py-3 font-semibold">Balance</th>
                          <th className="px-4 py-3 font-semibold">Status</th>
                          <th className="px-4 py-3 font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredUsers.map((user) => (
                          <tr key={user.id} className="border-t border-slate-200 bg-white">
                            <td className="whitespace-nowrap px-4 py-3 font-medium text-slate-900">
                              <div className="flex items-center gap-3">
                                {user.photoUrl ? (
                                  <Image
                                    src={user.photoUrl}
                                    alt=""
                                    width={36}
                                    height={36}
                                    unoptimized
                                    className="h-9 w-9 rounded-full object-cover"
                                  />
                                ) : (
                                  <span className="flex h-9 w-9 items-center justify-center rounded-full bg-blue-100 text-xs font-bold text-blue-700">
                                    {(user.firstName[0] ?? "") + (user.lastName[0] ?? "")}
                                  </span>
                                )}
                                <span>{user.firstName} {user.lastName}</span>
                              </div>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-600">{user.email}</td>
                            <td className="whitespace-nowrap px-4 py-3 text-slate-900">{formatCurrency(user.balance)}</td>
                            <td className="px-4 py-3">
                              <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                                {user.status}
                              </span>
                            </td>
                            <td className="whitespace-nowrap px-4 py-3">
                              <div className="flex gap-2">
                                <button type="button" onClick={() => setSelectedUserId(user.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">View Profile</button>
                                {user.status === "active" && (
                                  <button
                                    type="button"
                                    aria-label={`Suspend ${user.firstName} ${user.lastName}`}
                                    title="Suspend customer"
                                    onClick={() => { setCustomerAction({ userId: user.id, action: "suspend" }); setCustomerActionError(null); }}
                                    className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-200"
                                  >
                                    <Ban className="h-3.5 w-3.5" /> Suspend
                                  </button>
                                )}
                                {user.status === "suspended" && (
                                  <>
                                    <button
                                      type="button"
                                      aria-label={`Unsuspend ${user.firstName} ${user.lastName}`}
                                      title="Reactivate customer"
                                      onClick={() => { setCustomerAction({ userId: user.id, action: "unsuspend" }); setCustomerActionError(null); }}
                                      className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-3 py-1.5 text-xs font-semibold text-emerald-800 hover:bg-emerald-200"
                                    >
                                      <UserRoundCheck className="h-3.5 w-3.5" /> Unsuspend
                                    </button>
                                    <button
                                      type="button"
                                      title="Retry or verify Auth suspension"
                                      onClick={() => { setCustomerAction({ userId: user.id, action: "suspend" }); setCustomerActionError(null); }}
                                      className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                                    >
                                      Retry suspend
                                    </button>
                                  </>
                                )}
                                <button
                                  type="button"
                                  aria-label={`Delete ${user.firstName} ${user.lastName}`}
                                  title="Archive and deactivate customer"
                                  onClick={() => { setCustomerAction({ userId: user.id, action: "delete" }); setCustomerActionError(null); }}
                                  className="inline-flex items-center gap-1 rounded-full bg-rose-100 px-3 py-1.5 text-xs font-semibold text-rose-800 hover:bg-rose-200"
                                >
                                  <Trash2 className="h-3.5 w-3.5" /> Delete
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {selectedUser && (
                  <div className="mt-5 rounded-2xl bg-slate-50 p-4 text-sm text-slate-600">
                    <p className="font-semibold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</p>
                    <p className="mt-1">{selectedUser.address || "No address on file"}</p>
                    <p className="mt-1">Registered {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : "date unavailable"}</p>
                    <p className="mt-1">Balance {formatCurrency(selectedUser.balance)}</p>
                    {selectedUser.archivedAt && (
                      <p className="mt-1 font-semibold text-rose-700">
                        Archived {new Date(selectedUser.archivedAt).toLocaleString()}; financial history is retained.
                      </p>
                    )}
                  </div>
                )}
                {archivedCustomers.length > 0 && (
                  <details className="mt-5 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <summary className="cursor-pointer font-semibold text-slate-800">
                      Archived customers ({archivedCustomers.length})
                    </summary>
                    <ul className="mt-3 space-y-3">
                      {archivedCustomers.map((customer) => (
                        <li key={customer.id} className="flex flex-wrap items-center justify-between gap-3 border-t border-slate-200 pt-3 text-sm">
                          <div>
                            <p className="font-semibold text-slate-900">{customer.firstName} {customer.lastName}</p>
                            <p className="text-slate-600">{customer.email}</p>
                            <p className="text-xs text-slate-500">
                              Archived {customer.archivedAt ? new Date(customer.archivedAt).toLocaleString() : "date unavailable"}
                            </p>
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="font-medium text-slate-800">{formatCurrency(customer.balance)}</span>
                            <button type="button" onClick={() => setSelectedUserId(customer.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">
                              View history
                            </button>
                            <button
                              type="button"
                              onClick={() => { setCustomerAction({ userId: customer.id, action: "delete" }); setCustomerActionError(null); }}
                              className="rounded-full border border-amber-300 bg-white px-3 py-1.5 text-xs font-semibold text-amber-800 hover:bg-amber-50"
                              title="Retry or verify Auth deactivation"
                            >
                              Retry Auth disable
                            </button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </details>
                )}
              </div>

              <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Balance management</h2>
                {selectedUser && !selectedUser.archivedAt ? (
                  <form onSubmit={prepareAdjustment} className="mt-6 space-y-5">
                    <div className="rounded-2xl bg-slate-50 p-4">
                      <div className="text-sm text-slate-500">Selected customer</div>
                      <div className="mt-2 text-lg font-semibold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</div>
                      <div className="text-sm text-slate-600">{selectedUser.email}</div>
                    </div>

                    <label className="block text-sm font-medium text-slate-700">
                      Transaction type
                      <select value={transactionForm.type} onChange={(e) => { setTransactionForm((v) => ({ ...v, type: e.target.value })); setPendingIdempotencyKey(null); setAdjustmentMessage(null); }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">
                        <option value="credit">Add amount</option>
                        <option value="debit">Deduct amount</option>
                      </select>
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Transaction amount
                      <input type="number" min="0.01" step="0.01" value={transactionForm.amount} onChange={(e) => { setTransactionForm((v) => ({ ...v, amount: e.target.value })); setPendingIdempotencyKey(null); setAdjustmentMessage(null); }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" placeholder="0.00" required />
                    </label>

                    <label className="block text-sm font-medium text-slate-700">
                      Transaction note
                      <textarea rows={4} maxLength={500} value={transactionForm.note} onChange={(e) => { setTransactionForm((v) => ({ ...v, note: e.target.value })); setPendingIdempotencyKey(null); setAdjustmentMessage(null); }} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" placeholder="Transaction note" required />
                    </label>

                    <p className="text-xs text-slate-500">The adjustment is processed by the secure admin_adjust_balance database function.</p>

                    <button type="submit" disabled={isSubmittingAdjustment} className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-slate-300">
                      Review transaction
                    </button>
                  </form>
                ) : selectedUser?.archivedAt ? (
                  <p className="mt-6 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-amber-800">
                    This customer is archived. Their balance and transaction history are preserved and available for review; further adjustments are unavailable.
                  </p>
                ) : (
                  <p className="mt-6 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    Select a customer to view balance management.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-8 grid gap-8 lg:grid-cols-2">
              <section className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
                <h2 className="text-xl font-bold text-slate-900">Customer transactions</h2>
                {data.transactionError ? (
                  <p role="alert" className="mt-5 rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">{data.transactionError}</p>
                ) : data.transactions.length === 0 ? (
                  <p className="mt-5 rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-5 text-sm text-slate-500">
                    No customer transactions yet.
                  </p>
                ) : (
                  <div className="mt-5 space-y-4">
                    {data.transactions.map((transaction, index) => {
                      const transactionId = displayAdminValue(transaction.id ?? index);
                      const amount = Number(transaction.amount ?? 0);
                      const transactionCustomer = customerById.get(String(transaction.user_id ?? ""));

                      return (
                        <article key={transactionId} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                          <div className="flex flex-wrap items-center justify-between gap-2">
                            <span className="font-semibold capitalize text-slate-900">{displayAdminValue(transaction.type)}</span>
                            <span className="font-semibold text-slate-900">{formatCurrency(Number.isFinite(amount) ? amount : 0)}</span>
                          </div>
                          <p className="mt-2 text-sm text-slate-600">
                            Customer: {transactionCustomer ? `${transactionCustomer.firstName} ${transactionCustomer.lastName} (${transactionCustomer.email})` : displayAdminValue(transaction.user_id)}
                          </p>
                          <p className="mt-2 text-sm text-slate-600">{displayAdminValue(transaction.note)}</p>
                          <p className="mt-2 text-xs text-slate-500">
                            {transaction.created_at ? new Date(String(transaction.created_at)).toLocaleString() : "Date unavailable"}
                          </p>
                          <dl className="mt-3 grid gap-2 text-xs text-slate-600 sm:grid-cols-2">
                            <div>
                              <dt>Balance before</dt>
                              <dd className="font-semibold text-slate-800">{formatCurrency(Number(transaction.balance_before ?? 0))}</dd>
                            </div>
                            <div>
                              <dt>Balance after</dt>
                              <dd className="font-semibold text-slate-800">{formatCurrency(Number(transaction.balance_after ?? 0))}</dd>
                            </div>
                            <div>
                              <dt>Transaction ID</dt>
                              <dd className="break-all font-semibold text-slate-800">{transactionId}</dd>
                            </div>
                            <div>
                              <dt>Performed by</dt>
                              <dd className="break-all font-semibold text-slate-800">{displayAdminValue(transaction.performed_by)}</dd>
                            </div>
                          </dl>
                        </article>
                      );
                    })}
                  </div>
                )}
              </section>

              <AdminAuditHistory
                key={`${data.auditLogs.map((entry) => displayAdminValue(entry.id)).join(":")}:${data.auditHasMore}:${data.auditError ?? ""}`}
                customers={allCustomers}
                initialLogs={data.auditLogs}
                initialHasMore={data.auditHasMore}
                initialError={data.auditError}
              />
            </div>
          </>
        )}

        {confirmingAdjustment && selectedUser && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="adjustment-confirm-title"
              className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"
            >
              <h2 id="adjustment-confirm-title" className="text-xl font-bold text-slate-900">Confirm balance adjustment</h2>
              <p className="mt-2 text-sm text-slate-600">Review this transaction before it is permanently recorded.</p>
              <dl className="mt-5 space-y-3 rounded-2xl bg-slate-50 p-4 text-sm">
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Customer</dt><dd className="text-right font-semibold text-slate-900">{selectedUser.firstName} {selectedUser.lastName} ({selectedUser.email})</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Transaction</dt><dd className="font-semibold capitalize text-slate-900">{transactionForm.type === "credit" ? "Add amount" : "Deduct amount"}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Amount</dt><dd className="font-semibold text-slate-900">{formatCurrency(Number(transactionForm.amount))}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Current balance</dt><dd className="font-semibold text-slate-900">{formatCurrency(selectedUser.balance)}</dd></div>
                <div className="flex justify-between gap-4"><dt className="text-slate-500">Balance after</dt><dd className="font-semibold text-slate-900">{formatCurrency(selectedUser.balance + (transactionForm.type === "credit" ? 1 : -1) * Number(transactionForm.amount))}</dd></div>
                <div><dt className="text-slate-500">Note</dt><dd className="mt-1 whitespace-pre-wrap font-medium text-slate-900">{transactionForm.note.trim()}</dd></div>
              </dl>
              {adjustmentError && <p role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">{adjustmentError}</p>}
              <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                <button
                  type="button"
                  disabled={isSubmittingAdjustment}
                  onClick={() => { setConfirmingAdjustment(false); setPendingIdempotencyKey(null); setAdjustmentError(null); }}
                  className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  disabled={isSubmittingAdjustment}
                  onClick={submitAdjustment}
                  className="rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 disabled:cursor-wait disabled:bg-slate-400"
                >
                  {isSubmittingAdjustment ? "Processing..." : "Confirm and process"}
                </button>
              </div>
            </section>
          </div>
        )}
        {customerAction && actionTarget && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4" role="presentation">
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="customer-action-title"
              className="w-full max-w-lg rounded-[28px] bg-white p-6 shadow-2xl"
            >
              {(() => {
                const target = actionTarget;
                const isDelete = customerAction.action === "delete";
                const isSuspend = customerAction.action === "suspend";

                return (
                  <>
                    <h2 id="customer-action-title" className="text-xl font-bold text-slate-900">
                      {isDelete ? "Delete customer account?" : isSuspend ? "Suspend customer?" : "Reactivate customer?"}
                    </h2>
                    <p className="mt-2 text-sm text-slate-600">
                      Confirm this action for <span className="font-semibold">{target.firstName} {target.lastName}</span> ({target.email}).
                    </p>
                    <p className={`mt-4 rounded-2xl p-4 text-sm ${isDelete ? "border border-amber-200 bg-amber-50 text-amber-900" : "border border-slate-200 bg-slate-50 text-slate-700"}`}>
                      {isDelete
                        ? "This archives the customer and disables authentication. Their profile, account, balances, transactions, and audit history will be retained; nothing is hard-deleted."
                        : isSuspend
                          ? "The customer will immediately lose access to protected account pages. Their balance and transaction history will not change."
                          : "The customer will regain access to protected account pages. Their balance and transaction history will not change."}
                    </p>
                    {customerActionError && (
                      <p role="alert" className="mt-4 rounded-2xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-700">
                        {customerActionError}
                      </p>
                    )}
                    <div className="mt-6 flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
                      <button
                        type="button"
                        disabled={isSubmittingCustomerAction}
                        onClick={() => { setCustomerAction(null); setCustomerActionError(null); }}
                        className="rounded-full border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-700 disabled:opacity-50"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        disabled={isSubmittingCustomerAction}
                        onClick={submitCustomerAction}
                        className={`rounded-full px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-wait disabled:bg-slate-400 ${isDelete ? "bg-rose-600 hover:bg-rose-700" : isSuspend ? "bg-amber-600 hover:bg-amber-700" : "bg-emerald-600 hover:bg-emerald-700"}`}
                      >
                        {isSubmittingCustomerAction
                          ? "Processing..."
                          : isDelete
                            ? "Confirm archive and disable"
                            : isSuspend
                              ? "Confirm suspension"
                              : "Confirm reactivation"}
                      </button>
                    </div>
                  </>
                );
              })()}
            </section>
          </div>
        )}
      </section>
    </PageShell>
  );
}

function StatCard({ label, value, tone, icon }: { label: string; value: string; tone: "blue" | "green" | "red" | "slate" | "amber"; icon: React.ReactNode }) {
  const tones = {
    blue: "bg-blue-50 text-blue-700",
    green: "bg-emerald-50 text-emerald-700",
    red: "bg-rose-50 text-rose-700",
    slate: "bg-slate-100 text-slate-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-[22px] border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-slate-500">{label}</p>
          <div className="mt-3 text-2xl font-bold text-slate-900">{value}</div>
        </div>
        <div className={`flex h-11 w-11 items-center justify-center rounded-2xl ${tones[tone]}`}>{icon}</div>
      </div>
    </div>
  );
}

export function FinancialDemo({
  page,
  redirectReason,
  adminData,
}: {
  page: "home" | "about" | "contact" | "login" | "register" | "dashboard" | "admin";
  redirectReason?: string;
  adminData?: AdminDashboardPayload;
}) {
  if (page === "about") return <AboutPage />;
  if (page === "contact") return <ContactPage />;
  if (page === "login") return <LoginPage redirectReason={redirectReason} />;
  if (page === "register") return <RegisterPage />;
  if (page === "dashboard") return <DashboardPage />;
  if (page === "admin") {
    return (
      <AdminDashboardPage
        data={adminData ?? {
          customers: [],
          archivedCustomers: [],
          transactions: [],
          auditLogs: [],
          auditHasMore: false,
          loadError: "Administrator data was not provided by the server.",
          transactionError: null,
          auditError: null,
          photoWarning: false,
        }}
      />
    );
  }
  return <HomePage />;
}
