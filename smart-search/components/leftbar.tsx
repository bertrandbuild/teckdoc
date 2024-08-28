"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { page_routes } from "@/lib/routes-config";

export function Leftbar() {
  const pathname = usePathname();

  return (
    <nav className="w-1/4 bg-gray-900 text-white p-4">
      <ul>
        {page_routes.map((route) => (
          <li key={route.href}>
            <Link href={route.href} className={`block py-2 px-4 rounded ${pathname === route.href ? 'bg-gray-800' : ''}`}>
              {route.href.split("/").pop()?.replace(/-/g, " ")}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
