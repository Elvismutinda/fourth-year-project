import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms of Service",
  description: "",
};

const TermsPage = () => {
  return (
    <div className="mx-auto h-full max-w-5xl text-black">
      <div className="prose prose-pink max-w-none pb-4 prose-invert prose-pre:m-0 prose-pre:bg-transparent prose-pre:p-0">
        <h1>INTELAW TERMS OF SERVICE</h1>
        <p>Last Updated: 2025-01-08</p>
        <h2></h2>
      </div>
    </div>
  );
};

export default TermsPage;
