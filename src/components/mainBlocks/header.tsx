/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { authClient } from "@/lib/auth/auth_client";

// Small helper to avoid menu flicker: delayed open/close with hover intent
function useHoverIntent({ openDelay = 120, closeDelay = 180 } = {}) {
  const [open, setOpen] = useState(false);
  const openTimer = useRef<NodeJS.Timeout | null>(null);
  const closeTimer = useRef<NodeJS.Timeout | null>(null);

  const scheduleOpen = () => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    if (open) return;
    openTimer.current = setTimeout(() => setOpen(true), openDelay);
  };
  const scheduleClose = () => {
    if (openTimer.current) clearTimeout(openTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), closeDelay);
  };
  const forceClose = () => setOpen(false);

  useEffect(
    () => () => {
      if (openTimer.current) clearTimeout(openTimer.current);
      if (closeTimer.current) clearTimeout(closeTimer.current);
    },
    []
  );

  return { open, setOpen, scheduleOpen, scheduleClose, forceClose } as const;
}

function getInitials(user: any) {
  const first =
    user?.first_name || user?.firstName || user?.name?.split(" ")[0] || "";
  const last =
    user?.last_name || user?.lastName || user?.name?.split(" ")[1] || "";
  const initials = `${first?.[0] || ""}${last?.[0] || ""}`.toUpperCase();
  return initials || "U";
}

export default function Header({ user }: { user?: any }) {
  const router = useRouter();

  const navLinks = user
    ? [
        { href: "/dashboard", label: "Dashboard" },
        { href: "/profile", label: "Profile" },
        { href: "/jobs", label: "Jobs" },
        { href: "/research-opportunities", label: "Research Opportunities" },
        ...(user?.role === "ADMIN"
          ? [
              { href: "/admin", label: "Admin Panel" },
              { href: "/create-company", label: "Create Company" },
            ]
          : []),
        ...(user?.role === "RECRUITER" || user?.role === "COMPANY_HR"
          ? [
              { href: "/jobs/create", label: "Post Job" },
              { href: "/create-company", label: "Create Company" },
            ]
          : []),
      ]
    : [
        { href: "/login", label: "Login" },
        { href: "/signup", label: "Sign Up" },
        { href: "/register-company", label: "Register Company" },
        { href: "/login-company", label: "Login Company" },
      ];

  // User menu behavior
  const { open, setOpen, scheduleOpen, scheduleClose, forceClose } =
    useHoverIntent({
      openDelay: 140, // tweak if needed
      closeDelay: 220, // tweak if needed
    });
  const menuRef = useRef<HTMLDivElement | null>(null);
  const buttonRef = useRef<HTMLButtonElement | null>(null);

  // Close on outside click
  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (!open) return;
      const target = e.target as Node;
      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        forceClose();
      }
    }
    window.addEventListener("mousedown", onClickOutside);
    return () => window.removeEventListener("mousedown", onClickOutside);
  }, [open, forceClose]);

  // Close on Escape
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === "Escape") forceClose();
    }
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  return (
    <header className="sticky top-0 z-40 w-full border-b bg-white/70 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3">
        <Link href="/" className="text-lg font-semibold tracking-tight">
          AI Talent Hub
        </Link>

        <nav className="hidden items-center gap-2 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {user ? (
          <div className="relative">
            <button
              ref={buttonRef}
              onMouseEnter={scheduleOpen}
              onMouseLeave={scheduleClose}
              onFocus={() => setOpen(true)}
              onBlur={() => setOpen(false)}
              onClick={() => setOpen((v) => !v)}
              className="group flex items-center gap-2 rounded-2xl border px-2 py-1 shadow-sm hover:bg-gray-50"
              aria-haspopup="menu"
              aria-expanded={open}
            >
              {/* Avatar */}
              {user?.image || user?.avatar ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={user?.image || user?.avatar}
                  alt={user?.name || "User"}
                  className="h-8 w-8 rounded-full object-cover"
                />
              ) : (
                <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-200 text-sm font-semibold text-gray-700">
                  {getInitials(user)}
                </div>
              )}
              <span className="hidden text-sm font-medium text-gray-700 sm:inline">
                {user?.name ||
                  `${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim() ||
                  "User"}
              </span>
              <svg
                className={`h-4 w-4 transition-transform duration-150 ${
                  open ? "rotate-180" : "rotate-0"
                }`}
                viewBox="0 0 20 20"
                fill="currentColor"
                aria-hidden="true"
              >
                <path d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 10.94l3.71-3.71a.75.75 0 1 1 1.06 1.06l-4.24 4.25a.75.75 0 0 1-1.06 0L5.25 8.29a.75.75 0 0 1-.02-1.08z" />
              </svg>
            </button>

            {/* Menu */}
            <div
              ref={menuRef}
              onMouseEnter={scheduleOpen}
              onMouseLeave={scheduleClose}
              role="menu"
              aria-label="User menu"
              className={`absolute right-0 mt-2 w-52 overflow-hidden rounded-2xl border bg-white shadow-xl transition-all duration-150 ${
                open
                  ? "pointer-events-auto visible opacity-100 translate-y-0"
                  : "pointer-events-none invisible opacity-0 -translate-y-1"
              }`}
            >
              <Link
                href="/profile"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                View Profile
              </Link>
              <Link
                href="/profile/edit"
                role="menuitem"
                className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                onClick={() => setOpen(false)}
              >
                Edit Profile
              </Link>
              <button
                role="menuitem"
                onClick={async () => {
                  await authClient.signOut({ redirectTo: "/login" });
                  router.push("/login");
                }}
                className="block w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50"
              >
                Sign Out
              </button>
            </div>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="rounded-xl px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100"
              >
                {link.label}
              </Link>
            ))}
          </div>
        )}
      </div>
    </header>
  );
}
