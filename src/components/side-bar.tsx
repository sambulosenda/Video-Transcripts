"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, FileText, Settings, CreditCard, Headphones } from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: Home,
    href: "/transcribe",
  },
  {
    label: "Transcriptions",
    icon: FileText,
    href: "/transcriptions",
  },
  {
    label: "New Transcription",
    icon: Headphones,
    href: "/new-transcription",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/settings",
  },
  {
    label: "Billing",
    icon: CreditCard,
    href: "/billing",
  },
];

const SideNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-800 text-white">
      <div className="px-3 py-4">
        <Link href="/dashboard" className="flex items-center mb-14">
          <h1 className="text-2xl font-bold">AudioScriber</h1>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-3 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-3 py-2 text-sm font-medium rounded-md transition ${
                pathname === route.href
                  ? "bg-gray-900 text-white"
                  : "text-gray-300 hover:bg-gray-700 hover:text-white"
              }`}
            >
              <route.icon className="mr-3 h-6 w-6" />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
};

export default SideNavbar;
