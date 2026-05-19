import { NavLink, useNavigate } from "react-router-dom";
import { IoIosLogOut } from "react-icons/io";
import api from "../api/axios";
import { TfiLayoutGrid2 } from "react-icons/tfi";
import { SlNote } from "react-icons/sl";
import { LuStickyNote } from "react-icons/lu";
import { CiSettings } from "react-icons/ci";

export default function AuthorSidebar() {
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
      : "flex items-center gap-3 px-6 py-4 text-sm font-bold text-white/85 transition-colors hover:bg-white/10 hover:text-white ";

  return (
    <aside className="fixed left-0 top-0 z-50 hidden h-screen w-[200px] flex-col bg-[#062b46] dark:bg-slate-950 lg:flex transition-colors duration-300">
      <div className="px-6 py-8 flex justify-center">
        <img src="logoAIOH.png" alt="logo" className="h-10 w-35" />
      </div>

      <nav className="mt-8 flex flex-col">
        <NavLink to="/author-dashboard" end className={linkClass}>
          <TfiLayoutGrid2 className="text-lg min-w-[20px]" />
          <span>My Dashboard</span>
        </NavLink>

        <NavLink to="/author-dashboard/create-post" className={linkClass}>
          <SlNote className="text-lg min-w-[20px]" />
          <span>Create Post</span>
        </NavLink>

        <NavLink to="/author-dashboard/articles" className={linkClass}>
          <LuStickyNote className="text-lg min-w-[20px]" />
          <span>My Articles</span>
        </NavLink>

        <NavLink to="/author-dashboard/profile" className={linkClass}>
          <CiSettings className="text-xl min-w-[20px]" />
          <span>Profile Settings</span>
        </NavLink>
      </nav>

      <div className="mt-auto flex justify-center pb-10">
        <button
          onClick={logout}
          className="flex w-[70%] items-center justify-center gap-3 bg-black dark:bg-slate-800 px-5 py-3 text-sm font-bold text-white transition hover:bg-gray-800"
        >
          <IoIosLogOut className="text-lg" />
          Logout
        </button>
      </div>
    </aside>
  );
}
