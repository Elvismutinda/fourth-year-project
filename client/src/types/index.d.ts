import { Icons } from "@/components/Icons";
import { LucideIcon } from "lucide-react";

export type SiteConfig = {
  name: string;
  description: string;
};

export type SidebarNavItem = {
  title: string;
  disabled?: boolean;
  external?: boolean;
  icon?: keyof typeof Icons;
} & (
  | {
      href: string;
      items?: never;
    }
  | {
      href?: string;
      items: NavLink[];
    }
);

export type SettingConfig = {
  sidebarNav: SidebarNavItem[];
};

export type NavItem = {
  title: string;
  href: string;
  disabled?: boolean;
};

export type MainNavItem = NavItem;

export type SettingsConfig = {
  mainNav: MainNavItem[];
};
