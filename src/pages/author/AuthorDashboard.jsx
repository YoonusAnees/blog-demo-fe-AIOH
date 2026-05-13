import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import { FaHeart } from "react-icons/fa";
import { FaArrowRight } from "react-icons/fa6";
import { BiComment } from "react-icons/bi";
import { IoEyeOutline } from "react-icons/io5";

const CountUp = ({ end, duration = 1500 }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime = null;
    let animationFrame;

    const animate = (currentTime) => {
      if (!startTime) startTime = currentTime;
      const progress = currentTime - startTime;
      const percentage = Math.min(progress / duration, 1);
      
      const easeOut = percentage === 1 ? 1 : 1 - Math.pow(2, -10 * percentage);
      
      setCount(Math.floor(easeOut * end));

      if (progress < duration) {
        animationFrame = requestAnimationFrame(animate);
      } else {
        setCount(end);
      }
    };

    animationFrame = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrame);
  }, [end, duration]);

  return <>{count}</>;
};

export default function AuthorDashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
  const [blogs, setBlogs] = useState([]);

  const loadMyBlogs = async () => {
    try {
      const res = await api.get("/blogs/me/my-blogs");
      setBlogs(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadMyBlogs();
  }, []);

  // ✅ ONLY PUBLISHED POSTS
  const totalPublished = blogs.filter(
    (blog) => blog.status === "Published",
  ).length;

  // ✅ TOTAL VIEWS (you don’t have views → use shares as views OR fallback)
  const totalView = blogs.reduce((sum, blog) => {
    return sum + (blog.views || blog.shares || 0);
  }, 0);

  // ✅ TOTAL COMMENTS
  const comments = blogs.reduce((sum, blog) => {
    return sum + (blog.commentsCount || blog.commentCount || blog.comments?.length || 0);
  }, 0);

  // ✅ TOTAL REACTIONS (likes)
  const articleReaction = blogs.reduce((sum, blog) => {
    return sum + (blog.likes?.length || 0);
  }, 0);

  // ✅ GROWTH CALCULATION (simple version)
  const getGrowth = (current) => {
    if (current === 0) return "0%";
    const prev = Math.max(current - Math.floor(current * 0.1), 1);
    const growth = ((current - prev) / prev) * 100;
    return `+${growth.toFixed(1)}%`;
  };

  const trendingPosts = useMemo(() => {
    return [...blogs]
      .sort((a, b) => {
        const aScore = (a.likes?.length || 0) + (a.shares || 0);
        const bScore = (b.likes?.length || 0) + (b.shares || 0);
        return bScore - aScore;
      })
      .slice(0, 4);
  }, [blogs]);

  const maxLikes = Math.max(...blogs.map((blog) => blog.likes?.length || 0), 1);

  const cards = [
    {
      title: "TOTAL PUBLISHED",
      value: totalPublished,
      percentage: getGrowth(totalPublished),
    },
    {
      title: "TOTAL VIEWS",
      value: totalView,
      percentage: getGrowth(totalView),
    },
    {
      title: "DIRECT COMMENTS",
      value: comments,
      percentage: getGrowth(comments),
    },
    {
      title: "ARTICLE REACTIONS",
      value: articleReaction,
      // percentage: getGrowth(articleReaction),
      icon: <FaHeart />,
    },
  ];

  return (
    <main className="min-h-screen bg-[#eef2f4] py-10 text-slate-900 md:px-10">
      <div className="mx-auto max-w-7xl">
        <div>
          <h1 className="text-4xl font-black tracking-tight">
            Welcome back, {user.name}!
          </h1>
        </div>

      {/* ANALYTICS CARDS */}
      <section className="mt-8 grid gap-6 md:grid-cols-4">
        {cards.map((card) => (
          <div
            key={card.title}
            className="relative rounded-xs bg-white dark:bg-[#01213A] p-6 text-center shadow-[0_12px_30px_rgba(0,0,0,0.1)] border-t border-r border-b border-8 border-[#18d89d] transition-all duration-300"
          >
            {/* <div className="mx-auto flex h-10 w-10 items-center justify-center rounded-full bg-emerald-100 text-xl text-emerald-600">
              {card.icon}
            </div> */}

            <p className="mt-3 text-sm font-bold text-slate-500">
              {card.title}
            </p>

            <h2 className="mt-2 text-slate-900 dark:text-white text-4xl font-black">
              <CountUp end={card.value} />
            </h2>

            <p className="mt-1 text-xs text-right text-[#18d89d]">
              {card.percentage}
            </p>

            <div className="absolute bottom-6 right-5 text-[#18d89d]">
              {card.icon}
            </div>
          </div>
        ))}
      </section>

      <div className="mx-auto mt-10 w-full max-w-[1190px] rounded-sm border-t border-r border-b border-[8px] border-[#18d89d] bg-white dark:bg-[#01213A] px-6 py-4 shadow-sm transition-all duration-300">
        {/* TEXT */}
        <p className="max-w-[984px] text-[14px] font-semibold uppercase tracking-[1.4px] leading-[20px] text-white/50">
          Ready to inspire? Turn your latest ideas into impactful stories and
          share your insights with the global community.
        </p>

        {/* BUTTON */}
        <div className="mt-4 flex justify-end">
          <Link
            to="/author-dashboard/create-post"
            className="flex h-[38px] items-center justify-center rounded-[5px] bg-[#18d89d] px-5 text-[12px] font-semibold uppercase tracking-[1.4px] text-[#062b46] transition hover:bg-[#14c392]"
          >
            Start Writing
          </Link>
        </div>
      </div>

      {/* DRAFTS + PUBLISHED WORK */}
      <section className="mt-12 grid gap-10  lg:grid-cols-[1.45fr_1fr]">
        {/* RECENT DRAFTS */}
        <div className="mt-5">
          <div className="flex items-center justify-between  px-6 py-3">
            <h2 className="text-2xl font-black uppercase tracking-wide text-[#06243d]">
              Recent Drafts
            </h2>

            <Link
              to="/author-dashboard/articles"
              className="text-xs font-black uppercase tracking-[1.4px] text-[#18d89d]"
            >
              View All
            </Link>

          </div>

         <div className="border-b border-[#0b263d] w-full mt-1"></div>


          <div className="flex flex-col gap-2 mt-5">
            {blogs
              .filter((blog) => blog.status === "Draft")
              .slice(0, 2)
              .map((blog) => (
                <div
                  key={blog._id}
                  className="relative grid grid-cols-[130px_1fr]  bg-white"
                >
                  <img
                    src={blog.image || "https://via.placeholder.com/300"}
                    alt={blog.title}
                    className="h-[120px] w-full object-cover"
                  />

                  <div className="flex items-center justify-between px-7">
                    <div>
                      <h3 className="text-[20px] font-black text-[#06243d]">
                        {blog.title}
                      </h3>

                      <p className="mt-2 text-[10px] text-slate-400">
                        Last edited{" "}
                        {blog.updatedAt
                          ? new Date(blog.updatedAt).toLocaleDateString()
                          : "recently"}{" "}
                        • {(blog.content || "").split(" ").length} words
                      </p>
                    </div>

        <Link
  to={`/author-dashboard/create-post/${blog._id}`}
  className="absolute bottom-4 right-5 flex flex-row items-center justify-center gap-2 text-[12px] font-black uppercase tracking-[2px] text-[#06243d]"
>
  Continue <FaArrowRight />
</Link>
                  </div>
                </div>
              ))}

            {blogs.filter((blog) => blog.status === "Draft").length === 0 && (
              <div className="px-6 py-10 text-center text-slate-400">
                No draft articles yet.
              </div>
            )}
          </div>
        </div>

        {/* PUBLISHED WORK */}
        <div className="bg-white px-8 py-8">
          <h2 className="border-b border-slate-400 pb-4 text-2xl font-black uppercase tracking-wide text-[#06243d]">
            Published Work
          </h2>

          <div>
            {blogs
              .filter((blog) => blog.status === "Published")
              .slice(0, 3)
              .map((blog) => (
                <div
                  key={blog._id}
                  className="border-b border-slate-300 py-6 last:border-b-0"
                >
                  <p className="text-[11px] font-black uppercase tracking-[3px] text-[#18d89d]">
                    {blog.category || "Technology"} •{" "}
                    {blog.createdAt
                      ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "2-digit",
                        })
                      : ""}
                  </p>

                  <h3 className="mt-3 text-xl font-black leading-tight text-[#06243d]">
                    {blog.title}
                  </h3>

                  <div className="mt-6 flex items-center justify-between">
                    <div className="flex gap-5 text-sm text-slate-400">
                      <div className="flex gap-1 items-center"> <IoEyeOutline />{blog.views || 0}</div>
                      <div className="flex gap-1 items-center"> <BiComment /> {blog.commentsCount || blog.commentCount || 0}</div>
                    </div>

                    <Link
                      to={`/blogs/${blog._id}`}
                      className="text-sm font-bold text-[#18d89d]"
                    >
                      View Article
                    </Link>
                  </div>
                </div>
              ))}

            {blogs.filter((blog) => blog.status === "Published").length ===
              0 && (
              <div className="py-10 text-center text-slate-400">
                No published articles yet.
              </div>
            )}
          </div>
        </div>
      </section>
      </div>
    </main>
  );
}
