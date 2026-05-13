import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import api from "../../api/axios";
import {
  FaRegFileAlt,
  FaRegEdit,
  FaRegChartBar,
} from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

export default function AdminAuthorDetails() {
  const { id } = useParams();

  const [author, setAuthor] = useState(null);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  useEffect(() => {
    const loadData = async () => {
      try {
        const authorsRes = await api.get("/users/authors");
        const dashboardRes = await api.get("/admin/dashboard");

        const selectedAuthor = authorsRes.data.data.find((a) => a._id === id);
        const authorBlogs = dashboardRes.data.data.allBlogs.filter(
          (blog) => blog.author?._id === id
        );

        setAuthor(selectedAuthor);
        setBlogs(authorBlogs);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [id]);

  const avatarUrl = useMemo(() => {
    if (!author?.avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        author?.name || "Author"
      )}&background=01213A&color=fff&size=500`;
    }

    if (author.avatar.startsWith("http")) return author.avatar;
    return `${baseUrl}${author.avatar}`;
  }, [author, baseUrl]);

  const totalLikes = blogs.reduce((sum, blog) => sum + (blog.likes?.length || 0), 0);
  const totalShares = blogs.reduce((sum, blog) => sum + (blog.shares || 0), 0);
  const totalViews = blogs.reduce((sum, blog) => sum + (blog.views || 0), 0);
  const totalComments = blogs.reduce((sum, blog) => sum + (blog.commentsCount || blog.commentCount || 0), 0);

  // Analytics Data
  const engagementData = [
    { name: "Mon", views: Math.floor(totalViews * 0.1), likes: Math.floor(totalLikes * 0.1) },
    { name: "Tue", views: Math.floor(totalViews * 0.15), likes: Math.floor(totalLikes * 0.12) },
    { name: "Wed", views: Math.floor(totalViews * 0.2), likes: Math.floor(totalLikes * 0.18) },
    { name: "Thu", views: Math.floor(totalViews * 0.12), likes: Math.floor(totalLikes * 0.1) },
    { name: "Fri", views: Math.floor(totalViews * 0.18), likes: Math.floor(totalLikes * 0.2) },
    { name: "Sat", views: Math.floor(totalViews * 0.15), likes: Math.floor(totalLikes * 0.15) },
    { name: "Sun", views: Math.floor(totalViews * 0.1), likes: Math.floor(totalLikes * 0.15) },
  ];

  const categories = blogs.reduce((acc, blog) => {
    const cat = blog.category || "Uncategorized";
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  const categoryData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }));

  const COLORS = ["#18d89d", "#045f98", "#01213A", "#64748b", "#94a3b8"];

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#eef2f4]">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#18d89d] border-t-transparent"></div>
      </div>
    );
  }

  if (!author) {
    return (
      <div className="min-h-screen bg-[#eef2f4] p-12 font-bold">
        Author not found.
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-[#eef2f4] text-[#20252b] mt-10">
      <section className="bg-gradient-to-r from-[#045f98] to-[#01213A] px-8 py-10 text-white md:px-14">
        <p className="text-sm font-black uppercase tracking-widest">Author Analytics</p>

        <div className="mt-6 flex flex-col gap-6 md:flex-row md:items-center">
          <img
            src={avatarUrl}
            alt={author.name}
            className="h-40 w-32 rounded-sm border-l-4 border-[#18d89d] object-cover shadow-xl"
          />

          <div>
            <div className="flex items-center gap-3 text-[10px] font-black uppercase tracking-widest">
              <span className="bg-white/20 px-2 py-1">Senior Contributor</span>
              <span className="text-[#18d89d]">
                ● Last Active: {(() => {
                  const activitySource = blogs.length > 0 
                    ? Math.max(...blogs.map(b => new Date(b.createdAt).getTime()))
                    : author.updatedAt ? new Date(author.updatedAt).getTime() : null;

                  if (!activitySource) return "Recently";
                  
                  const diff = Math.floor((new Date().getTime() - activitySource) / 60000);
                  if (diff < 1) return "Just now";
                  if (diff < 60) return `${diff} mins ago`;
                  const hours = Math.floor(diff / 60);
                  if (hours < 24) return `${hours} hours ago`;
                  return new Date(activitySource).toLocaleDateString();
                })()}
              </span>
            </div>

            <h1 className="mt-3 text-5xl font-black tracking-tight">{author.name}</h1>

            <p className="mt-5 max-w-3xl text-sm leading-7 text-white/80">
              Dedicated to delivering high-level strategic insights and in-depth
              market analysis that empower decision-makers. My focus lies in
              decoding executive leadership trends and navigating the
              complexities of global enterprise sectors.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-10">
        <div className="grid gap-8 md:grid-cols-3">
          <div className="border-l-4 border-[#18d89d] bg-white p-8 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Total Published
            </p>
            <h2 className="mt-5 text-4xl font-black">
              {blogs.length.toString().padStart(2, "0")}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase">Articles</p>
            <FaRegFileAlt className="mt-6 text-[#18d89d] text-xl" />
          </div>

          <div className="border-l-4 border-[#18d89d] bg-white p-8 shadow-sm">
            <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Engagement Yield
            </p>
            <h2 className="mt-5 text-4xl font-black">
              {(totalViews + totalLikes + totalShares + totalComments).toLocaleString()}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase">Interactions</p>
            <div className="mt-6 flex items-center gap-4 text-[#18d89d] text-xl">
              <FaRegChartBar />
              <BiComment />
            </div>
          </div>

          <div className="border-l-4 border-[#18d89d] bg-white p-8 shadow-sm">
             <p className="text-[10px] font-black uppercase text-slate-500 tracking-widest">
              Total Echoes
            </p>
            <h2 className="mt-5 text-4xl font-black">
              {totalLikes.toLocaleString()}
            </h2>
            <p className="mt-2 text-sm font-semibold text-slate-500 uppercase">Likes</p>
            <FaRegEdit className="mt-6 text-[#18d89d] text-xl" />
          </div>
        </div>

        {/* Audience Growth Trajectory (Now with real charts) */}
        <div className="mt-12 border-l-[14px] border-[#18d89d] bg-white p-8 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-xl font-black uppercase tracking-tight">
                Audience Engagement Trajectory
              </h2>
              <p className="mt-1 text-xs font-medium text-slate-400 uppercase tracking-widest">
                Data-driven mapping of visitor influx and interaction depth.
              </p>
            </div>

            <div className="flex gap-2">
              <button className="bg-[#01213A] px-3 py-1 text-[9px] font-black text-white uppercase">
                Daily
              </button>
              <button className="bg-[#18d89d] px-3 py-1 text-[9px] font-black text-black uppercase">
                Weekly
              </button>
              <button className="bg-[#01213A] px-3 py-1 text-[9px] font-black text-white uppercase">
                Monthly
              </button>
            </div>
          </div>

          <div className="relative mt-12 h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={engagementData}>
                <defs>
                  <linearGradient id="colorViews" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#18d89d" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#18d89d" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                <XAxis 
                  dataKey="name" 
                  axisLine={false} 
                  tickLine={false} 
                  tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}} 
                  dy={10}
                />
                <YAxis 
                   axisLine={false}
                   tickLine={false}
                   tick={{fill: '#64748b', fontSize: 10, fontWeight: 900}}
                />
                <Tooltip 
                   contentStyle={{backgroundColor: '#fff', border: 'none', borderRadius: '4px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'}}
                   itemStyle={{color: '#01213A', fontWeight: 900, fontSize: '12px'}}
                   labelStyle={{color: '#64748b', marginBottom: '4px', fontSize: '10px'}}
                />
                <Area 
                  type="monotone" 
                  dataKey="views" 
                  stroke="#18d89d" 
                  strokeWidth={4} 
                  fillOpacity={1} 
                  fill="url(#colorViews)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      

      </section>
    </main>
  );
}