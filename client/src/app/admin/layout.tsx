import React from "react";

const Layout = ({ children }: { children: React.ReactNode }) => {
  return <div className="min-h-screen bg-dark-300">{children}</div>;
};

export default Layout;
