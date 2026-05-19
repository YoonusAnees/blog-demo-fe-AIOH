import { useEffect, useMemo, useState } from "react";
import { Link, useParams } from "react-router-dom";
import api from "../api/axios";
import { IoEyeOutline, IoShareSocialOutline } from "react-icons/io5";
import { BiComment } from "react-icons/bi";
import { FiHeart, FiFacebook, FiTwitter, FiLinkedin } from "react-icons/fi";

export default function BlogDetails() {
  const { id } = useParams();

  const [blog, setBlog] = useState(null);
  const [moreBlogs, setMoreBlogs] = useState([]);
  const [comments, setComments] = useState([]);
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [replyingTo, setReplyingTo] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const user = JSON.parse(localStorage.getItem("user"));

  const loadBlog = async () => {
    try {
      const res = await api.get(`/blogs/${id}`);
      setBlog(res.data.data);
    } catch (error) {
      console.log(error);
    }
  };

  const loadMoreBlogs = async () => {
    try {
      const res = await api.get("/blogs");
      setMoreBlogs(res.data.data || []);
    } catch (error) {
      console.log(error);
    }
  };

const loadComments = async () => {
  try {
    if (!id) return;

    const res = await api.get(
      `/blogs/${id}/comments`
    );

    setComments(
      Array.isArray(res.data.data)
        ? res.data.data
        : []
    );
  } catch (error) {
    console.log(
      "Load comments error:",
      error
    );

    setComments([]);
  }
};

  const likeBlog = async () => {
    if (!user) {
      alert("Please login to like this blog.");
      return;
    }

    try {
      const res = await api.post(`/blogs/${id}/like`);
      setBlog(res.data.data);
    } catch (error) {
      alert(error.response?.data?.message || "Like failed");
    }
  };

  const shareBlog = async () => {
    try {
      await api.post(`/blogs/${id}/share`);

      if (navigator.share) {
        await navigator.share({
          title: blog.title,
          text: blog.excerpt || blog.title,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        alert("Blog link copied");
      }

      loadBlog();
    } catch (error) {
      console.log(error);
    }
  };

 const addMainComment = async () => {
  if (!user) {
    alert("Please login to comment.");
    return;
  }

  if (!text.trim()) return;

  try {
    const res = await api.post(
      `/blogs/${id}/comments`,
      {
        text,
        parentComment: null,
      }
    );

    // INSTANT UPDATE
    setComments((prev) => [
      res.data.data,
      ...prev,
    ]);

    setText("");
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Comment failed"
    );
  }
};

const addReply = async (
  parentCommentId
) => {
  if (!user) {
    alert("Please login to reply.");
    return;
  }

  if (!replyText.trim()) return;

  try {
    const res = await api.post(
      `/blogs/${id}/comments`,
      {
        text: replyText,
        parentComment: parentCommentId,
      }
    );

    // INSTANT UPDATE
    setComments((prev) => [
      res.data.data,
      ...prev,
    ]);

    setReplyText("");
    setReplyingTo(null);
  } catch (error) {
    console.log(error);

    alert(
      error.response?.data?.message ||
        "Reply failed"
    );
  }
};
  const incrementView = async () => {
    try {
      const res = await api.post(`/blogs/${id}/view`);
      if (res.data.data) {
        setBlog(res.data.data);
      }
    } catch (error) {
      console.log("View count error:", error);
    }
  };

useEffect(() => {
  if (!id) return;

  const setup = async () => {
    await incrementView();
    loadBlog();
    loadComments();
    loadMoreBlogs();
  };

  setup();
}, [id]);

  const mainComments = comments.filter((comment) => !comment.parentComment);

  const getReplies = (commentId) => {
    return comments.filter((comment) => {
      const parentId =
        typeof comment.parentComment === "object"
          ? comment.parentComment?._id
          : comment.parentComment;

      return parentId === commentId;
    });
  };

  const relatedBlogs = useMemo(() => {
    if (!blog) return [];

    return moreBlogs
      .filter((item) => item._id !== blog._id)
      .filter((item) => item.status === "Published")
      .slice(0, 3);
  }, [moreBlogs, blog]);

  const sidebarBlogs = useMemo(() => {
    if (!blog) return [];

    return moreBlogs
      .filter((item) => item._id !== blog._id)
      .filter((item) => item.status === "Published")
      .slice(0, 4);
  }, [moreBlogs, blog]);

  const renderContent = () => {
    if (!blog?.content) return null;

    try {
      const parsed = JSON.parse(blog.content);

      if (parsed.blocks) {
        return parsed.blocks.map((block, index) => {
          if (block.type === "header") {
            const Tag = `h${block.data.level || 2}`;
            return (
              <Tag
                key={index}
                className="mt-8 border-l-4 border-[#0edb93] pl-4 text-xl font-black text-slate-900 dark:text-white md:text-2xl"
              >
                {block.data.text}
              </Tag>
            );
          }

          if (block.type === "paragraph") {
            return (
              <p
                key={index}
                className="mt-5 text-[15px] leading-8 text-slate-600 dark:text-slate-300"
                dangerouslySetInnerHTML={{ __html: block.data.text }}
              />
            );
          }

          if (block.type === "list") {
            return (
              <ul
                key={index}
                className="mt-5 list-disc space-y-2 pl-6 text-[15px] leading-7 text-slate-600 dark:text-slate-300"
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
                className="mt-6 border-l-4 border-[#0edb93] bg-emerald-50 dark:bg-emerald-950/20 p-5 text-sm font-semibold italic text-slate-700 dark:text-slate-200"
              >
                {block.data.text}
              </blockquote>
            );
          }

          if (block.type === "code") {
            return (
              <pre
                key={index}
                className="mt-6 overflow-auto rounded-xl bg-slate-950 p-5 text-sm text-slate-100"
              >
                <code>{block.data.code}</code>
              </pre>
            );
          }

          if (block.type === "image") {
            return (
              <img
                key={index}
                src={block.data.file?.url}
                alt={block.data.caption || "Blog image"}
                className="mt-6 w-full rounded-2xl object-cover"
              />
            );
          }

          return null;
        });
      }
    } catch {
      return (
        <p className="mt-5 whitespace-pre-line text-[15px] leading-8 text-slate-600">
          {blog.content}
        </p>
      );
    }

    return null;
  };

  if (!blog) {
    return (
      <main className="min-h-screen bg-white p-10 text-center font-bold text-slate-500">
        Loading...
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-white dark:bg-[#020c15] px-5 py-10 text-slate-900 dark:text-white transition-colors duration-300">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 lg:grid-cols-[1fr_280px]">
          {/* LEFT ARTICLE */}
          <article>
            <h1 className="border-l-4 border-slate-800 dark:border-[#18d89d] pl-3 text-3xl font-black leading-tight md:text-5xl transition-colors">
              {blog.title}
            </h1>

            <div className="mt-5 flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-500">
              <div className="flex items-center gap-2">
              <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                {blog.author?.avatar ? (
                  <img
                    src={blog.author.avatar.startsWith("http") ? blog.author.avatar : `${baseUrl}${blog.author.avatar}`}
                    alt={blog.author?.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-[10px] font-black text-white">
                    {blog.author?.name?.charAt(0).toUpperCase() || "A"}
                  </div>
                )}
              </div>
                <span>{blog.author?.name || "Admin"}</span>
              </div>

              <span>{blog.category}</span>

              <span>
                {blog.createdAt
                  ? new Date(blog.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })
                  : ""}
              </span>
            </div>

            {blog.image && (
              <img
                src={blog.image}
                alt={blog.title}
                className="mt-8 h-[260px] w-full rounded-xl object-cover md:h-[420px]"
              />
            )}

            <p className="mt-8 text-[15px] leading-8 text-slate-600 dark:text-slate-300 transition-colors">
              {blog.excerpt}
            </p>

            <div className="prose-blog">{renderContent()}</div>

            {/* TAGS */}
            {blog.tags?.length > 0 && (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-slate-200 pt-5">
                {blog.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-black text-emerald-700"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}

            {/* STATS */}
            <div className="mt-6 flex flex-wrap items-center justify-between border-y border-slate-200 py-4">
              <div className="flex items-center gap-5 text-sm font-semibold text-slate-500">
                <span className="flex items-center gap-1">
                  <IoEyeOutline /> {blog.views || 0} Views
                </span>

                <span className="flex items-center gap-1">
                  <BiComment /> {comments.length} Comments
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={likeBlog}
                  className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-black text-slate-700 dark:text-white hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  <FiHeart /> {blog.likes?.length || 0}
                </button>

                <button
                  onClick={shareBlog}
                  className="flex items-center gap-2 rounded-full bg-slate-100 dark:bg-slate-800 px-4 py-2 text-sm font-black text-slate-700 dark:text-white hover:bg-emerald-100 hover:text-emerald-700 transition-colors"
                >
                  <IoShareSocialOutline /> {blog.shares || 0}
                </button>
              </div>
            </div>

            {/* COMMENTS */}
            <section className="mt-10">
              <div className="mb-5 flex items-center gap-3">
                <h2 className="text-xl font-black">Comments</h2>
                <span className="rounded bg-[#0edb93] px-2 py-1 text-xs font-black text-white">
                  {comments.length}
                </span>
              </div>

              <div className="flex gap-3">
                <input
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  placeholder="Share your thoughts..."
                  className="flex-1 rounded border border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 px-4 py-3 text-sm outline-none focus:border-[#0edb93] text-slate-900 dark:text-white transition-colors"
                />

                <button
                  onClick={addMainComment}
                  className="bg-[#0edb93] px-6 py-3 text-sm font-black text-white hover:bg-[#10c987]"
                >
                  Post
                </button>
              </div>

              <div className="mt-8 space-y-5">
                {mainComments.length === 0 && (
                  <p className="text-sm text-slate-400">
                    No comments yet. Start the discussion.
                  </p>
                )}

                {mainComments.map((comment) => (
                  <div key={comment._id} className="border-b border-slate-200 dark:border-slate-800 pb-5 transition-colors">
                    <div className="flex items-start gap-3">
                      <div className="h-10 w-10 overflow-hidden rounded-full bg-slate-200">
                        {comment.user?.avatar ? (
                          <img
                            src={comment.user.avatar.startsWith("http") ? comment.user.avatar : `${baseUrl}${comment.user.avatar}`}
                            alt={comment.user?.name}
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-xs font-black text-white">
                            {comment.user?.name?.charAt(0).toUpperCase() || "U"}
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-black">
                            {comment.user?.name}
                          </h4>
                          <span className="text-xs text-slate-400">
                            {new Date(comment.createdAt).toLocaleString()}
                          </span>
                        </div>

                        <p className="mt-2 text-sm leading-7 text-slate-600">
                          {comment.text}
                        </p>

                        <button
                          onClick={() =>
                            setReplyingTo(
                              replyingTo === comment._id ? null : comment._id
                            )
                          }
                          className="mt-2 text-xs font-black text-[#0edb93]"
                        >
                          {replyingTo === comment._id ? "Cancel" : "Reply"}
                        </button>

                        {replyingTo === comment._id && (
                          <div className="mt-3 flex gap-2">
                            <input
                              value={replyText}
                              onChange={(e) => setReplyText(e.target.value)}
                              placeholder="Write a reply..."
                              className="flex-1 rounded border border-slate-300 px-3 py-2 text-sm outline-none focus:border-[#0edb93]"
                            />

                            <button
                              onClick={() => addReply(comment._id)}
                              className="bg-[#0edb93] px-4 py-2 text-xs font-black text-white"
                            >
                              Reply
                            </button>
                          </div>
                        )}

                        {getReplies(comment._id).length > 0 && (
                          <div className="mt-4 space-y-3 border-l-2 border-emerald-100 pl-4">
                            {getReplies(comment._id).map((reply) => (
                              <div key={reply._id} className="flex gap-3">
                                <div className="h-8 w-8 overflow-hidden rounded-full bg-slate-200">
                                  {reply.user?.avatar ? (
                                    <img
                                      src={reply.user.avatar.startsWith("http") ? reply.user.avatar : `${baseUrl}${reply.user.avatar}`}
                                      alt={reply.user?.name}
                                      className="h-full w-full object-cover"
                                    />
                                  ) : (
                                    <div className="flex h-full w-full items-center justify-center bg-emerald-500 text-[10px] font-black text-white">
                                      {reply.user?.name?.charAt(0).toUpperCase() || "U"}
                                    </div>
                                  )}
                                </div>

                                <div>
                                  <h5 className="text-xs font-black">
                                    {reply.user?.name}
                                  </h5>
                                  <p className="mt-1 text-sm leading-6 text-slate-600">
                                    {reply.text}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </article>

          {/* RIGHT SIDEBAR */}
          <aside className="space-y-8">
            <div>
              <h3 className="border-l-4 border-slate-800 pl-3 text-lg font-black">
                Share This Post
              </h3>

              <div className="mt-4 flex gap-3">
                <button
                  onClick={shareBlog}
                  className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-700 hover:bg-[#0edb93] hover:text-white"
                >
                  <FiFacebook />
                </button>

                <button
                  onClick={shareBlog}
                  className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-700 hover:bg-[#0edb93] hover:text-white"
                >
                  <FiTwitter />
                </button>

                <button
                  onClick={shareBlog}
                  className="grid h-9 w-9 place-items-center rounded bg-slate-100 text-slate-700 hover:bg-[#0edb93] hover:text-white"
                >
                  <FiLinkedin />
                </button>
              </div>
            </div>

            <div>
              <h3 className="border-l-4 border-slate-800 pl-3 text-lg font-black">
                Recent Articles
              </h3>

              <div className="mt-5 grid grid-cols-2 gap-4">
                {sidebarBlogs.map((item) => (
                  <Link
                    to={`/blogs/${item._id}`}
                    key={item._id}
                    className="group"
                  >
                    <img
                      src={item.image || "https://via.placeholder.com/200"}
                      alt={item.title}
                      className="h-24 w-full rounded-lg object-cover"
                    />

                    <p className="mt-2 line-clamp-2 text-xs font-bold leading-5 text-slate-700 group-hover:text-[#0edb93]">
                      {item.title}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>

        {/* AUTHOR INSIGHTS */}
        {/* <section className="mt-16">
          <h2 className="border-l-4 border-slate-800 pl-3 text-2xl font-black">
            Author Insights
          </h2>

          <p className="mt-5 max-w-4xl text-sm leading-7 text-slate-500">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim
            ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>
        </section> */}

        {/* MORE BY AUTHOR */}
        <section className="mt-16 bg-slate-100 dark:bg-[#011627] px-6 py-10 transition-colors">
          <h2 className="border-l-4 border-slate-800 pl-3 text-2xl font-black">
            Explore More by the Author
          </h2>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {relatedBlogs.map((item) => (
              <Link
                to={`/blogs/${item._id}`}
                key={item._id}
                className="rounded-xl bg-white dark:bg-[#01213A] p-4 shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <img
                  src={item.image || "https://via.placeholder.com/300"}
                  alt={item.title}
                  className="h-40 w-full rounded-lg object-cover"
                />

                <p className="mt-3 text-[11px] font-black uppercase text-slate-400">
                  {item.category}
                </p>

                <h3 className="mt-2 line-clamp-2 text-sm font-black leading-6 text-slate-800">
                  {item.title}
                </h3>

                <div className="mt-4 flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500">
                    {item.author?.name || "Admin"}
                  </span>

                  <span className="rounded-full bg-[#0edb93] px-4 py-2 text-xs font-black text-white">
                    Read More
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}