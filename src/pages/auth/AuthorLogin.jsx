import { useState } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";
import {
  MdEmail,
  MdLock,
  MdCheck,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function AuthorLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [showPassword, setShowPassword] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      const res = await api.post("/auth/login", form);

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      const role = res.data.user.role;
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "author") {
        navigate("/author-dashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      alert(error.response?.data?.message || "Login failed");
    }
  };

  const googleSuccess = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential,
        role: "author",
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/author-dashboard");
    } catch (error) {
      alert("Google login failed");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
      <div className="flex flex-col items-center justify-center w-full max-w-md rounded-xl bg-white/15 p-8 text-white shadow-2xl backdrop-blur">
        <div className="w-45 h-14 mb-6 flex justify-center overflow-hidden items-center ">
          <img src="logoAIOH.png" alt="logo" className="h-full w-full" />
        </div>
        <div className="flex flex-col items-center justify-center  font-medium ">
          <p className="text-center font-bold text-xl ">
            Allinone{" "}
            <span className="bg-gradient-to-r from-[#18d89d] to-[#14c392] bg-clip-text text-transparent ">
              insights
            </span>
          </p>
          <h1 className="text-center text-3xl font-medium ">Welcome Back</h1>
          <p className="text-center text-white/30 tracking-[1px] mt-3">
            ACCESS YOUR DASHBOARD{" "}
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-8 space-y-6 w-full">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/50">
              Email Address
            </label>
            <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
              <MdEmail className="mr-3 text-xl text-white/50" />
              <input
                type="email"
                placeholder="Enter your email"
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
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="ml-2 flex items-center text-white/50 transition hover:text-white/80 focus:outline-none"
              >
                {showPassword ? (
                  <MdVisibilityOff className="text-xl" />
                ) : (
                  <MdVisibility className="text-xl" />
                )}
              </button>
            </div>
            <div className="flex items-center justify-between mt-2">
              <label
                htmlFor="remember"
                className="flex items-center cursor-pointer group"
              >
                <div className="relative flex items-center justify-center mr-2">
                  <input
                    type="checkbox"
                    id="remember"
                    className="peer sr-only"
                  />
                  <div className="w-4 h-4 border border-white/40 rounded-full bg-transparent peer-checked:bg-[#18d89d] peer-checked:border-[#18d89d] transition"></div>
                  <MdCheck className="absolute text-black text-[10px] opacity-0 peer-checked:opacity-100 transition" />
                </div>
                <span className="text-sm text-white/50 group-hover:text-white/80 transition">
                  Remember me
                </span>
              </label>

              <Link
                to="/author-reset-password"
                className="text-sm hover:underline text-white/50"
              >
                Forgot Password?
              </Link>
            </div>
          </div>

          <button className="mt-4 w-full rounded-xl bg-[#18d89d] py-4 font-medium text-black transition hover:bg-[#14c392]">
            LOG IN
          </button>
        </form>

        <div className="mt-6 flex justify-center">
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={() => alert("Google failed")}
          />
        </div>

        <p className="mt-6 text-center text-sm uppercase tracking-wider text-white/50 ">
          Don&apos;t have an account?
          <Link
            to="/author-register"
            className="font-bold text-[#18d89d]/70 ml-1"
          >
            Sign Up
          </Link>
        </p>
      </div>
    </main>
  );
}
