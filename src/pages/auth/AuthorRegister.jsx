import { useState, useEffect } from "react";
import { GoogleLogin } from "@react-oauth/google";
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import api from "../../api/axios";
import {
  MdPerson,
  MdEmail,
  MdWork,
  MdPublic,
  MdLocationCity,
  MdLock,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";
import { Country, City } from "country-state-city";

export default function AuthorRegister() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    professionalTitle: "",
    country: "",
    city: "",
    password: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [countries, setCountries] = useState([]);
  const [cities, setCities] = useState([]);

  useEffect(() => {
    setCountries(Country.getAllCountries());
  }, []);

  useEffect(() => {
    if (form.country) {
      setCities(City.getCitiesOfCountry(form.country));
      setForm((prev) => ({ ...prev, city: "" }));
    } else {
      setCities([]);
    }
  }, [form.country]);

  const submitHandler = async (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    try {
      await api.post("/auth/author/register", {
        name: form.name,
        email: form.email,
        password: form.password,
        professionalTitle: form.professionalTitle,
        country: Country.getCountryByCode(form.country)?.name || form.country,
        city: form.city,
      });
      alert("Author account created. Please login.");
      navigate("/author-login");
    } catch (error) {
      alert(error.response?.data?.message || "Author registration failed");
    }
  };

  const googleSuccess = async (response) => {
    try {
      const res = await api.post("/auth/google", {
        credential: response.credential,
        role: "author",
      });

      Cookies.set("accessToken", res.data.accessToken, { expires: 7 });
      localStorage.setItem("user", JSON.stringify(res.data.user));

      navigate("/author-dashboard");
    } catch (error) {
      alert("Google registration failed");
    }
  };

  return (
    <main className="flex min-h-[calc(100vh-64px)] items-center justify-center px-5 py-4">
      <div className="flex w-full max-w-2xl flex-col items-center justify-center rounded-xl bg-white/15 p-6 text-white shadow-2xl backdrop-blur">
        <div className="mb-3 flex h-15 w-45 items-center justify-center overflow-hidden">
          <img src="logoAIOH.png" alt="logo" className="h-full w-full" />
        </div>

        <div className="flex flex-col items-center justify-center font-medium">
          <p className="text-center text-lg font-bold">
            Allinone <span className="bg-gradient-to-r from-[#18d89d] to-[#14c392] bg-clip-text text-transparent">insights</span>
          </p>
          <h1 className="text-center text-2xl font-medium">Create an Account</h1>
          <p className="mt-1 text-center text-[10px] uppercase tracking-[1px] text-white/30">
            Join for premium editorial access
          </p>
        </div>

        <form onSubmit={submitHandler} className="mt-5 w-full space-y-4">
          <div className="flex flex-col">
            <label className="text-[10px] uppercase tracking-widest text-white/50">
              Full Name
            </label>
            <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
              <MdPerson className="mr-3 text-xl text-white/50" />
              <input
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                required
              />
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col md:w-1/2">
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
                  required
                />
              </div>
            </div>

            <div className="flex w-full flex-col md:w-1/2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">
                Job Title
              </label>
              <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
                <MdWork className="mr-3 text-xl text-white/50" />
                <input
                  type="text"
                  placeholder="Enter your job title"
                  value={form.professionalTitle}
                  onChange={(e) => setForm({ ...form, professionalTitle: e.target.value })}
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col md:w-1/2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">
                Country
              </label>
              <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
                <MdPublic className="mr-3 text-xl text-white/50" />
                <select
                  value={form.country}
                  onChange={(e) => setForm({ ...form, country: e.target.value })}
                  className="w-full bg-transparent text-white outline-none [&>option]:bg-slate-800 [&>option]:text-white"
                  required
                >
                  <option value="">Select Country</option>
                  {countries.map((c) => (
                    <option key={c.isoCode} value={c.isoCode}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex w-full flex-col md:w-1/2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">
                City
              </label>
              <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
                <MdLocationCity className="mr-3 text-xl text-white/50" />
                <select
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="w-full bg-transparent text-white outline-none [&>option]:bg-slate-800 [&>option]:text-white"
                  disabled={!form.country}
                  required
                >
                  <option value="">Select City</option>
                  {cities.map((city) => (
                    <option key={city.name} value={city.name}>
                      {city.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div className="flex w-full flex-col gap-4 md:flex-row">
            <div className="flex w-full flex-col md:w-1/2">
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
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="ml-2 flex items-center text-white/50 transition hover:text-white/80 focus:outline-none"
                >
                  {showPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
            </div>

            <div className="flex w-full flex-col md:w-1/2">
              <label className="text-[10px] uppercase tracking-widest text-white/50">
                Re-enter Password
              </label>
              <div className="flex items-center border-b border-white/40 py-2 transition-colors focus-within:border-[#18d89d]">
                <MdLock className="mr-3 text-xl text-white/50" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm your password"
                  value={form.confirmPassword}
                  onChange={(e) => setForm({ ...form, confirmPassword: e.target.value })}
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="ml-2 flex items-center text-white/50 transition hover:text-white/80 focus:outline-none"
                >
                  {showConfirmPassword ? <MdVisibilityOff className="text-xl" /> : <MdVisibility className="text-xl" />}
                </button>
              </div>
            </div>
          </div>

          <button className="mt-5 w-full rounded-xl bg-[#18d89d] py-3 font-medium tracking-widest text-black transition hover:bg-[#14c392]">
            CREATE ACCOUNT
          </button>
        </form>

        <div className="mt-4 flex justify-center">
          <GoogleLogin
            onSuccess={googleSuccess}
            onError={() => alert("Google failed")}
            text="signup_with"
          />
        </div>

        <p className="mt-4 text-center text-sm uppercase tracking-wider text-white/50">
          Already have an account?{" "}
          <Link to="/author-login" className="ml-1 font-bold text-[#18d89d]/70">
            Sign In
          </Link>
        </p>
      </div>
    </main>
  );
}