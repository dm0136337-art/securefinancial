"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import {
  ArrowRight,
  BanknoteArrowDown,
  BanknoteArrowUp,
  Building2,
  CheckCircle2,
  CircleDollarSign,
  CreditCard,
  Globe,
  House,
  Lock,
  Mail,
  Menu,
  Phone,
  Search,
  ShieldCheck,
  ShieldEllipsis,
  UserCog,
  Users,
  Wallet,
  X,
} from "lucide-react";
import {
  formatCurrency,
  getSummaryTotals,
  getTransactionsForUser,
  getUserByEmail,
  mockUsers,
  type UserProfile,
} from "@/lib/data";

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

        <div className="hidden md:block">
          <Link
            href="/login"
            className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-blue-500"
          >
            Access portal
            <ArrowRight className="h-4 w-4" />
          </Link>
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
          </nav>
        </div>
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

function LoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const user = getUserByEmail(form.email);

    if (!user || user.password !== form.password) {
      setError("Invalid email or password");
      return;
    }

    setError("");
    const target = user.role === "admin" ? "/admin" : "/dashboard";
    router.push(target);
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
              <button type="submit" className="inline-flex flex-1 items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                Sign in
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

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setMessage(`Account profile created for ${form.firstName} ${form.lastName}. You can now log in.`);
    setForm({ firstName: "", lastName: "", email: "", password: "", address: "" });
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
              <button type="submit" className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                Register account
              </button>
              <Link href="/login" className="text-sm font-medium text-slate-600 hover:text-blue-600">Already have an account?</Link>
            </div>
          </form>

          {message && <p className="mt-6 rounded-2xl bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</p>}
        </div>
      </section>
    </PageShell>
  );
}

function DashboardPage() {
  const currentUser = mockUsers.find((user) => user.role === "user") ?? mockUsers[0];
  const transactions = getTransactionsForUser(currentUser.id);
  const [photo, setPhoto] = useState(currentUser.photo);
  const [profile, setProfile] = useState({
    firstName: currentUser.firstName,
    lastName: currentUser.lastName,
    email: currentUser.email,
    address: currentUser.address,
  });

  return (
    <PageShell>
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">User dashboard</p>
            <h1 className="mt-2 text-3xl font-bold text-slate-900">Welcome back, {currentUser.firstName}</h1>
          </div>
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-3 py-1.5 text-sm font-medium text-emerald-700">
            <CheckCircle2 className="h-4 w-4" /> {currentUser.status === "active" ? "Account active" : "Account suspended"}
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          <StatCard label="Current balance" value={formatCurrency(currentUser.balance)} tone="blue" icon={<Wallet className="h-5 w-5" />} />
          <StatCard label="Total added" value={formatCurrency(currentUser.totalCredited)} tone="green" icon={<BanknoteArrowUp className="h-5 w-5" />} />
          <StatCard label="Total deducted" value={formatCurrency(currentUser.totalDebited)} tone="red" icon={<BanknoteArrowDown className="h-5 w-5" />} />
          <StatCard label="Account status" value={currentUser.status === "active" ? "Active" : "Suspended"} tone="slate" icon={<ShieldCheck className="h-5 w-5" />} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-xl font-bold text-slate-900">Profile</h2>
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-slate-500">Secure view</span>
            </div>

            <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
              <Image
                src={photo || currentUser.photo}
                alt={`${profile.firstName} ${profile.lastName}`}
                width={80}
                height={80}
                unoptimized
                className="h-20 w-20 rounded-full object-cover ring-4 ring-blue-50"
              />
              <label className="inline-flex cursor-pointer items-center rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-medium text-slate-700">
                Upload photo
                <input type="file" className="hidden" onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) setPhoto(URL.createObjectURL(file));
                }} />
              </label>
            </div>

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
              {transactions.map((transaction) => (
                <div key={transaction.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <span className="font-semibold text-slate-900">{transaction.note}</span>
                    <span className={transaction.type === "debit" ? "text-rose-600" : "text-emerald-600"}>
                      {transaction.type === "debit" ? "-" : "+"}{formatCurrency(transaction.amount)}
                    </span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-xs text-slate-500">
                    <span>{new Date(transaction.createdAt).toLocaleDateString()}</span>
                    <span>{transaction.adminName}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </PageShell>
  );
}

function AdminDashboardPage() {
  const [users, setUsers] = useState<UserProfile[]>(mockUsers.filter((user) => user.role === "user"));
  const [search, setSearch] = useState("");
  const [selectedUserId, setSelectedUserId] = useState<number>(users[0]?.id ?? 1);
  const [transactionForm, setTransactionForm] = useState({
    type: "credit",
    amount: "",
    note: "",
  });

  const summary = useMemo(() => getSummaryTotals(), []);
  const filteredUsers = users.filter((user) => {
    const q = search.toLowerCase();
    return user.firstName.toLowerCase().includes(q) || user.email.toLowerCase().includes(q) || user.lastName.toLowerCase().includes(q);
  });
  const selectedUser = users.find((user) => user.id === selectedUserId) ?? users[0];

  const toggleStatus = (userId: number) => {
    setUsers((current) =>
      current.map((user) =>
        user.id === userId ? { ...user, status: user.status === "active" ? "suspended" : "active" } : user,
      ),
    );
  };

  const submitAdjustment = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedUser || !transactionForm.amount) return;

    const amount = Number(transactionForm.amount);
    if (Number.isNaN(amount) || amount <= 0) return;

    const nextBalance =
      transactionForm.type === "credit"
        ? selectedUser.balance + amount
        : Math.max(0, selectedUser.balance - amount);

    setUsers((current) =>
      current.map((user) =>
        user.id === selectedUser.id
          ? {
              ...user,
              balance: nextBalance,
              totalCredited: transactionForm.type === "credit" ? user.totalCredited + amount : user.totalCredited,
              totalDebited: transactionForm.type === "debit" ? user.totalDebited + amount : user.totalDebited,
            }
          : user,
      ),
    );

    setTransactionForm({ type: "credit", amount: "", note: "" });
  };

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

        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
          <StatCard label="Registered users" value={String(summary.registeredUsers)} tone="blue" icon={<Users className="h-5 w-5" />} />
          <StatCard label="Active users" value={String(summary.activeUsers)} tone="green" icon={<CheckCircle2 className="h-5 w-5" />} />
          <StatCard label="Suspended users" value={String(summary.suspendedUsers)} tone="red" icon={<ShieldEllipsis className="h-5 w-5" />} />
          <StatCard label="Total balances" value={formatCurrency(summary.totalBalances)} tone="slate" icon={<Wallet className="h-5 w-5" />} />
          <StatCard label="Amounts adjusted" value={formatCurrency(summary.totalDebited)} tone="amber" icon={<CircleDollarSign className="h-5 w-5" />} />
        </div>

        <div className="mt-8 grid gap-8 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
              <h2 className="text-xl font-bold text-slate-900">User management</h2>
              <label className="relative block w-full max-w-xs">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input value={search} onChange={(e) => setSearch(e.target.value)} className="w-full rounded-full border border-slate-200 bg-slate-50 py-2.5 pl-9 pr-3 text-sm outline-none focus:border-blue-500" placeholder="Search by name or email" />
              </label>
            </div>

            <div className="overflow-hidden rounded-2xl border border-slate-200">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-slate-50 text-slate-600">
                  <tr>
                    <th className="px-4 py-3 font-semibold">Name</th>
                    <th className="px-4 py-3 font-semibold">Email</th>
                    <th className="px-4 py-3 font-semibold">Balance</th>
                    <th className="px-4 py-3 font-semibold">Status</th>
                    <th className="px-4 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers.map((user) => (
                    <tr key={user.id} className="border-t border-slate-200 bg-white">
                      <td className="px-4 py-3 font-medium text-slate-900">{user.firstName} {user.lastName}</td>
                      <td className="px-4 py-3 text-slate-600">{user.email}</td>
                      <td className="px-4 py-3 text-slate-900">{formatCurrency(user.balance)}</td>
                      <td className="px-4 py-3">
                        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${user.status === "active" ? "bg-emerald-50 text-emerald-700" : "bg-rose-50 text-rose-700"}`}>
                          {user.status}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button type="button" onClick={() => setSelectedUserId(user.id)} className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-700">View</button>
                          <button type="button" onClick={() => toggleStatus(user.id)} className="rounded-full bg-slate-900 px-3 py-1.5 text-xs font-semibold text-white">{user.status === "active" ? "Suspend" : "Unsuspend"}</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="rounded-[28px] border border-slate-200 bg-white p-6 shadow-sm">
            <h2 className="text-xl font-bold text-slate-900">Balance management</h2>
            {selectedUser ? (
              <form onSubmit={submitAdjustment} className="mt-6 space-y-5">
                <div className="rounded-2xl bg-slate-50 p-4">
                  <div className="text-sm text-slate-500">Selected user</div>
                  <div className="mt-2 text-lg font-semibold text-slate-900">{selectedUser.firstName} {selectedUser.lastName}</div>
                  <div className="text-sm text-slate-600">{selectedUser.email}</div>
                </div>

                <label className="block text-sm font-medium text-slate-700">
                  Transaction type
                  <select value={transactionForm.type} onChange={(e) => setTransactionForm((v) => ({ ...v, type: e.target.value as "credit" | "debit" }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500">
                    <option value="credit">Add amount</option>
                    <option value="debit">Deduct amount</option>
                  </select>
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Transaction amount
                  <input type="number" min="1" step="0.01" value={transactionForm.amount} onChange={(e) => setTransactionForm((v) => ({ ...v, amount: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" placeholder="0.00" />
                </label>

                <label className="block text-sm font-medium text-slate-700">
                  Transaction note
                  <textarea rows={4} value={transactionForm.note} onChange={(e) => setTransactionForm((v) => ({ ...v, note: e.target.value }))} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none focus:border-blue-500" placeholder="Initial account credit, monthly adjustment, service payment deduction..." />
                </label>

                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4 text-sm text-slate-700">
                  <div className="font-semibold text-slate-900">Transaction summary</div>
                  <p className="mt-2">User: {selectedUser.firstName} {selectedUser.lastName}</p>
                  <p>Type: {transactionForm.type === "credit" ? "Add Amount" : "Deduct Amount"}</p>
                  <p>Amount: {transactionForm.amount ? formatCurrency(Number(transactionForm.amount)) : "$0.00"}</p>
                  <p>Note: {transactionForm.note || "No note provided"}</p>
                </div>

                <button type="submit" className="inline-flex w-full items-center justify-center rounded-full bg-blue-600 px-5 py-3 text-sm font-semibold text-white transition hover:bg-blue-500">
                  Confirm transaction
                </button>
              </form>
            ) : (
              <p className="mt-6 text-slate-500">Select a user to begin an adjustment.</p>
            )}
          </div>
        </div>
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

export function FinancialDemo({ page }: { page: "home" | "about" | "contact" | "login" | "register" | "dashboard" | "admin" }) {
  if (page === "about") return <AboutPage />;
  if (page === "contact") return <ContactPage />;
  if (page === "login") return <LoginPage />;
  if (page === "register") return <RegisterPage />;
  if (page === "dashboard") return <DashboardPage />;
  if (page === "admin") return <AdminDashboardPage />;
  return <HomePage />;
}
