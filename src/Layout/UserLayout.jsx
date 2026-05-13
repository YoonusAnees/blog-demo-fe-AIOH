import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";
import UserSidebar from "../components/UserSidebar";

export default function UserLayout() {
  return (
    <div className="min-h-screen bg-[#f6f8fb] dark:bg-[#020c15] text-slate-900 dark:text-white transition-colors duration-300">
      <UserSidebar />

      <div className="lg:pl-[200px]">
        <Navbar variant="user" />

        <main className="pt-[64px] p-5 md:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}