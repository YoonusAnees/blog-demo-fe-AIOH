import { IoEyeOutline } from "react-icons/io5";
import { BiComment } from "react-icons/bi";
import { FiEdit3, FiTrash2 } from "react-icons/fi";

const ArticleCard = ({ blog, openEditModal, deleteBlog }) => {
  const isDraft = blog.status === "Draft";

  return (
    <div className="grid gap-5 rounded-xl bg-white dark:bg-slate-900 p-4 shadow-sm transition hover:shadow-md dark:hover:bg-slate-800/50 md:grid-cols-[1.7fr_0.7fr_0.8fr_0.5fr] md:items-center">
      {/* ARTICLE */}
      <div className="flex items-center gap-4">
        <img
          src={blog.image || "https://via.placeholder.com/120"}
          alt={blog.title}
          className="h-20 w-28 rounded-lg object-cover"
        />

        <div>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <span className="rounded bg-slate-100 dark:bg-slate-800 px-2 py-1 text-[10px] font-bold uppercase text-slate-500 dark:text-slate-400">
              {blog.category}
            </span>

            {isDraft ? (
              <span className="rounded bg-yellow-100 px-2 py-1 text-[10px] font-black uppercase text-yellow-700">
                Draft
              </span>
            ) : (
              <span className="rounded bg-emerald-100 px-2 py-1 text-[10px] font-black uppercase text-emerald-700">
                Published
              </span>
            )}
          </div>

          <h3 className="font-bold leading-snug text-slate-800 dark:text-white transition-colors">
            {blog.title}
          </h3>
        </div>
      </div>

      {/* DATE */}
      <p className="text-sm font-medium text-slate-500">
        {blog.createdAt
          ? new Date(blog.createdAt).toLocaleDateString("en-US", {
              year: "numeric",
              month: "short",
              day: "numeric",
            })
          : "-"}
      </p>

      {/* ENGAGEMENT */}
      <div className="flex items-center gap-5 text-sm font-semibold text-slate-400">
        <div className="flex items-center gap-1">
          <IoEyeOutline />
          {blog.views || 0}
        </div>

        <div className="flex items-center gap-1">
          <BiComment />
          {blog.commentsCount || blog.commentCount || 0}
        </div>

        <div className="flex items-center gap-1">
          ♡ {blog.likes?.length || 0}
        </div>
      </div>

      {/* ACTIONS */}
      <div className="flex items-center justify-end gap-4">
        <button
          type="button"
          onClick={() => openEditModal(blog)}
          className="text-xl text-slate-900 dark:text-white transition hover:text-emerald-500"
        >
          <FiEdit3 />
        </button>

        <button
          type="button"
          onClick={() => deleteBlog(blog._id)}
          className="text-xl text-red-500 transition hover:text-red-700"
        >
          <FiTrash2 />
        </button>
      </div>
    </div>
  );
};

export default ArticleCard;
