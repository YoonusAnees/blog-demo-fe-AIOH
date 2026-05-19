import { NavLink, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { IoIosLogOut } from "react-icons/io";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { FaUsers, FaArrowLeft } from "react-icons/fa";
import { SlNote } from "react-icons/sl";
import { MdOutlineAnalytics } from "react-icons/md";
import { MdSettings } from "react-icons/md";

export default function AdminSidebar() {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.log(error);
    }

    localStorage.removeItem("user");
    navigate("/");
  };

  const linkClass = ({ isActive }) =>
    isActive
      ? "flex items-center gap-3 bg-[#18d89d] px-6 py-4 text-sm font-bold text-white transition-colors border-l-4 border-white"
      : "flex items-center gap-3 px-6 py-4 text-sm font-bold text-white/50 transition-colors hover:bg-white/10 hover:text-white ";

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[200px] flex-col bg-[#062b46] dark:bg-[#041a2a] lg:flex border-r border-white/5 transition-colors duration-300">
      <div className="px-6 py-8 flex justify-center">
        <img src="logoAIOH.png" alt="logo" className="h-10 w-35" />
      </div>

      <nav className="mt-8 flex flex-col">
        <NavLink to="/admin-dashboard" end className={linkClass}>
          <TfiLayoutGrid2 className="text-lg min-w-[20px]" />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/admin-dashboard/admin-articles" className={linkClass}>
          <SlNote className="text-lg min-w-[20px]" />
          <span>Blogs & Articles</span>
        </NavLink>

        <NavLink to="/admin-dashboard/authors" className={linkClass}>
          <FaUsers className="text-lg min-w-[20px]" />
          <span>Authors</span>
        </NavLink>

        <NavLink to="/admin-dashboard/analytics" className={linkClass}>
          <MdOutlineAnalytics className="text-lg min-w-[20px]" />
          <span>ANALYTICS</span>
        </NavLink>

        <NavLink to="/admin-settings" className={linkClass}>
          <MdSettings className="text-lg min-w-[20px]" />
          <span>System Settings</span>
        </NavLink>

      </nav>

      <div className="mt-auto flex justify-center pb-10">
        <button
          onClick={logout}
          className="flex w-[80%] items-center justify-center gap-3 bg-black px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800 rounded-lg shadow-lg border border-white/10"
        >
          <IoIosLogOut className="text-lg" />
          LOGOUT
        </button>
      </div>
    </aside>
  );
}