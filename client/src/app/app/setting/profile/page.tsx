import ProfileUpdateForm from "@/components/auth/ProfileUpdateForm";
import SiteHeader from "@/components/SiteHeader";
import SiteShell from "@/components/SiteShell";
import { User } from "lucide-react";

export const metadata = {
  title: "Settings",
  description: "Manage account settings",
};

const ProfilePage = () => {
  return (
    <SiteShell>
      <SiteHeader icon={User} heading="Account settings" />
      <div className="">
        <ProfileUpdateForm />
      </div>
    </SiteShell>
  );
};

export default ProfilePage;
