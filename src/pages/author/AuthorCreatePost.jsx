import { useEffect, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../../api/axios";

import EditorJS from "@editorjs/editorjs";
import Header from "@editorjs/header";
import List from "@editorjs/list";
import Quote from "@editorjs/quote";
import CodeTool from "@editorjs/code";
import LinkTool from "@editorjs/link";
import Delimiter from "@editorjs/delimiter";
import Embed from "@editorjs/embed";
import ImageTool from "@editorjs/image";
import Marker from "@editorjs/marker";
import InlineCode from "@editorjs/inline-code";
import { LuUpload, LuSave, LuSend, LuImagePlus } from "react-icons/lu";
import { FaArrowLeft } from "react-icons/fa6";
import { IoCloudUploadOutline } from "react-icons/io5";

export default function AuthorCreatePost() {
  const navigate = useNavigate();
  const { id } = useParams();

  const editorRef = useRef(null);
  const editorInstance = useRef(null);

  const user = JSON.parse(localStorage.getItem("user"));
  const [loading, setLoading] = useState(false);

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const [form, setForm] = useState({
    title: "",
    category: "Technology",
    tags: "",
    excerpt: "",
    image: "",
    content: "",
    status: "Draft",
  });

  const categories = [
    "Technology",
    "Business",
    "Education",
    "Travel",
    "Health",
    "Lifestyle",
    "News",
    "Other",
  ];

  const loadDraft = async () => {
    try {
      if (!id) return;

      const res = await api.get(`/blogs/${id}`);

      // ✅ supports both response formats:
      // { data: blog } OR { data: { data: blog } }
      const blog = res.data?.data || res.data;

      if (!blog) {
        alert("Draft not found");
        return;
      }

      setForm({
        title: blog.title || "",
        category: blog.category || "Technology",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
        excerpt: blog.excerpt || "",
        image: blog.image || "",
        content: blog.content || "",
        status: blog.status || "Draft",
      });

      if (editorInstance.current && blog.content) {
        try {
          let parsedContent;

          try {
            parsedContent =
              typeof blog.content === "string"
                ? JSON.parse(blog.content)
                : blog.content;
          } catch (parseErr) {
            // If not JSON, it's plain text. Convert to EditorJS format.
            parsedContent = {
              blocks: [
                {
                  type: "paragraph",
                  data: {
                    text: blog.content,
                  },
                },
              ],
            };
          }

          if (parsedContent?.blocks) {
            await editorInstance.current.render(parsedContent);
          }
        } catch (err) {
          console.log("Editor render error:", err);
        }
      }
    } catch (error) {
      console.log("Load draft error:", error);
      alert(error.response?.data?.message || "Could not load draft article");
    }
  };

  useEffect(() => {
    if (!user || user.role !== "author") return;
    if (editorInstance.current) return;

    editorInstance.current = new EditorJS({
      holder: "editorjs",
      placeholder: "Start writing your editorial masterpiece...",
      autofocus: true,

      tools: {
        header: {
          class: Header,
          inlineToolbar: true,
          config: {
            placeholder: "Enter heading",
            levels: [1, 2, 3, 4],
            defaultLevel: 2,
          },
        },

        list: {
          class: List,
          inlineToolbar: true,
          config: {
            defaultStyle: "unordered",
          },
        },

        quote: {
          class: Quote,
          inlineToolbar: true,
          config: {
            quotePlaceholder: "Write a quote",
            captionPlaceholder: "Quote author",
          },
        },

        code: CodeTool,
        delimiter: Delimiter,
        marker: Marker,
        inlineCode: InlineCode,

        embed: {
          class: Embed,
          config: {
            services: {
              youtube: true,
              instagram: true,
              twitter: true,
            },
          },
        },

        linkTool: {
          class: LinkTool,
          config: {
            endpoint: "",
          },
        },

        image: {
          class: ImageTool,
          config: {
            uploader: {
              uploadByFile(file) {
                return new Promise((resolve) => {
                  const reader = new FileReader();

                  reader.onload = () => {
                    resolve({
                      success: 1,
                      file: {
                        url: reader.result,
                      },
                    });
                  };

                  reader.readAsDataURL(file);
                });
              },

              uploadByUrl(url) {
                return Promise.resolve({
                  success: 1,
                  file: {
                    url,
                  },
                });
              },
            },
          },
        },
      },

      data: {
        blocks: [
          {
            type: "header",
            data: {
              text: "",
              level: 2,
            },
          },
        ],
      },

      onReady: () => {
        loadDraft();
      },
    });

    editorRef.current = editorInstance.current;

    return () => {
      if (
        editorInstance.current &&
        typeof editorInstance.current.destroy === "function"
      ) {
        editorInstance.current.destroy();
        editorInstance.current = null;
      }
    };
  }, [id]);

  if (!user || user.role !== "author") {
    return (
      <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
        <div className="rounded-3xl border border-red-500/30 bg-red-500/10 p-8 text-center">
          <h1 className="text-2xl font-black">Access Denied</h1>
          <p className="mt-2 text-slate-500">
            Only authors can create articles.
          </p>
        </div>
      </main>
    );
  }

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const editorData = await editorInstance.current.save();

      if (!editorData.blocks || editorData.blocks.length === 0) {
        alert("Please write article content");
        setLoading(false);
        return;
      }

      let imageUrl = form.image;

      // UPLOAD IMAGE IF SELECTED
      if (selectedFile) {
        const formData = new FormData();
        formData.append("blogImage", selectedFile);

        const uploadRes = await api.post("/blogs/upload-image", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });

        imageUrl = uploadRes.data.data;
      }

      const payload = {
        ...form,
        image: imageUrl,
        content: JSON.stringify(editorData),
        tags: form.tags
          .split(",")
          .map((tag) => tag.trim())
          .filter(Boolean),
      };

      if (id) {
        await api.put(`/blogs/${id}`, payload);
      } else {
        await api.post("/blogs/create", payload);
      }

      navigate("/author-dashboard/articles");
    } catch (error) {
      alert(error.response?.data?.message || "Article save failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen px-6 bg-[#f8fafc] dark:bg-[#020c15] py-10 text-slate-900 dark:text-white transition-colors duration-300 md:px-10">
      <div className="mx-auto max-w-7xl">
     <form
          onSubmit={submitHandler}
          className="grid gap-10 lg:grid-cols-[1fr_330px]"
        >
          <section>
            <h1 className="mb-6 text-3xl font-black uppercase tracking-widest text-slate-700">
              {id ? "Edit Post Details" : "Post Details"}
            </h1>

            <input
              name="title"
              value={form.title}
              onChange={handleChange}
              placeholder="Article Title"
              className="w-full rounded-md bg-white dark:bg-slate-800 px-5 py-5 text-2xl font-bold shadow-md outline-none placeholder:text-black dark:placeholder:text-white"
              required
            />

            <div className="mt-8 rounded-2xl bg-white dark:bg-[#01213A] p-8 shadow-sm transition-colors duration-300">
              <div className="mb-8 rounded-2xl bg-gradient-to-r from-[#062b46] to-[#01213A] p-6 text-white shadow-lg">
                <h2 className="text-sm font-black uppercase tracking-[0.2em]">
                  Blog Editor
                </h2>
              </div>
              <p className="mt-2 text-sm text-slate-500 dark:text-white/60">
                Use the plus button inside the editor to add H1, H2, lists,
                quotes, images, links, code blocks and embeds.
              </p>

              <div
                id="editorjs"
                className="editorjs-box min-h-[500px] rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 px-4 py-6 text-slate-800 dark:text-white"
              />
            </div>

            <div
              onClick={() =>
                document.getElementById("featuredImageInput").click()
              }
              className="group relative mt-8 cursor-pointer border-2 border-dashed border-emerald-300 bg-white dark:bg-slate-800 rounded-md dark:text-amber-50 p-10 text-center transition hover:bg-emerald-50 dark:hover:bg-slate-700"
            >
              <input
                id="featuredImageInput"
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />

              <div className="flex flex-col items-center">
                <IoCloudUploadOutline className="text-5xl text-emerald-400 transition group-hover:scale-110" />
                <h3 className="mt-4 font-black uppercase tracking-wider text-[#062b46] dark:text-white">
                  Featured Image
                </h3>
                <p className="mt-1 text-sm text-slate-400">
                  {selectedFile
                    ? selectedFile.name
                    : "Click to upload image or paste URL below"}
                </p>
              </div>

              <input
                name="image"
                value={form.image}
                onClick={(e) => e.stopPropagation()}
                onChange={handleChange}
                placeholder="https://example.com/image.jpg"
                className="mx-auto mt-6 w-full max-w-xl rounded-md border border-slate-200 px-4 py-3 outline-none focus:border-emerald-400"
              />

              {(preview || form.image) && (
                <img
                  src={
                    preview ||
                    (form.image.startsWith("http")
                      ? form.image
                      : `${baseUrl}${form.image}`)
                  }
                  alt="Preview"
                  className="mx-auto mt-6 h-56 w-full max-w-xl rounded-xl object-cover shadow-lg"
                />
              )}
            </div>
          </section>

          <aside className="space-y-6">
            <div className="rounded-3xl bg-[#01213A] p-8 text-white shadow-xl">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/50">
                Publishing Settings
              </p>

              <button
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-[#18d89d] py-4 text-xs font-black uppercase tracking-widest text-[#01213A] transition hover:bg-[#14c392] hover:scale-[1.02]"
                onClick={() => setForm(prev => ({ ...prev, status: "Published" }))}
              >
                <LuSend size={16} />
                {loading && form.status === "Published"
                  ? "Publishing..."
                  : id && form.status === "Published"
                    ? "Update Article"
                    : "Publish Now"}
              </button>

              <button
                type="submit"
                disabled={loading}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 py-4 text-xs font-black uppercase tracking-widest text-white transition hover:bg-white/10"
                onClick={() => setForm(prev => ({ ...prev, status: "Draft" }))}
              >
                <LuSave size={16} />
                {loading && form.status === "Draft"
                  ? "Saving..."
                  : id
                    ? "Update Draft"
                    : "Save Draft"}
              </button>

              <p className="mt-7 text-xs font-bold uppercase leading-6 tracking-wider text-white/45">
                {id
                  ? "You are editing an existing draft/article."
                  : "Your blog will be published once saved. Admin can still manage it."}
              </p>
            </div>

            <div className="rounded-3xl bg-white dark:bg-[#01213A] p-8 shadow-sm transition-colors duration-300">
              <h2 className="flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700 dark:text-white">
                <LuImagePlus className="text-emerald-500" />
                Category
              </h2>

              <div className="relative">
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  className="mt-4 w-full appearance-none border border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-[#011627] dark:text-white px-4 py-4 text-sm outline-none transition-all focus:border-[#18d89d] rounded-xl"
                >
                  {categories.map((category) => (
                    <option key={category} className="dark:bg-slate-800">
                      {category}
                    </option>
                  ))}
                </select>
                <div className="pointer-events-none absolute bottom-0 right-4 top-4 flex items-center text-slate-400">
                  <svg
                    className="h-4 w-4 fill-current"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                  >
                    <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" />
                  </svg>
                </div>
              </div>

              <h2 className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700 dark:text-white">
                <LuSave className="text-emerald-500" />
                Short Description
              </h2>

              <textarea
                name="excerpt"
                value={form.excerpt}
                onChange={handleChange}
                rows="4"
                placeholder="Short summary for blog cards..."
                className="mt-4 w-full resize-none border border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-[#011627] dark:text-white px-4 py-3 text-sm outline-none rounded-xl focus:border-[#18d89d] transition-all"
              />

              <h2 className="mt-8 flex items-center gap-2 text-sm font-black uppercase tracking-wider text-slate-700 dark:text-white">
                <LuUpload className="text-emerald-500" />
                Tags
              </h2>

              <input
                name="tags"
                value={form.tags}
                onChange={handleChange}
                placeholder="react, ui, design"
                className="mt-4 w-full border border-slate-200 dark:border-slate-700 bg-[#f8fafc] dark:bg-[#011627] dark:text-white px-4 py-4 text-sm outline-none rounded-xl focus:border-[#18d89d] transition-all"
              />

              {form.tags && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {form.tags
                    .split(",")
                    .map((tag) => tag.trim())
                    .filter(Boolean)
                    .map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold text-emerald-700"
                      >
                        #{tag}
                      </span>
                    ))}
                </div>
              )}

              <button
                type="button"
                onClick={() => navigate("/author-dashboard/articles")}
                className="mt-10 w-full text-sm font-black uppercase tracking-widest text-red-500"
              >
                Move To Trash
              </button>
            </div>
          </aside>
        </form>
      </div>
    </main>
  );
}
