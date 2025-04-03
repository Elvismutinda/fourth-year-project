import React from "react";
import { auth } from "../../../../../auth";
import { redirect } from "next/navigation";

type CaselawPageProps = {
  params: {
    id: string;
  };
};

const CaselawPage = async (props: CaselawPageProps) => {
  const { id } = await props.params;

  const session = await auth();
  const userId = session?.user?.id;

  if (!userId) {
    return redirect("/login");
  }

  return (
    <div>hi</div>
  );
};

export default CaselawPage;
