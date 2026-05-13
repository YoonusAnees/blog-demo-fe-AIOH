import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-white dark:bg-[#020c15] text-slate-900 dark:text-white transition-colors duration-300">
      <Navbar variant="public" />
      <main className="pt-[64px]">
        <Outlet />
      </main>
    </div>
  );
}