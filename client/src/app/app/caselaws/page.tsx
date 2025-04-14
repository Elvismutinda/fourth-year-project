import { Metadata } from "next";

import SearchCase from "@/components/SearchCase";

export const metadata: Metadata = {
  title: "Caselaws",
  description: "Search for caselaws.",
};

const page = () => {
  return (
    <div>
      <SearchCase />
    </div>
  );
};

export default page;
