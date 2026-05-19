import { FaRegEye, FaRegHeart, FaRegEdit, FaRegTrashAlt } from "react-icons/fa";
import { BiComment } from "react-icons/bi";

const BlogTable = ({ blogs, baseUrl, openEditModal, deleteBlog }) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[850px] text-left">
        <thead className="bg-[#dedede] dark:bg-[#01213A] text-[12px] font-black uppercase tracking-widest text-slate-600 dark:text-slate-300 transition-colors">
          <tr>
            <th className="px-10 py-5">Article Title</th>
            <th className="px-6 py-5">Author</th>
            <th className="px-6 py-5">Status</th>
            <th className="px-6 py-5">Date</th>
            <th className="px-6 py-5">Engagement</th>
            <th className="px-6 py-5 text-center">Action</th>
          </tr>
        </thead>

        <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
          {blogs?.map((blog) => (
            <tr key={blog._id} className="transition hover:bg-slate-50 dark:hover:bg-slate-800/30 border-b border-slate-200 dark:border-slate-800">
              <td className="px-10 py-5">
                <p className="max-w-[420px] truncate text-sm font-black text-[#20252b] dark:text-white transition-colors">
                  {blog.title}
                </p>
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center gap-3">
                  <div className="h-8 w-8 overflow-hidden rounded-full border border-slate-200 shadow-sm">
                    {blog.author?.avatar ? (
                      <img
                        src={blog.author.avatar.startsWith("http") ? blog.author.avatar : `${baseUrl}${blog.author.avatar}`}
                        alt={blog.author.name}
                        className="h-full w-full object-cover"
                      />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-emerald-100 text-[10px] font-black text-emerald-700 uppercase">
                        {blog.author?.name?.charAt(0) || "?"}
                      </div>
                    )}
                  </div>
                  <span className="text-sm font-semibold text-slate-500">
                    {blog.author?.name || "Unknown"}
                  </span>
                </div>
              </td>

              <td className="px-6 py-5">
                <span
                  className={`inline-flex px-3 py-1 text-[11px] font-black ${
                    blog.status === "Published"
                      ? "bg-emerald-100 text-emerald-700"
                      : "bg-blue-50 text-[#01213A]"
                  }`}
                >
                  {blog.status}
                </span>
              </td>

              <td className="px-6 py-5 text-sm font-semibold text-slate-500">
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-GB")
                  : "—"}
              </td>

              <td className="px-6 py-5">
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
              </td>

              <td className="px-6 py-5">
                <div className="flex items-center justify-center gap-5">
                  <button
                    onClick={() => openEditModal(blog)}
                    className="text-xl text-black dark:text-white transition hover:text-[#18d89d]"
                  >
                    <FaRegEdit />
                  </button>

                  <button
                    onClick={() => deleteBlog(blog._id)}
                    className="text-xl text-red-500 transition hover:text-red-700"
                  >
                    <FaRegTrashAlt />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BlogTable;
