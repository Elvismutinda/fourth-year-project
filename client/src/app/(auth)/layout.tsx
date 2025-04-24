import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-[#1A1928]">{children}</div>;
};

export default Layout;
