import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaHeart } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { BiComment } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";

import StatCard from "../../components/dashboard/StatCard";

export default function AuthorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);
  const [stats, setStats] = useState({
    totalViews: 0,
    totalLikes: 0,
    totalComments: 0,
    viewGrowth: "0%",
    engagement: "0%",
    totalBlogs: 0,
    publishedBlogs: 0,
  });

  const loadData = async () => {
    try {
      const [blogsRes, statsRes] = await Promise.all([
        api.get("/blogs/me/my-blogs"),
        api.get("/blogs/me/stats"),
      ]);
      setBlogs(blogsRes.data.data || []);
      setStats(statsRes.data.data || {});
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const formatNumber = (num) => {
    if (num >= 1000) return (num / 1000).toFixed(1) + "K";
    return num;
  };

  const dashboardStats = [
    { title: "TOTAL VIEWS", value: stats.totalViews, growth: stats.viewGrowth },
    { title: "DIRECT COMMENTS", value: stats.totalComments, growth: "+12%" }, // Mocked growth for now as requested
    { title: "ARTICLE INTERACTION", value: stats.totalLikes, icon: <FaHeart size={16} /> },
    { title: "ENGAGEMENT RATE", value: stats.engagement, growth: "+2%" },
  ];

  return (
    <main className="min-h-screen bg-[#f6f8fb] dark:bg-slate-950 px-5 py-10 transition-colors duration-300 md:px-10">
      <div className="mx-auto max-w-7xl">
        <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
          Welcome back, {user?.name || "Alex"}!
        </h1>

        {/* STATS CARDS */}
        <section className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {dashboardStats.map((stat, i) => (
            <StatCard key={i} {...stat} />
          ))}
        </section>

        {/* CTA BANNER */}
        <section className="mt-10 rounded-[30px] border-t border-b border-l-4 border-r-4 border-[#18d89d]  bg-white dark:bg-slate-900 px-10 py-6 text-center shadow-sm">
          <p className="mx-auto max-w-4xl  text-lg font-bold text-slate-700 dark:text-slate-300 leading-relaxed">
            Ready to inspire? Turn your latest ideas into impactful stories and share your insights with the global community.
          </p>
          <Link
            to="/author-dashboard/create-post"
            className="mt-6 inline-flex h-12 items-center justify-center rounded-xl bg-[#18d89d] px-10 text-sm font-black uppercase tracking-wider text-[#01213A] transition hover:bg-[#14c392] hover:scale-105"
          >
            Start Writing
          </Link>
        </section>

        {/* DRAFTS & PUBLISHED */}
        <section className="mt-12 grid gap-10 lg:grid-cols-[1.2fr_1fr]">
          {/* RECENT DRAFTS */}
          <div className="rounded-[30px] bg-white dark:bg-slate-900 p-8 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-black text-slate-900 dark:text-white">Recent Drafts</h2>
              <Link to="/author-dashboard/articles" className="text-[10px] font-black uppercase tracking-widest text-[#18d89d] border border-[#18d89d] px-3 py-1 rounded-md">
                VIEW ALL
              </Link>
            </div>
            <div className="space-y-4">
              {blogs.filter(b => b.status === "Draft").slice(0, 3).map((draft, i) => (
                <div key={i} className="group relative grid grid-cols-[110px_1fr] gap-5 overflow-hidden rounded-2xl bg-slate-50 dark:bg-slate-800 p-3 transition hover:bg-slate-100 dark:hover:bg-slate-700">
                  <img
                    src={draft.image || "https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=400&auto=format&fit=crop"}
                    alt=""
                    className="h-24 w-full rounded-xl object-cover"
                  />
                  <div className="flex flex-col justify-center">
                    <h3 className="text-lg font-black text-slate-900 dark:text-white line-clamp-1">{draft.title}</h3>
                    <p className="mt-1 text-[10px] font-bold text-slate-400">
                      Last edited {new Date(draft.updatedAt).toLocaleDateString()} • {(draft.content || "").split(" ").length} words
                    </p>
                    <Link to={`/author-dashboard/create-post/${draft._id}`} className="mt-2 text-[10px] font-black uppercase tracking-widest text-slate-900 dark:text-white flex items-center gap-1 group-hover:translate-x-1 transition-transform self-end mr-2">
                      CONTINUE <FaArrowRight className="text-[8px]" />
                    </Link>
                  </div>
                </div>
              ))}
              {blogs.filter(b => b.status === "Draft").length === 0 && (
                <p className="py-10 text-center text-slate-400 font-bold">No drafts found.</p>
              )}
            </div>
          </div>

          {/* PUBLISHED WORKS */}
          <div className="rounded-[30px] bg-white dark:bg-slate-900 p-8 shadow-sm">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Published Works</h2>
            <div className="space-y-8">
              {blogs.filter(b => b.status === "Published").slice(0, 3).map((blog, i) => (
                <div key={i} className="border-b border-slate-100 dark:border-slate-800 pb-6 last:border-0 last:pb-0">
                  <p className="text-[10px] font-black uppercase tracking-[2px] text-[#18d89d]">
                    {blog.category || "TECHNOLOGY"} • {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).toUpperCase()}
                  </p>
                  <h3 className="mt-2 text-xl font-black leading-tight text-[#01213A] dark:text-white line-clamp-2">
                    {blog.title}
                  </h3>
                  <div className="mt-4 flex items-center justify-between">
                    <div className="flex items-center gap-4 text-[10px] font-bold text-slate-400">
                      <span className="flex items-center gap-1"><IoEyeOutline size={14} /> {formatNumber(blog.views || 0)}</span>
                      <span className="flex items-center gap-1"><FaHeart size={10} /> {blog.likes?.length || 0}</span>
                      <span className="flex items-center gap-1"><BiComment size={12} /> {blog.commentsCount || 0}</span>
                    </div>
                    <Link to={`/blogs/${blog._id}`} className="text-[10px] font-black uppercase tracking-widest text-[#18d89d] border border-[#18d89d] px-4 py-2 rounded-lg hover:bg-[#18d89d] hover:text-white transition-colors">
                      VIEW ARTICLE
                    </Link>
                  </div>
                </div>
              ))}
              {blogs.filter(b => b.status === "Published").length === 0 && (
                <p className="py-10 text-center text-slate-400 font-bold">No published works yet.</p>
              )}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
