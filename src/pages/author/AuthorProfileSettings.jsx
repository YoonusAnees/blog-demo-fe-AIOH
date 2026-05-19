import { useEffect, useState } from "react";
import api from "../../api/axios";

export default function AuthorProfileSettings() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    professionalTitle: "",
    blogCategory: "",
    oldPassword: "",
    newPassword: "",
    avatar: "",
  });

  const [preview, setPreview] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);

  const baseUrl = import.meta.env.VITE_API_URL.replace("/api", "");

  const loadMe = async () => {
    const res = await api.get("/users/me"); 

    setForm((prev) => ({
      ...prev,
      name: res.data.data.name || "",
      email: res.data.data.email || "",
      professionalTitle: res.data.data.professionalTitle || "",
      blogCategory: res.data.data.blogCategory || "",
      avatar: res.data.data.avatar || "",
    }));

    localStorage.setItem("user", JSON.stringify(res.data.data));
    window.dispatchEvent(new Event("storage"));
  };

  useEffect(() => {
    loadMe();
  }, []);

  const saveProfile = async () => {
    try {
      // 1. Update basic profile info
      await api.put("/users/me", {
        name: form.name,
        professionalTitle: form.professionalTitle,
        blogCategory: form.blogCategory,
      });

      // 2. Update avatar if selected
      if (selectedFile) {
        const formData = new FormData();
        formData.append("avatar", selectedFile);
        await api.patch("/users/me/avatar", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      alert("Profile updated");
      loadMe();
      setSelectedFile(null);
      setPreview(null);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setPreview(URL.createObjectURL(file));
    }
  };

  const changePassword = async () => {
    await api.put("/users/me/password", {
      oldPassword: form.oldPassword,
      newPassword: form.newPassword,
    });

    alert("Password updated");
  };

  return (
    <main className="min-h-screen bg-[#f6f8fb] dark:bg-[#020c15] p-6 transition-colors duration-300 md:p-12">
      <div className="mx-auto max-w-7xl">
        <h1 className="mb-10 text-5xl font-black tracking-tight text-slate-900 dark:text-white">
          Profile Settings
        </h1>

        <div className="grid gap-10 lg:grid-cols-[1fr_400px]">
          <div className="space-y-10">
            {/* PERSONAL INFORMATION */}
            <section className="overflow-hidden rounded-3xl dark:bg-slate-900 p-8 shadow-2xl transition-all">
              <h2 className="mb-6 text-xl font-black uppercase tracking-widest text-slate-500 dark:text-white">
                Personal Information
              </h2>

              <div className="space-y-8 rounded-3xl bg-white dark:bg-slate-900 p-10 shadow-inner">
                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                    Full Name
                  </label>
                  <input
                    placeholder="e.g. Danial Aliaskarov"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="mt-3 w-full rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-800 outline-none transition focus:ring-2 focus:ring-[#18d89d]/20"
                  />
                </div>

                <div>
                  <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                    E-Mail
                  </label>
                  <input
                    disabled
                    value={form.email}
                    className="mt-3 w-full cursor-not-allowed rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-400 outline-none"
                  />
                </div>

                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Professional Title
                    </label>
                    <input
                      placeholder="UX/UI Designer"
                      value={form.professionalTitle}
                      onChange={(e) =>
                        setForm({ ...form, professionalTitle: e.target.value })
                      }
                      className="mt-3 w-full rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-800 outline-none transition focus:ring-2 focus:ring-[#18d89d]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Blog Category (Optional)
                    </label>
                    <div className="relative">
                      <select
                        value={form.blogCategory}
                        onChange={(e) =>
                          setForm({ ...form, blogCategory: e.target.value })
                        }
                        className="mt-3 w-full appearance-none rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-800 outline-none transition focus:ring-2 focus:ring-[#18d89d]/20"
                      >
                        <option value="">Select Category</option>
                        <option value="Technology">Technology</option>
                        <option value="Business">Business</option>
                        <option value="Design">Design</option>
                      </select>
                      <span className="pointer-events-none absolute right-5 top-[28px] text-slate-400">
                        ▼
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </section>

            {/* CHANGE PASSWORD */}
            <section className="overflow-hidden rounded-3xl p-8 shadow-2xl transition-all dark:bg-slate-900">
              <h2 className="mb-6 text-xl font-black uppercase tracking-widest text-slate-500 dark:text-white">
                Change Password
              </h2>

              <div className="rounded-3xl  p-10 shadow-inner">
                <div className="grid gap-8 md:grid-cols-2">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      Old Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.oldPassword}
                      onChange={(e) =>
                        setForm({ ...form, oldPassword: e.target.value })
                      }
                      className="mt-3 w-full rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-800 outline-none transition focus:ring-2 focus:ring-[#18d89d]/20"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">
                      New Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={form.newPassword}
                      onChange={(e) =>
                        setForm({ ...form, newPassword: e.target.value })
                      }
                      className="mt-3 w-full rounded-xl bg-slate-200/50 p-5 text-sm font-bold text-slate-800 outline-none transition focus:ring-2 focus:ring-[#18d89d]/20"
                    />
                  </div>
                </div>
              </div>
            </section>
          </div>

          <aside className="h-fit rounded-[40px] dark:bg-slate-900 p-10 shadow-2xl">
            <div
              onClick={() => document.getElementById("avatarInput").click()}
              className="relative mx-auto h-52 w-52 cursor-pointer group"
            >
              <div className="h-full w-full overflow-hidden rounded-3xl bg-slate-300">
                {preview || form.avatar ? (
                  <img
                    src={preview || (form.avatar?.startsWith("http") ? form.avatar : `${baseUrl}${form.avatar}`)}
                    alt="Avatar"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center text-6xl font-black text-slate-800">
                    {form.name?.charAt(0) || "U"}
                  </div>
                )}
              </div>
              <button className="absolute -bottom-2 -right-2 flex h-10 w-10 items-center justify-center rounded-xl bg-[#18d89d] text-slate-900 shadow-lg transition hover:scale-110">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={2.5}
                  stroke="currentColor"
                  className="h-5 w-5"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8.8-2.685a4.5 4.5 0 0 1 1.13-1.897L16.863 4.487Zm0 0L19.5 7.125"
                  />
                </svg>
              </button>
            </div>

            <input
              id="avatarInput"
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />

            <div className="mt-8 text-center">
              <h2 className="text-2xl font-black text-slate-800 dark:text-white">{form.name}</h2>
              <p className="mt-1 text-sm font-bold text-[#18d89d]/70 uppercase tracking-widest">
                {form.professionalTitle || "New Author"}
              </p>
            </div>

            <div className="mt-14 space-y-4">
              <button
                onClick={saveProfile}
                className="w-full rounded-2xl bg-[#18d89d] py-5 text-sm font-black uppercase tracking-[0.2em] text-[#01213A] shadow-lg transition hover:bg-[#14c392] hover:scale-[1.02]"
              >
                SAVE PROFILE
              </button>

              <button
                onClick={() => loadMe()}
                className="w-full rounded-2xl bg-[#011627] py-5 text-sm font-black uppercase tracking-[0.2em] text-white/90 shadow-lg transition hover:bg-slate-800"
              >
                DISCARD CHANGES
              </button>
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}
