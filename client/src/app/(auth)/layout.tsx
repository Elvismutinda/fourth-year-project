import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-[#0c1428]">{children}</div>;
};

export default Layout;
