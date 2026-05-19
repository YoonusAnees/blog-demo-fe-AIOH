import { Link, useLocation } from "react-router-dom";
import { CiSearch, CiLight, CiDark } from "react-icons/ci";
import { IoNotificationsOutline, IoSettingsOutline } from "react-icons/io5";
import { useState, useEffect, useRef } from "react";
import api from "../api/axios";
import NotificationDropdown from "./notifications/NotificationDropdown";
import { useTheme } from "../context/ThemeContext";
import { useSocket } from "../context/SocketContext";

export default function Navbar({ variant = "public" }) {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("user")));
  const { theme, toggleTheme } = useTheme();
  const socket = useSocket();
  const [notifications, setNotifications] = useState([]);
  const [showNotifications, setShowNotifications] = useState(false);
  const notificationRef = useRef(null);

  const location = useLocation();
  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const isAdminLayout = variant === "admin";
  const isAuthorLayout = variant === "author";
  const isUserLayout = variant === "user";
  const isAuthLayout = variant === "auth";

  const isDashboardLayout = isAdminLayout || isAuthorLayout || isUserLayout;

  const title = isAdminLayout
    ? "Admin Dashboard"
    : isAuthorLayout
      ? "AUTHOR DASHBOARD"
      : isUserLayout
        ? "USER DASHBOARD"
        : "BlogAuth";

  const homeLink = isAdminLayout
    ? "/admin-dashboard"
    : isAuthorLayout
      ? "/author-dashboard"
      : isUserLayout
        ? "/user-dashboard"
        : "/";

  const navClass = isDashboardLayout
    ? "fixed top-0 z-40 w-full border-b border-gray-200 bg-white dark:bg-slate-900 dark:border-slate-800 text-slate-900 dark:text-white shadow-md lg:left-[200px] lg:right-0 lg:w-auto transition-colors duration-300"
    : "fixed top-0 z-40 w-full border-b border-white/10 bg-black text-white transition-colors duration-300";

  const fetchNotifications = async () => {
    if (!user) return;
    try {
      const res = await api.get("/notifications");
      setNotifications(res.data.data || []);
    } catch (error) {
      console.log("Error fetching notifications:", error);
    }
  };

  useEffect(() => {
    fetchNotifications();

    const handleStorage = () => {
      setUser(JSON.parse(localStorage.getItem("user")));
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  useEffect(() => {
    if (socket) {
      socket.on("new_notification", (notification) => {
        setNotifications((prev) => [notification, ...prev]);
        // Optional: Play a subtle notification sound
      });

      return () => {
        socket.off("new_notification");
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setShowNotifications(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const markAllAsRead = async () => {
    try {
      await api.patch("/notifications/read-all");
      setNotifications(notifications.map((n) => ({ ...n, read: true })));
    } catch (error) {
      console.log("Error marking all as read:", error);
    }
  };

  const markAsRead = async (id) => {
    try {
      await api.patch(`/notifications/${id}/read`);
      setNotifications(
        notifications.map((n) => (n._id === id ? { ...n, read: true } : n)),
      );
    } catch (error) {
      console.log("Error marking as read:", error);
    }
  };

  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <nav className={navClass}>
      <div className="flex h-[64px] items-center justify-between px-5 md:px-10">
        <Link to={homeLink} className="text-xl tracking-tight">
          {isAdminLayout || isAuthorLayout ? (
            title
          ) : (
            <img
              src="logoAIOH.png"
              alt="logo"
              className="mt-3 flex h-10 w-35 items-center justify-center"
            />
          )}
        </Link>

        {isDashboardLayout && (
          <div className="hidden h-[40px] w-[420px] items-center rounded-full bg-[#f0eef1] pl-5 pr-1 md:flex">
            <input
              type="text"
              placeholder="Search..."
              className="flex-1 bg-transparent text-sm text-gray-700 outline-none placeholder:text-gray-400"
            />
            <div className="mx-2 h-5 w-px bg-gray-300" />
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-white shadow-sm transition hover:bg-gray-100">
              <CiSearch className="text-lg text-gray-700" />
            </button>
          </div>
        )}

        <div className="flex items-center gap-3">
          {!isAuthLayout && (
            <Link
              to="/"
              className={`hidden text-sm font-semibold hover:opacity-70 sm:block ${(isDashboardLayout && "text-slate-600 dark:text-slate-300") || "text-white dark:text-white"}`}
            >
              Blogs
            </Link>
          )}

          {user && (
            <div
              className="relative flex items-center gap-3"
              ref={notificationRef}
            >
              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className={`relative flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                  isDashboardLayout
                    ? "bg-[#f0eef1] text-gray-700 hover:bg-gray-200"
                    : "bg-white/10 text-white hover:bg-white/20"
                }`}
              >
                <IoNotificationsOutline className="text-lg" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[8px] font-bold text-white shadow-sm">
                    {unreadCount}
                  </span>
                )}
              </button>

              {showNotifications && (
                <NotificationDropdown
                  notifications={notifications}
                  unreadCount={unreadCount}
                  markAllAsRead={markAllAsRead}
                  markAsRead={markAsRead}
                  setShowNotifications={setShowNotifications}
                  baseUrl={baseUrl}
                />
              )}

              {isDashboardLayout && (
                <button
                  onClick={toggleTheme}
                  className={`flex h-9 w-9 items-center justify-center rounded-full transition-colors ${
                    isDashboardLayout
                      ? "bg-[#f0eef1] dark:bg-slate-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-slate-700"
                      : "bg-white/10 text-white hover:bg-white/20"
                  }`}
                >
                  {theme === "light" ? (
                    <CiDark className="text-lg" />
                  ) : (
                    <CiLight className="text-lg" />
                  )}
                </button>
              )}
            </div>
          )}

          {user?.role === "admin" && !isAdminLayout && (
            <Link
              to="/admin-dashboard"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-black dark:text-white"
            >
              Admin
            </Link>
          )}
          {user?.role === "author" && !isAuthorLayout && (
            <Link
              to="/author-dashboard"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-black dark:text-white"
            >
              Author
            </Link>
          )}
          {user?.role === "user" && !isUserLayout && (
            <Link
              to="/user-dashboard"
              className="rounded-full bg-emerald-500 px-4 py-2 text-sm font-bold text-black dark:text-white"
            >
              Dashboard
            </Link>
          )}

          {!user && (
            <>
              {location.pathname !== "/author-login" &&
                location.pathname !== "/admin-login" && (
                  <Link
                    to="/author-login"
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-black"
                  >
                    Log In
                  </Link>
                )}
              {location.pathname !== "/author-register" &&
                location.pathname !== "/admin-register" && (
                  <Link
                    to="/author-register"
                    className="rounded-xl bg-emerald-400 px-5 py-3 text-xs font-black uppercase tracking-[0.2em] text-black"
                  >
                    Sign Up
                  </Link>
                )}
            </>
          )}

          {user && (
            <div className="flex items-center gap-3 border-l border-gray-200 pl-3 ml-2">
              <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200 shadow-sm ring-2 ring-emerald-500/20">
                {user.avatar ? (
                  <img
                    src={user.avatar?.startsWith("http") ? user.avatar : `${baseUrl}${user.avatar}`}
                    alt={user.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-sm font-black text-white">
                    {user.name?.charAt(0).toUpperCase() || "U"}
                  </div>
                )}
              </div>

              <div className="hidden leading-tight sm:block">
                <h4 className="text-sm font-black dark:text-white  ">
                  {user.name}
                </h4>
                <p className="text-[10px] font-bold uppercase tracking-wider text-emerald-600 opacity-80">
                  {user.role}
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
