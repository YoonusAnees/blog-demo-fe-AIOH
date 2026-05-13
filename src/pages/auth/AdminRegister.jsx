import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import { MdEmail, MdLock, MdPerson } from "react-icons/md";

export default function AdminRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await api.post("/auth/admin/register", form);
      alert("Admin registered successfully. Please login.");
      navigate("/admin-login");
    } catch (error) {
      alert(error.response?.data?.message || "Admin registration failed");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="flex flex-col items-center justify-center w-full max-w-lg rounded-xl bg-white/15 p-10 text-white shadow-2xl backdrop-blur">
        <div className="w-45 h-14 mb-8 flex justify-center overflow-hidden items-center ">
          <img src="logoAIOH.png" alt="logo" className="h-full w-full" />
        </div>

        <div className="flex flex-col items-center justify-center font-medium ">
          <p className="text-center font-bold text-xl ">
            Allinone{" "}
            <span className="bg-gradient-to-r from-[#18d89d] to-[#14c392] bg-clip-text text-transparent ">
              insights
            </span>
          </p>
          <h1 className="text-center text-3xl font-medium ">Admin Registration</h1>
          <p className="text-center text-white/30 tracking-[1px] mt-3 uppercase">
            Create an administrative account
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-10 space-y-7 w-full">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/50">
              Full Name
            </label>
            <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
              <MdPerson className="mr-3 text-xl text-white/50" />
              <input
                type="text"
                placeholder="Enter full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/50">
              Admin Email
            </label>
            <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
              <MdEmail className="mr-3 text-xl text-white/50" />
              <input
                type="email"
                placeholder="Enter admin email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/50">
              Password
            </label>
            <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
              <MdLock className="mr-3 text-xl text-white/50" />
              <input
                type="password"
                placeholder="Create password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          <button className="mt-4 w-full rounded-xl bg-[#18d89d] py-4 font-medium text-black transition hover:bg-[#14c392]">
            REGISTER ADMIN
          </button>
        </form>

        <p className="mt-8 text-center text-sm uppercase tracking-wider text-white/50 ">
          Already an admin?
          <Link
            to="/admin-login"
            className="font-bold text-[#18d89d]/70 ml-1 hover:underline"
          >
            Log in
          </Link>
        </p>
      </div>
    </main>
  );
}