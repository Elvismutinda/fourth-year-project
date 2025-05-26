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

export type RecentUpload = {
  file_name: string;
  user: string;
  size_kb: number;
  date_uploaded: string;
  chats_started: number;
};

export type UserData = {
  id: string;
  name: string;
  email: string;
  emailVerified?: Date | null;
  role: "USER" | "PREMIUM" | string;
  phone?: string | null;
  paystackSubscriptionStart?: Date | null;
  paystackSubscriptionEnd?: Date | null;
};
