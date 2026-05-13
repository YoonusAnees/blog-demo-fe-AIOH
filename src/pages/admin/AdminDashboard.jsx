import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

import {
  FaHeart,
  FaUsers,
  FaRegNewspaper,
  FaFilter,
} from "react-icons/fa";
import { IoShareSocialSharp } from "react-icons/io5";

import StatCard from "../../components/dashboard/StatCard";
import ContributorCard from "../../components/dashboard/ContributorCard";
import BlogTable from "../../components/dashboard/BlogTable";
import BlogModal from "../../components/dashboard/BlogModal";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);

  const [editForm, setEditForm] = useState({
    title: "",
    category: "Technology",
    status: "Published",
    image: "",
    excerpt: "",
    content: "",
    tags: "",
  });

  const loadStats = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setStats(res.data.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  const deleteBlog = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this article?");
    if (!ok) return;

    try {
      await api.delete(`/blogs/${id}`);
      loadStats();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const openEditModal = (blog) => {
    setEditId(blog._id);

    setEditForm({
      title: blog.title || "",
      category: blog.category || "Technology",
      status: blog.status || "Published",
      image: blog.image || "",
      excerpt: blog.excerpt || "",
      content: blog.content || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
    });

    setEditOpen(true);
  };

  const closeModal = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const updateBlog = async (e) => {
    e.preventDefault();

    try {
      await api.put(`/blogs/${editId}`, {
        ...editForm,
        tags: editForm.tags
          .split(",")
          .map((t) => t.trim())
          .filter(Boolean),
      });

      closeModal();
      loadStats();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const topContributors = useMemo(() => {
    const authorMap = {};

    (stats?.allBlogs || []).forEach((blog) => {
      const author = blog.author;
      if (!author) return;

      if (!authorMap[author._id]) {
        authorMap[author._id] = {
          ...author,
          posts: 0,
          likes: 0,
          shares: 0,
          Count: 0,
        };
      }

      authorMap[author._id].posts += 1;
      authorMap[author._id].likes += blog.likes?.length || 0;
      authorMap[author._id].shares += blog.shares || 0;
      authorMap[author._id].Count += blog.commentsCount || blog.commentCount || 0;
    });

    return Object.values(authorMap)
      .sort((a, b) => b.posts - a.posts)
      .slice(0, 3);
  }, [stats]);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  if (!stats) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#18d89d] border-t-transparent"></div>
      </div>
    );
  }

  const cards = [
    {
      title: "TOTAL ARTICLES",
      value: stats.stats.totalBlogs,
      icon: <FaRegNewspaper />,
    },
    {
      title: "TOTAL AUTHORS",
      value: stats.stats.totalAuthors,
      icon: <FaUsers />,
    },
    {
      title: "TOTAL REACTIONS",
      value: stats.stats.totalLikes,
      icon: <FaHeart />,
    },
    {
      title: "TOTAL SHARES",
      value: stats.stats.totalShares,
      icon: <IoShareSocialSharp />,
    },
  ];

  return (
    <main className="min-h-screen px-5 py-10 text-[#222831] md:px-10 mt-10">
      <div className="mx-auto max-w-7xl">
        {/* ANALYTICS CARDS */}
        <section className="grid gap-6 md:grid-cols-4">
          {cards.map((card) => (
            <StatCard key={card.title} {...card} />
          ))}
        </section>

        {/* TOP CONTRIBUTORS */}
        <section className="mt-14">
          <h2 className="text-3xl font-black text-[#20252b]">Top Contributors</h2>

          <p className="mt-3 text-base font-medium text-slate-500">
            Recognizing the individuals driving discourse and editorial
            excellence across the platform.
          </p>

          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {topContributors.map((person, index) => (
              <ContributorCard key={person._id} person={person} index={index} baseUrl={baseUrl} />
            ))}
          </div>
        </section>

        {/* RECENT BLOGS MANAGEMENT */}
        <section className="mt-20 overflow-hidden rounded-[26px] border border-slate-200 bg-white shadow-sm">
          <div className="flex flex-col gap-4 border-b border-slate-300 px-8 py-7 md:flex-row md:items-center md:justify-between">
            <h2 className="text-2xl font-black text-[#20252b]">
              Recent Blogs & Management
            </h2>

            <div className="flex items-center gap-4">
              <button className="flex items-center gap-2 bg-[#e4e4e4] px-7 py-3 text-sm font-black text-[#20252b] transition hover:bg-slate-300">
                <FaFilter className="text-xs" />
                Filter
              </button>

              <Link
                to="/author-dashboard/create"
                className="bg-[#00e787] px-8 py-3 text-sm font-black text-black transition hover:bg-[#18d89d]"
              >
                New Article
              </Link>
            </div>
          </div>

          <BlogTable 
            blogs={stats.allBlogs?.slice(0, 8)} 
            baseUrl={baseUrl} 
            openEditModal={openEditModal} 
            deleteBlog={deleteBlog} 
          />
        </section>
      </div>

      <BlogModal 
        editOpen={editOpen} 
        editForm={editForm} 
        setEditForm={setEditForm} 
        closeModal={closeModal} 
        updateBlog={updateBlog} 
      />
    </main>
  );
}

