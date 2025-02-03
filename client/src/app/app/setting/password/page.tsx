import PasswordUpdateForm from "@/components/auth/PasswordUpdateForm";
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import { KeyRound } from "lucide-react";

export const metadata = {
  title: "Settings",
  description: "Manage account settings",
};

const PasswordPage = () => {
  return (
    <SiteShell>
      <SiteHeader icon={KeyRound} heading="Change password" />
      <div className="">
        <PasswordUpdateForm />
      </div>
    </SiteShell>
  );
};

export default PasswordPage;
