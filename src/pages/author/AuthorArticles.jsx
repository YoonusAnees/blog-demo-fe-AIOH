import { useEffect, useMemo, useState } from "react";
import api from "../../api/axios";
import ArticleCard from "../../components/articles/ArticleCard";
import ArticleFilter from "../../components/articles/ArticleFilter";

export default function AuthorArticles() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sortBy, setSortBy] = useState("newest");
  const [editOpen, setEditOpen] = useState(false);
  const [saving, setSaving] = useState(false);

  const [editForm, setEditForm] = useState({
    _id: "",
    title: "",
    category: "Technology",
    status: "Draft",
    excerpt: "",
    image: "",
    tags: "",
    content: "",
  });

  const categories = ["Technology", "Business", "Education", "Travel", "Health", "Lifestyle", "News", "Other"];

  const loadBlogs = async () => {
    try {
      setLoading(true);
      const res = await api.get("/blogs/me/my-blogs");
      setBlogs(res.data.data || []);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to load articles");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadBlogs();
  }, []);

  const filteredBlogs = useMemo(() => {
    let data = [...blogs];
    if (search.trim()) {
      data = data.filter((blog) => blog.title?.toLowerCase().includes(search.toLowerCase()));
    }
    if (categoryFilter) {
      data = data.filter((blog) => blog.category === categoryFilter);
    }
    if (statusFilter) {
      data = data.filter((blog) => blog.status === statusFilter);
    }
    if (sortBy === "newest") {
      data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortBy === "oldest") {
      data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else if (sortBy === "views") {
      data.sort((a, b) => (b.views || 0) - (a.views || 0));
    }
    return data;
  }, [blogs, search, categoryFilter, statusFilter, sortBy]);

  const openEditModal = (blog) => {
    setEditForm({
      _id: blog._id,
      title: blog.title || "",
      category: blog.category || "Technology",
      status: blog.status || "Draft",
      excerpt: blog.excerpt || "",
      image: blog.image || "",
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : blog.tags || "",
      content: blog.content || "",
    });
    setEditOpen(true);
  };

  const closeEditModal = () => setEditOpen(false);

  const handleEditChange = (e) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };

  const updateBlog = async (e) => {
    e.preventDefault();
    try {
      setSaving(true);
      await api.put(`/blogs/${editForm._id}`, {
        ...editForm,
        tags: editForm.tags.split(",").map((tag) => tag.trim()).filter(Boolean),
      });
      closeEditModal();
      loadBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update article");
    } finally {
      setSaving(false);
    }
  };

  const deleteBlog = async (id) => {
    if (!window.confirm("Delete this article?")) return;
    try {
      await api.delete(`/blogs/${id}`);
      loadBlogs();
    } catch (error) {
      alert(error.response?.data?.message || "Failed to delete article");
    }
  };

  return (
    <main className="min-h-screen bg-[#edf1f3] dark:bg-slate-950 px-6 py-8 text-slate-900 dark:text-white transition-colors duration-300 md:px-8">
      <div className="mb-8 flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
        <h1 className="text-3xl font-black uppercase tracking-tight">BLOGS & ARTICLES</h1>
      </div>

      <ArticleFilter 
        categoryFilter={categoryFilter}
        setCategoryFilter={setCategoryFilter}
        statusFilter={statusFilter}
        setStatusFilter={setStatusFilter}
        sortBy={sortBy}
        setSortBy={setSortBy}
        categories={categories}
      />

      <div className="hidden border-b border-slate-300 dark:border-slate-800 px-4 pb-4 text-xs font-black uppercase text-slate-500 dark:text-slate-400 md:grid md:grid-cols-[1.7fr_0.7fr_0.8fr_0.5fr]">
        <p>Article</p>
        <p>Published</p>
        <p>Engagement</p>
        <p className="text-right">Actions</p>
      </div>

      <div className="mt-5 space-y-4">
        {loading ? (
          <p className="py-12 text-center font-bold text-slate-400">Loading articles...</p>
        ) : filteredBlogs.length > 0 ? (
          filteredBlogs.map((blog) => (
            <ArticleCard key={blog._id} blog={blog} openEditModal={openEditModal} deleteBlog={deleteBlog} />
          ))
        ) : (
          <div className="rounded-2xl bg-white dark:bg-slate-900 p-12 text-center transition-colors">
            <p className="font-bold text-slate-400">No articles found</p>
          </div>
        )}
      </div>

      {editOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
          <form onSubmit={updateBlog} className="max-h-[90vh] w-full max-w-2xl overflow-y-auto rounded-3xl bg-white p-8 shadow-2xl">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="text-2xl font-black uppercase">Edit Article</h2>
              <button type="button" onClick={closeEditModal} className="text-2xl font-black text-slate-400 hover:text-red-500">×</button>
            </div>

            <label className="text-xs font-black uppercase text-slate-500">Title</label>
            <input name="title" value={editForm.title} onChange={handleEditChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" required />

            <div className="mt-5 grid gap-5 md:grid-cols-2">
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Category</label>
                <select name="category" value={editForm.category} onChange={handleEditChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400">
                  {categories.map((cat) => <option key={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-black uppercase text-slate-500">Status</label>
                <select name="status" value={editForm.status} onChange={handleEditChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400">
                  <option>Draft</option>
                  <option>Published</option>
                </select>
              </div>
            </div>

            <label className="mt-5 block text-xs font-black uppercase text-slate-500">Short Description</label>
            <textarea name="excerpt" value={editForm.excerpt} onChange={handleEditChange} rows="4" className="mt-2 w-full resize-none rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />

            <label className="mt-5 block text-xs font-black uppercase text-slate-500">Image URL</label>
            <input name="image" value={editForm.image} onChange={handleEditChange} className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />
            {editForm.image && <img src={editForm.image} alt="Preview" className="mt-4 h-44 w-full rounded-2xl object-cover" />}

            <label className="mt-5 block text-xs font-black uppercase text-slate-500">Tags</label>
            <input name="tags" value={editForm.tags} onChange={handleEditChange} placeholder="react, design, tech" className="mt-2 w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400" />

            <div className="mt-8 flex flex-col gap-3 md:flex-row">
              <button type="submit" disabled={saving} className="flex-1 rounded-xl bg-[#062b46] py-4 text-sm font-black uppercase tracking-widest text-white disabled:opacity-60">{saving ? "Updating..." : "Update Article"}</button>
              <button type="button" onClick={closeEditModal} className="flex-1 rounded-xl border border-slate-200 py-4 text-sm font-black uppercase tracking-widest text-slate-500">Cancel</button>
            </div>
          </form>
        </div>
      )}
    </main>
  );
}
  