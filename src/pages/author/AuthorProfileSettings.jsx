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
    <main className="grid gap-6 p-8 lg:grid-cols-[1fr_330px]">
      <section className="bg-[#191d1f] p-10 text-white">
        <h1 className="text-4xl font-black">Profile Settings</h1>

        <div className="mt-8 space-y-7">
          <input
            placeholder="Full Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="w-full rounded-lg bg-slate-300 p-4 text-black"
          />

          <input
            disabled
            value={form.email}
            className="w-full rounded-lg bg-slate-300 p-4 text-black"
          />

          <div className="grid gap-6 md:grid-cols-2">
            <input
              placeholder="Professional Title"
              value={form.professionalTitle}
              onChange={(e) =>
                setForm({ ...form, professionalTitle: e.target.value })
              }
              className="rounded-lg bg-slate-300 p-4 text-black"
            />

            <input
              placeholder="Blog Category"
              value={form.blogCategory}
              onChange={(e) =>
                setForm({ ...form, blogCategory: e.target.value })
              }
              className="rounded-lg bg-slate-300 p-4 text-black"
            />
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <input
              type="password"
              placeholder="Old Password"
              value={form.oldPassword}
              onChange={(e) =>
                setForm({ ...form, oldPassword: e.target.value })
              }
              className="rounded-lg bg-slate-300 p-4 text-black"
            />

            <input
              type="password"
              placeholder="New Password"
              value={form.newPassword}
              onChange={(e) =>
                setForm({ ...form, newPassword: e.target.value })
              }
              className="rounded-lg bg-slate-300 p-4 text-black"
            />
          </div>
        </div>
      </section>

      <aside className="bg-[#191d1f] p-8 text-center text-white">
        <div
          onClick={() => document.getElementById("avatarInput").click()}
          className="group relative mx-auto h-36 w-36 cursor-pointer overflow-hidden rounded-full bg-slate-300"
        >
          {preview || form.avatar ? (
            <img
              src={preview || `${baseUrl}${form.avatar}`}
              alt="Avatar"
              className="h-full w-full object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center text-4xl font-black text-slate-500">
              {form.name?.charAt(0) || "U"}
            </div>
          )}
          <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <span className="text-xs font-bold">CHANGE PHOTO</span>
          </div>
        </div>

        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <h2 className="mt-8 text-2xl font-black">{form.name}</h2>
        <p className="text-sm text-slate-400">{form.professionalTitle}</p>

        <button
          onClick={saveProfile}
          className="mt-12 w-full bg-[#18d89d] py-4 font-black text-black"
        >
          SAVE PROFILE
        </button>

        <button
          onClick={changePassword}
          className="mt-5 w-full bg-[#062b46] py-4 font-black"
        >
          UPDATE PASSWORD
        </button>
      </aside>
    </main>
  );
}