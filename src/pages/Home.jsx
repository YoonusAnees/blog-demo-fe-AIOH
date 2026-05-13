import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { IoSearchOutline } from "react-icons/io5";

export default function Home() {
  const [blogs, setBlogs] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [search, setSearch] = useState("");

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const categories = [
    "All",
    "Technology",
    "Business",
    "Education",
    "Travel",
    "Health",
    "Lifestyle",
    "News",
    "Other",
  ];

  const loadBlogs = async () => {
    try {
      // Always fetch all blogs to keep Trending section populated
      const res = await api.get("/blogs");
      setBlogs(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  // Filtered by Search only (for Trending section)
  const searchFilteredBlogs = useMemo(() => {
    if (!search.trim()) return blogs;
    return blogs.filter((blog) => {
      const text = `${blog.title || ""} ${blog.excerpt || ""} ${
        blog.content || ""
      } ${blog.category || ""} ${blog.author?.name || ""}`.toLowerCase();
      return text.includes(search.toLowerCase());
    });
  }, [blogs, search]);

  // Filtered by both Search and Category (for Latest section)
  const categoryFilteredBlogs = useMemo(() => {
    let data = searchFilteredBlogs;
    if (selectedCategory !== "All") {
      data = data.filter((blog) => blog.category === selectedCategory);
    }
    return data;
  }, [searchFilteredBlogs, selectedCategory]);

  const topAuthors = useMemo(() => {
    const map = {};

    blogs.forEach((blog) => {
      if (!blog.author) return;

      const id = blog.author._id || blog.author.email || blog.author.name;

      if (!map[id]) {
        map[id] = {
          _id: id,
          name: blog.author.name || "Author",
          avatar: blog.author.avatar || "",
          professionalTitle: blog.author.professionalTitle || "Author",
          posts: 0,
          likes: 0,
          shares: 0,
          categories: {},
          score: 0,
        };
      }

      map[id].posts += 1;
      map[id].likes += blog.likes?.length || 0;
      map[id].shares += blog.shares || 0;

      const category = blog.category || "Other";
      map[id].categories[category] = (map[id].categories[category] || 0) + 1;

      map[id].score = map[id].likes + map[id].shares + map[id].posts;
    });

    return Object.values(map)
      .map((author) => {
        const topCategory =
          Object.entries(author.categories).sort((a, b) => b[1] - a[1])[0]?.[0] ||
          "General";

        return {
          ...author,
          topCategory,
        };
      })
      .sort((a, b) => b.score - a.score)
      .slice(0, 3);
  }, [blogs]);

  const trendingBlog = searchFilteredBlogs[0];
  const sideTrending = searchFilteredBlogs.slice(1, 5);
  const latestBlogs = categoryFilteredBlogs.slice(0, 6);

  return (
    <main className="bg-white dark:bg-[#020c15] text-[#1d2b36] dark:text-white transition-colors duration-300">
      {/* TRENDING */}
      <section className="mx-auto max-w-6xl px-5 py-10">
        <h2 className="border-l-4 border-[#0b3148] pl-3 text-2xl font-black text-[#66727c]">
          Trending Now
        </h2>

        <div className="mt-6 grid gap-6 lg:grid-cols-[1.6fr_1fr]">
          {trendingBlog && (
            <Link
              to={`/blogs/${trendingBlog._id}`}
              className="group relative min-h-[350px] overflow-hidden rounded-xl bg-slate-900"
            >
              <img
                src={
                  trendingBlog.image ||
                  "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200&auto=format&fit=crop"
                }
                alt={trendingBlog.title}
                className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent" />

              <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
                <span className="rounded-full bg-[#14d8a6] px-3 py-1 text-[10px] font-black uppercase tracking-widest text-[#022338]">
                  {trendingBlog.category || "Insights"}
                </span>

                <h1 className="mt-4 max-w-xl text-4xl font-black uppercase leading-tight">
                  {trendingBlog.title}
                </h1>

                <span className="mt-5 inline-flex rounded-full bg-[#18d6a4] px-5 py-2 text-xs font-black text-[#022338]">
                  Read more →
                </span>
              </div>
            </Link>
          )}

          <div className="space-y-4">
            {sideTrending.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="grid grid-cols-[90px_1fr] gap-4"
              >
                <img
                  src={
                    blog.image ||
                    "https://images.unsplash.com/photo-1497366754035-f200968a6e72?q=80&w=600&auto=format&fit=crop"
                  }
                  alt={blog.title}
                  className="h-20 w-full rounded-md object-cover"
                />

                <div>
                  <p className="text-[10px] font-black uppercase tracking-wider text-[#00b98b]">
                    {blog.category || "Insights"}
                  </p>

                  <h3 className="line-clamp-2 text-sm font-black text-[#1d2b36] dark:text-white transition-colors">
                    {blog.title}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* LATEST */}
      <section className="bg-[#f4f4f6] dark:bg-[#011627] py-10 transition-colors duration-300">
        <div className="mx-auto max-w-6xl px-5">
          <h2 className="border-l-4 border-[#0b3148] pl-3 text-2xl font-black text-[#66727c]">
            Latest Insights & Trends
          </h2>

          <div className="mt-4 flex items-center gap-3">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search articles by name, category, author..."
              className="h-9 flex-1 rounded border border-slate-200 bg-white px-4 text-sm outline-none"
            />

            <button className="flex h-9 w-9 items-center justify-center rounded-md bg-[#06243d] text-white transition hover:bg-[#0b3148]">
              <IoSearchOutline size={18} />
            </button>
          </div>

          <div className="mt-6 flex flex-wrap justify-center gap-3">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`rounded-full px-5 py-2 text-[11px] font-black uppercase transition ${
                  selectedCategory === cat
                    ? "bg-[#06243d] text-white"
                    : "bg-white text-slate-500 hover:bg-slate-200"
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          <div className="mt-10 grid gap-7 md:grid-cols-3">
            {latestBlogs.map((blog) => (
              <Link
                key={blog._id}
                to={`/blogs/${blog._id}`}
                className="group overflow-hidden rounded-md bg-white dark:bg-[#01213A] shadow-md transition hover:-translate-y-1"
              >
                <img
                  src={
                    blog.image ||
                    "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?q=80&w=900&auto=format&fit=crop"
                  }
                  alt={blog.title}
                  className="h-44 w-full object-cover transition duration-500 group-hover:scale-105"
                />

                <div className="p-5">
                  <div className="mb-3 flex items-center justify-between">
                    <span className="text-[10px] font-black text-[#0b7ca8]">
                      {blog.category || "Information Technology"}
                    </span>

                    <span className="text-[10px] text-slate-400">
                      {blog.createdAt
                        ? new Date(blog.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>

                  <h3 className="line-clamp-2 text-base font-black leading-tight text-[#1d2b36] dark:text-white">
                    {blog.title}
                  </h3>

                  <p className="mt-3 line-clamp-2 text-xs leading-6 text-slate-500">
                    {blog.excerpt || blog.content}
                  </p>

                  <div className="mt-5 flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className="h-7 w-7 overflow-hidden rounded-full bg-slate-200">
                        {blog.author?.avatar ? (
                          <img
                            src={`${baseUrl}${blog.author.avatar}`}
                            alt={blog.author?.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-[9px] font-black text-white">
                            {blog.author?.name?.charAt(0).toUpperCase() || "A"}
                          </div>
                        )}
                      </div>

                      <span className="text-xs font-bold">
                        {blog.author?.name || "Author"}
                      </span>
                    </div>

                    <span className="rounded-full bg-[#18d6a4] px-4 py-2 text-[10px] font-black text-[#022338]">
                      Read more →
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {categoryFilteredBlogs.length > 6 && (
            <div className="mt-12 flex justify-center">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-full bg-[#18d6a4] px-10 py-4 text-xs font-black uppercase tracking-widest text-[#022338] transition hover:bg-[#14c392] hover:shadow-lg"
              >
                View All Posts
              </Link>
            </div>
          )}
        </div>
      </section>

      {/* BRAND BANNER */}
      <section className="bg-[#06243d]">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 py-14 md:grid-cols-2">
          <div>
            <h2 className="text-5xl font-black text-white">
              allin<span className="text-[#18d6a4]">one</span>
            </h2>
            <p className="mt-4 text-2xl font-bold text-white">
              Lead your brand into the next chapter
            </p>
            <p className="mt-2 text-white/60">www.allinoneinsights.com</p>
          </div>

          <div className="h-40 rounded-full bg-[#18d6a4]/20 blur-3xl" />
        </div>
      </section>

      {/* TOP AUTHORS */}
      <section className="mx-auto max-w-6xl px-5 py-12">
        <h2 className="border-l-4 border-[#0b3148] pl-3 text-2xl font-black text-[#66727c]">
          Top Authors Of The Month
        </h2>

        <div className="mt-10 grid gap-8 md:grid-cols-3">
          {topAuthors.map((author, index) => (
            <div
              key={author._id}
              className="group relative overflow-hidden rounded-[30px] bg-[#06243d] dark:bg-[#01213A] transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl"
            >
              {/* RANK BADGE */}
              <div className="absolute left-6 top-6 z-20 flex h-[68px] w-[68px] items-center justify-center rounded-[18px] bg-[#18d89d] text-2xl font-black text-[#06243d]">
                {String(index + 1).padStart(2, "0")}
              </div>

              {/* IMAGE CONTAINER */}
              <div className="h-[340px] w-full overflow-hidden bg-slate-200">
                {author.avatar ? (
                  <img
                    src={`${baseUrl}${author.avatar}`}
                    alt={author.name}
                    className="h-full w-full object-cover transition duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-gradient-to-br from-slate-400 to-slate-600 text-7xl font-black text-white">
                    {author.name?.charAt(0).toUpperCase()}
                  </div>
                )}
              </div>

              {/* CONTENT */}
              <div className="bg-[#06243d] dark:bg-[#01213A] py-6 text-center text-white transition-colors">
                <h3 className="text-xl font-black">{author.name}</h3>
                <p className="mt-1 text-xs font-medium text-white/50">
                  {author.professionalTitle || "CEO & Founder"}
                </p>
              </div>
            </div>
          ))}
        </div>

        {topAuthors.length === 0 && (
          <p className="mt-10 text-center text-slate-400">No authors yet</p>
        )}
      </section>

      {/* SUBSCRIBE */}
      <section className="bg-[#eef2f3] dark:bg-slate-900 py-14">
        <div className="mx-auto grid max-w-6xl items-center gap-8 px-5 md:grid-cols-2">
          <div>
            <h2 className="text-4xl font-black text-white md:text-[#1d2b36]">
              allin<span className="text-[#18d6a4]">one</span>
            </h2>

            <h3 className="mt-5 text-3xl font-black text-[#1d2b36]">
              Stay Ahead with <br /> All-in-One Insights.
            </h3>

            <p className="mt-4 max-w-md text-sm leading-7 text-slate-500">
              Get expert-level strategy and UX/UI insights delivered straight to
              your inbox.
            </p>
          </div>

          <form className="flex gap-3">
            <input
              type="email"
              placeholder="Work Email Address"
              className="h-12 flex-1 border-b border-slate-400 bg-transparent outline-none"
            />

            <button className="bg-[#06243d] px-6 text-xs font-black uppercase tracking-widest text-white">
              Subscribe Now
            </button>
          </form>
        </div>
      </section>

      {searchFilteredBlogs.length === 0 && (
        <div className="py-20 text-center">
          <h3 className="text-3xl font-black text-[#1d2b36]">
            No results found for "{search}"
          </h3>
        </div>
      )}
    </main>
  );
}