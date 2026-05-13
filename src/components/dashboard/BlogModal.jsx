const BlogModal = ({ editOpen, editForm, setEditForm, closeModal, updateBlog }) => {
  if (!editOpen) return null;

  return (
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
  );
};

export default BlogModal;
