import { redirect } from "next/navigation";
import { User } from "next-auth";
import { auth } from "../../../../../auth";

import PaystackPayment from "../../../../components/payment/PaystackPayment";

const SubscriptionPage = async () => {
  const session = await auth();

  const user = session?.user as
    | (User & {
        email: string;
        role: "USER" | "PREMIUM";
        paystackSubscriptionEnd: string | null;
      })
    | undefined;

  if (!user) {
    return redirect("/login");
  }

  return <PaystackPayment user={user} />;
};

export default SubscriptionPage;
