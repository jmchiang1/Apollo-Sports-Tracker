import { Coins, Gauge, Map, type LucideIcon } from "lucide-react";

export interface NavItem {
  href: string;
  label: string;
  icon: LucideIcon;
}

export const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Dashboard", icon: Gauge },
  { href: "/roadmap", label: "Roadmap", icon: Map },
  { href: "/capital", label: "Capital", icon: Coins },
];

/** Active if the pathname equals the href, or is nested under a non-root href. */
export function isActive(pathname: string, href: string): boolean {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}
