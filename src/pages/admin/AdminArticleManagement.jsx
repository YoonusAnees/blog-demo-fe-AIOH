import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import api from "../../api/axios";

import {
  FaPlus,
  FaRegEye,
  FaRegHeart,
  FaChevronLeft,
  FaChevronRight,
} from "react-icons/fa";
import { BiComment } from "react-icons/bi";
import { MdEdit, MdDelete } from "react-icons/md";

export default function AdminArticleManagement() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [category, setCategory] = useState("All");
  const [author, setAuthor] = useState("All");
  const [status, setStatus] = useState("All");
  const [sort, setSort] = useState("Newest First");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [editOpen, setEditOpen] = useState(false);
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({
    title: "",
    category: "Technology",
    status: "Published",
    excerpt: "",
  });

  const [viewOpen, setViewOpen] = useState(false);
  const [viewBlog, setViewBlog] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const loadBlogs = async () => {
    try {
      const res = await api.get("/admin/dashboard");
      setBlogs(res.data.data.allBlogs || []);
    } catch (error) {
      console.log("Load blogs error:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const openEditModal = (blog) => {
    setEditId(blog._id);
    setEditForm({
      title: blog.title || "",
      category: blog.category || "Technology",
      status: blog.status || "Published",
      excerpt: blog.excerpt || "",
    });
    setEditOpen(true);
  };

  const closeModal = () => {
    setEditOpen(false);
    setEditId(null);
  };

  const openViewModal = (blog) => {
    setViewBlog(blog);
    setViewOpen(true);
  };

  const closeViewModal = () => {
    setViewOpen(false);
    setViewBlog(null);
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/blogs/${editId}`, editForm);
      closeModal();
      loadBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Update failed");
    }
  };

  const deleteBlog = async (id) => {
    const ok = window.confirm("Are you sure you want to delete this article?");
    if (!ok) return;

    try {
      await api.delete(`/blogs/${id}`);
      loadBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Delete failed");
    }
  };

  const getImageUrl = (image) => {
    if (!image) return "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=500";
    if (image.startsWith("http")) return image;
    return `${baseUrl}${image}`;
  };

  const getAvatarUrl = (author) => {
    if (!author?.avatar) {
      return `https://ui-avatars.com/api/?name=${encodeURIComponent(
        author?.name || "Author"
      )}&background=01213A&color=fff`;
    }
    if (author.avatar.startsWith("http")) return author.avatar;
    return `${baseUrl}${author.avatar}`;
  };

  const renderContent = (content) => {
    if (!content) return null;
    try {
      const parsed = JSON.parse(content);
      if (parsed.blocks) {
        return parsed.blocks.map((block, index) => {
          if (block.type === "header") {
            const Tag = `h${block.data.level || 2}`;
            return (
              <Tag
                key={index}
                className="mt-8 border-l-4 border-[#18d89d] pl-4 text-xl font-black text-slate-900 md:text-2xl"
              >
                {block.data.text}
              </Tag>
            );
          }
          if (block.type === "paragraph") {
            return (
              <p
                key={index}
                className="mt-5 text-sm leading-7 text-slate-600"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }
          if (block.type === "list") {
            return (
              <ul
                key={index}
                className="mt-5 list-disc space-y-2 pl-6 text-sm text-slate-600"
              >
                {block.data.items.map((item, i) => (
                  <li key={i} dangerouslySetInnerHTML={{ __html: item }} />
                ))}
              </ul>
            );
          }
          if (block.type === "quote") {
            return (
              <blockquote
                key={index}
                className="mt-6 border-l-4 border-[#18d89d] bg-emerald-50 p-5 text-sm font-semibold italic text-slate-700"
              >
                {block.data.text}
              </blockquote>
            );
          }
          if (block.type === "image") {
            return (
              <img
                key={index}
                src={block.data.file?.url}
                alt={block.data.caption || "Blog image"}
                className="mt-6 w-full rounded-xl object-cover shadow-sm"
              />
            );
          }
          return null;
        });
      }
    } catch {
      return (
        <p className="mt-5 whitespace-pre-line text-sm leading-7 text-slate-600">
          {content}
        </p>
      );
    }
    return null;
  };

  const authors = useMemo(() => {
    const names = blogs.map((b) => b.author?.name).filter(Boolean);
    return ["All", ...new Set(names)];
  }, [blogs]);

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

  const filteredBlogs = useMemo(() => {
    let data = [...blogs];

    if (category !== "All") {
      data = data.filter((b) => b.category === category);
    }

    if (author !== "All") {
      data = data.filter((b) => b.author?.name === author);
    }

    if (status !== "All") {
      data = data.filter((b) => b.status === status);
    }

    if (sort === "Newest First") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    return data;
  }, [blogs, category, author, status, sort]);

  // PAGINATION LOGIC
  const totalPages = Math.ceil(filteredBlogs.length / itemsPerPage);
  const currentBlogs = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredBlogs.slice(start, start + itemsPerPage);
  }, [filteredBlogs, currentPage]);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      window.scrollTo(0, 0);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-[#18d89d] border-t-transparent"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen  px-6 py-12 text-[#20252b] md:px-12 mt-10">
      <div className="mx-auto max-w-7xl">
        {/* HEADER */}
        <div className="flex flex-col gap-6 md:flex-row md:items-start md:justify-between">
          <div>
            <h1 className="text-2xl font-black">Article Management</h1>
            <p className="mt-2 max-w-xl text-base font-medium leading-relaxed text-slate-500">
              Oversee editorial content, track engagement metrics, and manage
              publication schedules across all categories.
            </p>
          </div>

          <Link
            to="/author-dashboard/create"
            className="flex items-center justify-center gap-3 bg-[#20d39b] px-14 py-4 text-sm font-black uppercase text-black transition hover:bg-[#18d89d]"
          >
            <FaPlus />
            Add New Post  
          </Link>
        </div>

        {/* FILTER BAR */}
        <div className="relative mt-14 bg-[#dfe4ea] px-5 py-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex flex-wrap items-center gap-8">
              <p className="text-xs font-black uppercase text-slate-600">
                Filter By:
              </p>

              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-semibold text-slate-600 outline-none"
              >
                {categories.map((cat) => (
                  <option key={cat}>{cat}</option>
                ))}
              </select>

              <select
                value={author}
                onChange={(e) => {
                  setAuthor(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-semibold text-slate-600 outline-none"
              >
                {authors.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>

              <select
                value={status}
                onChange={(e) => {
                  setStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent text-sm font-semibold text-slate-600 outline-none"
              >
                <option>All</option>
                <option>Published</option>
                <option>Draft</option>
              </select>
            </div>

            <div className="text-sm font-semibold text-slate-600">
              Sort:{" "}
              <select
                value={sort}
                onChange={(e) => {
                  setSort(e.target.value);
                  setCurrentPage(1);
                }}
                className="bg-transparent font-black underline outline-none"
              >
                <option>Newest First</option>
                <option>Oldest First</option>
              </select>
            </div>
          </div>

         
        </div>

        {/* TABLE HEADER */}
        <div className="mt-12 grid grid-cols-[1.7fr_1fr_1fr_1.2fr_0.7fr] border-b border-slate-300 px-5 pb-4 text-xs font-black uppercase text-slate-500 max-lg:hidden">
          <div>Article</div>
          <div>Author</div>
          <div>Published</div>
          <div>Engagement</div>
          <div className="text-center">Actions</div>
        </div>

        {/* ARTICLE ROWS */}
        <div className="mt-5 space-y-5">
          {currentBlogs.map((blog) => (
            <div
              key={blog._id}
              className="grid items-center gap-6 rounded-xl bg-white px-4 py-4 shadow-sm transition hover:shadow-md lg:grid-cols-[1.7fr_1fr_1fr_1.2fr_0.7fr]"
            >
              {/* ARTICLE */}
              <div className="flex items-center gap-5">
                <img
                  src={getImageUrl(blog.image)}
                  alt={blog.title}
                  className="h-20 w-28 rounded-lg object-cover"
                />

                <div>
                  <span className="inline-flex bg-slate-100 px-2 py-1 text-[10px] font-black uppercase text-slate-500">
                    {blog.category || "UI/UX"}
                  </span>

                  <h2 className="mt-3 max-w-[280px] text-base font-black leading-tight text-[#20252b]">
                    {blog.title}
                  </h2>
                </div>
              </div>

              {/* AUTHOR */}
              <div className="flex items-center gap-3">
                <img
                  src={getAvatarUrl(blog.author)}
                  alt={blog.author?.name}
                  className="h-7 w-7 rounded object-cover"
                />

                <p className="text-sm font-semibold text-slate-600">
                  {blog.author?.name || "Unknown"}
                </p>
              </div>

              {/* DATE */}
              <div className="text-sm font-semibold text-slate-600">
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "2-digit",
                      year: "numeric",
                    })
                  : "—"}
              </div>

              {/* ENGAGEMENT */}
              <div className="flex items-center gap-4 text-xs font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <FaRegEye /> {blog.views || 0}
                </span>

                <span className="flex items-center gap-1">
                  <FaRegHeart /> {blog.likes?.length || 0}
                </span>

                <span className="flex items-center gap-1">
                  <BiComment /> {blog.commentsCount || blog.commentCount || 0}
                </span>
              </div>

              {/* ACTIONS */}
              <div className="flex items-center justify-center gap-5">
                <button
                  onClick={() => openViewModal(blog)}
                  className="text-xl text-slate-400 transition hover:text-[#18d89d]"
                  title="Quick View"
                >
                  <FaRegEye />
                </button>

                <button
                  onClick={() => openEditModal(blog)}
                  className="text-xl text-[#07121e] transition hover:text-[#18d89d]"
                  title="Edit Article"
                >
                  <MdEdit />
                </button>

                <button
                  onClick={() => deleteBlog(blog._id)}
                  className="text-xl text-red-500 transition hover:text-red-700"
                  title="Delete Article"
                >
                  <MdDelete />
                </button>
              </div>
            </div>
          ))}
        </div>

        {filteredBlogs.length === 0 && (
          <div className="mt-10 rounded-2xl bg-white p-12 text-center font-bold uppercase tracking-widest text-slate-400">
            No articles found.
          </div>
        )}

        {/* PAGINATION UI */}
        {totalPages > 1 && (
          <div className="mt-28 flex items-center justify-center gap-6 text-sm font-black text-slate-500">
            <button 
              onClick={() => goToPage(currentPage - 1)}
              disabled={currentPage === 1}
              className={`transition hover:text-black ${currentPage === 1 ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <FaChevronLeft />
            </button>

            {[...Array(totalPages)].map((_, i) => (
              <button
                key={i + 1}
                onClick={() => goToPage(i + 1)}
                className={`px-5 py-4 transition ${
                  currentPage === i + 1 
                  ? "bg-[#07121e] text-white" 
                  : "hover:text-black hover:bg-slate-200"
                }`}
              >
                {i + 1}
              </button>
            ))}

            <button 
              onClick={() => goToPage(currentPage + 1)}
              disabled={currentPage === totalPages}
              className={`transition hover:text-black ${currentPage === totalPages ? 'opacity-20 cursor-not-allowed' : ''}`}
            >
              <FaChevronRight />
            </button>
          </div>
        )}
      </div>

      {/* VIEW MODAL */}
      {viewOpen && viewBlog && (
        <div className="fixed inset-0 z-[110] flex items-center justify-center bg-black/90 p-5 backdrop-blur-md">
          <div className="relative max-h-[95vh] w-full max-w-4xl overflow-y-auto rounded-3xl bg-white shadow-2xl">
            <button 
              onClick={closeViewModal}
              className="absolute right-6 top-6 z-10 flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-900 transition hover:bg-red-500 hover:text-white"
            >
              ✕
            </button>

            <div className="p-8 md:p-12">
               <div className="flex items-center gap-2 mb-6">
                 <span className="bg-[#18d89d] text-black px-3 py-1 text-[10px] font-black uppercase tracking-widest">
                   {viewBlog.category}
                 </span>
                 <span className={`px-3 py-1 text-[10px] font-black uppercase tracking-widest ${viewBlog.status === 'Published' ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'}`}>
                   {viewBlog.status}
                 </span>
               </div>

               <h1 className="text-3xl md:text-5xl font-black text-[#01213A] leading-tight">
                 {viewBlog.title}
               </h1>

               <div className="mt-8 flex items-center gap-4 border-b border-slate-100 pb-8">
                  <img 
                    src={getAvatarUrl(viewBlog.author)} 
                    className="h-12 w-12 rounded-full object-cover border-2 border-[#18d89d]"
                  />
                  <div>
                    <p className="font-bold text-slate-800">{viewBlog.author?.name}</p>
                    <p className="text-xs text-slate-400 font-medium">{new Date(viewBlog.createdAt).toLocaleDateString()} • {viewBlog.views || 0} views</p>
                  </div>
               </div>

               {viewBlog.image && (
                 <img 
                   src={getImageUrl(viewBlog.image)} 
                   className="mt-10 w-full rounded-2xl h-[400px] object-cover shadow-lg"
                 />
               )}

               <div className="mt-10 prose-admin max-w-none">
                  <p className="text-lg font-bold text-slate-700 leading-relaxed italic border-l-4 border-[#18d89d] pl-6 mb-10">
                    {viewBlog.excerpt}
                  </p>
                  
                  <div className="content-rendered">
                    {renderContent(viewBlog.content)}
                  </div>
               </div>

               {viewBlog.tags?.length > 0 && (
                 <div className="mt-12 flex flex-wrap gap-2 pt-8 border-t border-slate-100">
                    {viewBlog.tags.map(tag => (
                      <span key={tag} className="text-[11px] font-black uppercase tracking-widest text-[#18d89d] bg-[#01213A] px-4 py-2 rounded-lg">#{tag}</span>
                    ))}
                 </div>
               )}
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL */}
      {editOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 p-5 backdrop-blur-sm">
          <div className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-2xl bg-white p-10 shadow-2xl">
            <h2 className="text-3xl font-black uppercase tracking-tight text-[#06243d]">
              Update Content
            </h2>

            <p className="mt-1 text-sm text-slate-400">
              Refine the article details and visibility.
            </p>

            <form onSubmit={updateBlog} className="mt-8 space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Article Title
                </label>

                <input
                  value={editForm.title}
                  onChange={(e) =>
                    setEditForm({ ...editForm, title: e.target.value })
                  }
                  className="w-full rounded-lg border-2 border-slate-100 p-4 font-bold text-slate-800 outline-none transition focus:border-[#18d89d]"
                />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Category
                  </label>

                  <select
                    value={editForm.category}
                    onChange={(e) =>
                      setEditForm({ ...editForm, category: e.target.value })
                    }
                    className="w-full appearance-none rounded-lg border-2 border-slate-100 p-4 font-bold text-slate-800 outline-none transition focus:border-[#18d89d]"
                  >
                    {[
                      "Technology",
                      "Business",
                      "Education",
                      "Travel",
                      "Health",
                      "Lifestyle",
                      "News",
                      "Other",
                    ].map((cat) => (
                      <option key={cat}>{cat}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                    Visibility Status
                  </label>

                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm({ ...editForm, status: e.target.value })
                    }
                    className="w-full appearance-none rounded-lg border-2 border-slate-100 p-4 font-bold text-slate-800 outline-none transition focus:border-[#18d89d]"
                  >
                    <option>Published</option>
                    <option>Draft</option>
                  </select>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                  Brief Excerpt
                </label>

                <textarea
                  rows="2"
                  value={editForm.excerpt}
                  onChange={(e) =>
                    setEditForm({ ...editForm, excerpt: e.target.value })
                  }
                  className="w-full resize-none rounded-lg border-2 border-slate-100 p-4 font-bold text-slate-800 outline-none transition focus:border-[#18d89d]"
                />
              </div>

              <div className="flex justify-end gap-4 pt-4">
                <button
                  type="button"
                  onClick={closeModal}
                  className="px-8 py-4 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-slate-600"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="rounded-lg bg-[#01213A] px-10 py-4 text-xs font-black uppercase tracking-widest text-[#18d89d] shadow-lg transition hover:bg-[#06243d]"
                >
                  Save Updates
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}