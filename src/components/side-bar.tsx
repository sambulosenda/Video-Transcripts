"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import { Home, Settings, CreditCard } from "lucide-react";
import Image from "next/image";

const routes = [
  { label: "Dashboard", icon: Home, href: "/dashboard" },
  { label: "Settings", icon: Settings, href: "/settings" },
  { label: "Billing", icon: CreditCard, href: "/billing" },
];

const SideNavbar = () => {
  const pathname = usePathname();

  return (
    <div className="flex flex-col h-full bg-gray-900 text-gray-300 shadow-lg">
      <div className="px-6 py-8">
        <Link
          href="/dashboard"
          className="flex items-center mb-8 transition-transform hover:scale-105"
        >
          <div className="relative w-12 h-12 mr-4">
            <Image
              src="/logo.png"
              alt="AudioScriber"
              layout="fill"
              objectFit="contain"
              className="rounded-full"
            />
          </div>
          <h1 className="text-2xl font-bold text-white tracking-wide">
            AudioScriber
          </h1>
        </Link>
      </div>
      <div className="flex-1 overflow-y-auto">
        <nav className="px-4 space-y-2">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-all duration-200 ${
                pathname === route.href
                  ? "bg-indigo-600 text-white shadow-md"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white"
              }`}
            >
              <route.icon
                className={`mr-3 h-5 w-5 transition-colors duration-200 ${
                  pathname === route.href
                    ? "text-white"
                    : "text-gray-400 group-hover:text-white"
                }`}
              />
              {route.label}
            </Link>
          ))}
        </nav>
      </div>
      <div className="px-6 py-4 border-t border-gray-700">
        <p className="text-xs text-gray-500 text-center">
          © 2023 AudioScriber. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SideNavbar;
