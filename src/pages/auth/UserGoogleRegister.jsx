import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import api from "../../api/axios";

export default function UserGoogleRegister() {
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
      alert(error.response?.data?.message || "Google registration failed");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-10">
      <div className="w-full max-w-xl rounded-none bg-white p-10 text-slate-900 shadow-2xl">
        <h1 className="text-center text-3xl font-black">Create an Account</h1>

        <p className="mt-3 text-center text-sm text-slate-500">
          Join BlogAuth for premium editorial access.
        </p>

        <div className="mt-10 flex justify-center">
          <GoogleLogin
            onSuccess={handleSuccess}
            onError={() => alert("Registration failed")}
            text="signup_with"
          />
        </div>

        <p className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{" "}
          <Link to="/user-login" className="font-bold text-slate-900 underline">
            Sign in
          </Link>
        </p>

        <p className="mt-4 text-center text-sm text-slate-500">
          Admin?{" "}
          <Link
            to="/admin-login"
            className="font-bold text-slate-900 underline"
          >
            Admin login
          </Link>
        </p>
      </div>
    </main>
  );
}