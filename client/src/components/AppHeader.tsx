import { format, getHours } from "date-fns";
import { SidebarToggle } from "./SidebarToggle";
import { auth } from "../../auth";

export const AppHeader = async () => {
  const session = await auth();
  const currentHour = getHours(new Date());
  let greeting;

  if (currentHour >= 5 && currentHour < 12) {
    greeting = "Good Morning";
  } else if (currentHour >= 12 && currentHour < 17) {
    greeting = "Good Afternoon";
  } else {
    greeting = "Good Evening";
  }

  return (
    <div className="flex flex-row items-center flex-nowrap h-full justify-between px-2 py-0.5">
      <SidebarToggle />

      <div className="flex flex-row items-center">
        <div className="flex flex-row items-center">
          <div className="text-[#fff] text-sm font-semibold">
            <span>{greeting}, </span>
            <span>{session?.user?.name}</span>
          </div>
        </div>
      </div>
    </div>
  );
};
