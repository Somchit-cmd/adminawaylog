
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/30">
      <Navbar />
      <main className="container mx-auto px-4 pt-16 pb-20 sm:px-6 lg:px-8 page-transition">
        <Outlet />
      </main>
    </div>
  );
};

export default Layout;
