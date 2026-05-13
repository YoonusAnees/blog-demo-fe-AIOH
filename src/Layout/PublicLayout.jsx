import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function PublicLayout() {
  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <Navbar variant="public" />
      <main className="pt-[64px]">
        <Outlet />
      </main>
    </div>
  );
}