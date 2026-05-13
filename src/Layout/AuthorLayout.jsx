import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import AuthorSidebar from "../components/AuthorSidebar";

export default function AuthorLayout() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#020c15] text-slate-900 dark:text-white transition-colors duration-300">
      <AuthorSidebar />

      <div className="lg:pl-[200px]">
        <Navbar variant="author" />

        <main className="pt-[64px]">
          <Outlet />
        </main>
      </div>
    </div>
  );
}