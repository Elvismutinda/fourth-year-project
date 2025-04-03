import { SettingsConfig } from "@/types";

export const settingsConfig: SettingsConfig = {
  mainNav: [
    {
      title: "Account",
      href: "/app/settings/account",
    },
    {
      title: "Subscription",
      href: "/app/settings/subscription",
    },
    {
      title: "History & Sync",
      href: "/app/settings/history",
    },
    {
      title: "Models",
      href: "/app/settings/models",
      disabled: true,
    },
    {
      title: "Contact Us",
      href: "/app/settings/contact",
      disabled: true,
    },
  ],
};
