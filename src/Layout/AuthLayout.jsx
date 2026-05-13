import { Outlet } from "react-router-dom";
import Navbar from "../components/Navbar";

export default function AuthLayout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#00263f] via-[#004a7c] to-[#0065a8] text-white">
      <Navbar variant="auth" />
      <main className="pt-[64px]">
        <Outlet />
      </main>
    </div>
  );
}