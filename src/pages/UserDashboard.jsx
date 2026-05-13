import { Link } from "react-router-dom";

export default function UserDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  return (
    <div>
      <div className="rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
        <p className="text-sm font-bold text-emerald-600">Overview</p>
        <h1 className="mt-2 text-3xl font-black text-slate-900 dark:text-white transition-colors">
          Welcome, {user?.name || "User"}
        </h1>
        <p className="mt-2 text-slate-500 dark:text-slate-400 transition-colors">
          Read blogs, like articles, share posts and join discussions.
        </p>
      </div>

      <div className="mt-6 grid gap-5 md:grid-cols-3">
        <div className="rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
          <p className="text-sm text-slate-500">Liked Articles</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white transition-colors">0</h2>
        </div>

        <div className="rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
          <p className="text-sm text-slate-500">Comments</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white transition-colors">0</h2>
        </div>

        <div className="rounded-[28px] bg-white dark:bg-slate-900 p-6 shadow-sm transition-colors">
          <p className="text-sm text-slate-500 dark:text-slate-400">Shares</p>
          <h2 className="mt-3 text-4xl font-black text-slate-900 dark:text-white transition-colors">0</h2>
        </div>
      </div>

      <Link
        to="/"
        className="mt-6 inline-flex rounded-2xl bg-emerald-500 px-6 py-3 font-bold text-white hover:bg-emerald-600"
      >
        Browse Blogs
      </Link>
    </div>
  );
}