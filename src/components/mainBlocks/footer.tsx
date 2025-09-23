/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useMemo } from "react";
import { Github, Linkedin, Twitter } from "lucide-react";

export default function Footer({ user }: { user?: any }) {
  const year = useMemo(() => new Date().getFullYear(), []);

  const common = [
    { href: "/jobs", label: "Jobs" },
    { href: "/research-opportunities", label: "Research" },
    { href: "/profile", label: "Profile", authOnly: true },
  ];

  const admin = [
    { href: "/admin", label: "Admin Panel" },
    { href: "/create-company", label: "Create Company" },
  ];

  const recruiter = [
    { href: "/jobs/create", label: "Post Job" },
    { href: "/create-company", label: "Create Company" },
  ];

  const unauth = [
    { href: "/login", label: "Login" },
    { href: "/signup", label: "Sign Up" },
    { href: "/register-company", label: "Register Company" },
    { href: "/login-company", label: "Login Company" },
  ];

  const roleLinks = user
    ? [
        ...common.filter((l) => !l.authOnly || !!user),
        ...(user?.role === "ADMIN" ? admin : []),
        ...(user?.role === "RECRUITER" || user?.role === "COMPANY_HR"
          ? recruiter
          : []),
      ]
    : unauth;

  return (
    <footer role="contentinfo" className="border-t bg-white/70 backdrop-blur">
      <div className="mx-auto max-w-7xl px-4 py-10">
        {/* Top: brand & short blurb */}
        <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <Link href="/" className="text-lg font-semibold tracking-tight">
            AI Talent Hub
          </Link>
          <p className="max-w-xl text-sm text-gray-600">
            A modern hub for candidates, researchers, and companies. Discover
            roles, post openings, and explore research collaborations in one
            place.
          </p>
        </div>

        {/* Middle: navigation columns */}
        <div className="mt-8 grid grid-cols-2 gap-6 sm:grid-cols-3 md:grid-cols-4">
          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Explore
            </h3>
            <ul className="space-y-2">
              {roleLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Resources
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/about"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  About
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Blog
                </Link>
              </li>
              <li>
                <Link
                  href="/support"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Support
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Company
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/contact"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/careers"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Careers
                </Link>
              </li>
              <li>
                <Link
                  href="/partners"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Partners
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
              Legal
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/terms"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Terms
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Privacy
                </Link>
              </li>
              <li>
                <Link
                  href="/cookies"
                  className="rounded-lg px-1 py-0.5 text-sm text-gray-700 hover:bg-gray-100"
                >
                  Cookies
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Newsletter & Social */}
        <div className="mt-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <form
            className="flex w-full max-w-md items-center overflow-hidden rounded-2xl border bg-white shadow-sm"
            onSubmit={(e) => {
              e.preventDefault();
              const form = e.currentTarget as HTMLFormElement;
              const data = new FormData(form);
              const email = String(data.get("email") || "").trim();
              if (!email) return;
              // TODO: hook up your subscribe endpoint
              alert(`Subscribed: ${email}`);
              (
                form.querySelector("input[name=email]") as HTMLInputElement
              ).value = "";
            }}
            aria-label="Newsletter subscription"
          >
            <input
              type="email"
              name="email"
              required
              placeholder="Your email"
              className="w-full flex-1 px-4 py-3 text-sm outline-none placeholder:text-gray-400"
              aria-label="Email address"
            />
            <button
              type="submit"
              className="mx-2 my-1 rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-black/90"
            >
              Subscribe
            </button>
          </form>

          <div className="flex items-center gap-3">
            <a
              href="https://twitter.com"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
              aria-label="Twitter"
            >
              <Twitter className="h-5 w-5" />
            </a>
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
              aria-label="GitHub"
            >
              <Github className="h-5 w-5" />
            </a>
            <a
              href="https://linkedin.com"
              target="_blank"
              rel="noreferrer noopener"
              className="rounded-xl p-2 text-gray-600 hover:bg-gray-100"
              aria-label="LinkedIn"
            >
              <Linkedin className="h-5 w-5" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-8 flex flex-col items-start justify-between gap-3 border-t pt-6 text-sm text-gray-500 md:flex-row md:items-center">
          <p>© {year} AI Talent Hub. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link
              href="/sitemap"
              className="rounded-lg px-1 py-0.5 hover:bg-gray-100"
            >
              Sitemap
            </Link>
            <Link
              href="/accessibility"
              className="rounded-lg px-1 py-0.5 hover:bg-gray-100"
            >
              Accessibility
            </Link>
            <button
              className="rounded-lg px-1 py-0.5 hover:bg-gray-100"
              onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
              aria-label="Back to top"
            >
              Back to top ↑
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}
