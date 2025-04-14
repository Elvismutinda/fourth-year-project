import { Metadata } from "next";

import DraftDetails from "@/components/draft/DraftDetails";

export const metadata: Metadata = {
  title: "Draft Document",
  description:
    "Draft legal documents with ease using our intuitive interface. Choose from a variety of templates and customize them to fit your needs.",
};

const DraftPage = () => {
  return (
    <div>
      <DraftDetails />
    </div>
  );
};

export default DraftPage;
