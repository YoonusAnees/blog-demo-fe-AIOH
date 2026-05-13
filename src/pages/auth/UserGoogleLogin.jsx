import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function UserGoogleLogin() {
  const navigate = useNavigate();

  const handleSuccess = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential,
      });

      localStorage.setItem("accessToken", res.data.accessToken);
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/user-dashboard");
    } catch (error) {
      alert(error.response?.data?.message || "Google login failed");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5">
      <div className="w-full max-w-md rounded-[18px] border border-white/10 bg-white/15 p-8 shadow-2xl backdrop-blur">
        <h1 className="text-center text-3xl font-black">Welcome Back</h1>

        <p className="mt-3 text-center text-sm uppercase tracking-[0.2em] text-white/50">
          Access your dashboard
        </p>

        <div className="mt-8 flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Login failed")}
          />
        </div>

        <p className="mt-8 text-center text-sm font-bold uppercase tracking-wider text-white/70">
          Don&apos;t have an account?{" "}
          <Link to="/user-register" className="text-emerald-400">
            Sign Up
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-white/50">
          Admin?{" "}
          <Link to="/admin-login" className="text-emerald-400">
            Login here
          </Link>
        </p>
      </div>
    </main>
  );
}