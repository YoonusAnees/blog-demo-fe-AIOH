const ArticleFilter = ({ 
  categoryFilter, 
  setCategoryFilter, 
  statusFilter, 
  setStatusFilter, 
  sortBy, 
  setSortBy, 
  categories 
}) => {
  return (
    <div className="mb-8 flex flex-col gap-4 rounded-xl bg-[#e9ecef] px-6 py-4 lg:flex-row lg:items-center lg:justify-between">
      <div className="flex flex-wrap items-center gap-4">
        <p className="text-[11px] font-black uppercase tracking-widest text-slate-500">
          Filter By:
        </p>

        <div className="relative">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="min-w-[150px] appearance-none rounded-lg bg-[#e9ecef] px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-[#18d89d]"
          >
            <option value="">Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">▼</span>
        </div>

        <div className="relative">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="min-w-[150px] appearance-none rounded-lg bg-[#e9ecef] px-4 py-2.5 pr-10 text-sm font-semibold text-slate-700 shadow-sm outline-none transition focus:border-[#18d89d]"
          >
            <option value="">Status</option>
            <option value="Published">Published</option>
            <option value="Draft">Draft</option>
          </select>
          <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400">▼</span>
        </div>
      </div>

      <div className="flex items-center gap-2 text-sm">
        <span className="font-medium text-slate-500">Sort:</span>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="bg-transparent text-sm font-black text-slate-700 underline outline-none"
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
          <option value="views">Most Views</option>
        </select>
      </div>
    </div>
  );
};

export default ArticleFilter;
