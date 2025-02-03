import { SettingConfig } from "@/types";
import { KeyRound, User } from "lucide-react";

export const settingConfig: SettingConfig = {
  sidebarNav: [
    {
      title: "Account settings",
      href: "/app/setting/profile",
      icon: "user",
    },
    {
      title: "Change password",
      href: "/app/setting/password",
      icon: "key",
    },
  ],
};
