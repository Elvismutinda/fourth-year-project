import ProfileUpdateForm from "@/components/auth/ProfileUpdateForm";
import PasswordUpdateForm from "@/components/auth/PasswordUpdateForm";
import DeleteAccount from "@/components/auth/DeleteAccount";
import { Separator } from "@/components/ui/separator";

const AccountPage = () => {
  return (
    <div className="mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 space-y-8">
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Update Account Information</h2>
        <div className="flex flex-col md:flex-row md:items-start gap-8">
          <div className="flex-1">
            <ProfileUpdateForm />
          </div>

          {/* <div className="hidden md:block w-px bg-accent h-3/4 self-center"></div> */}
          <Separator
            orientation="vertical"
            className="hidden md:block w-px bg-accent h-3/4 self-center"
          />

          <div className="flex-1">
            <PasswordUpdateForm />
          </div>
        </div>
      </div>

      <div className="!mt-10 px-4">
        <DeleteAccount />
      </div>
    </div>
  );
};

export default AccountPage;
