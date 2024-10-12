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
    <div className="w-64 h-full bg-white border-r border-gray-200 flex flex-col">
      <div className="p-6">
        <Link href="/dashboard" className="flex items-center space-x-3 mb-8">
          <div className="relative w-10 h-10">
            <Image
              src="/logo.png"
              alt="AudioScriber"
              layout="fill"
              objectFit="contain"
              className="rounded-md"
            />
          </div>
          <span className="text-xl font-bold text-gray-800">AudioScriber</span>
        </Link>
      </div>
      <nav className="flex-1 px-4">
        {routes.map((route) => (
          <Link
            key={route.href}
            href={route.href}
            className={`flex items-center px-4 py-3 mb-2 text-sm font-medium rounded-lg transition-all duration-200 ${
              pathname === route.href
                ? "bg-indigo-50 text-indigo-600"
                : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
            }`}
          >
            <route.icon
              className={`mr-3 h-5 w-5 ${
                pathname === route.href ? "text-indigo-600" : "text-gray-400"
              }`}
            />
            {route.label}
          </Link>
        ))}
      </nav>
      <div className="p-4 border-t border-gray-200">
        <p className="text-xs text-gray-500 text-center">
          © 2023 AudioScriber. All rights reserved.
        </p>
      </div>
    </div>
  );
};

export default SideNavbar;
