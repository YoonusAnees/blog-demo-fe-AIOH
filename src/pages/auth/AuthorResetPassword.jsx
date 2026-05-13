import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import emailjs from "@emailjs/browser";
import api from "../../api/axios";

import {
  MdEmail,
  MdLock,
  MdArrowBack,
  MdVpnKey,
  MdVisibility,
  MdVisibilityOff,
} from "react-icons/md";

export default function AuthorResetPassword() {
  const navigate = useNavigate();

  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [showPassword, setShowPassword] = useState(false);

  // ================= SEND OTP =================
  const sendOtpHandler = async (e) => {
    e.preventDefault();

    setLoading(true);

    try {
      // CHECK EMAIL EXISTS
      await api.post("/auth/check-email", { email });

      // GENERATE OTP
      const code = Math.floor(
        100000 + Math.random() * 900000
      ).toString();

      setGeneratedOtp(code);

      // EXPIRY TIME
      const expiryTime = new Date(
        Date.now() + 15 * 60 * 1000
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      });

      // TEMPLATE PARAMS
      const templateParams = {
        to_email: email,
        passcode: code,
        time: expiryTime,
      };

      console.log("EMAIL PARAMS:", templateParams);

      // SEND EMAIL
      const response = await emailjs.send(
        import.meta.env.VITE_EMAILJS_SERVICE_ID,
        import.meta.env.VITE_EMAILJS_TEMPLATE_ID,
        templateParams,
        import.meta.env.VITE_EMAILJS_PUBLIC_KEY
      );

      console.log("EMAILJS SUCCESS:", response);

      setStep(2);

      alert("OTP sent successfully!");
    } catch (error) {
      console.log("EMAILJS ERROR:", error);

      alert(
        error?.text ||
          error?.response?.data?.message ||
          "Failed to send OTP"
      );
    } finally {
      setLoading(false);
    }
  };

  // ================= VERIFY OTP =================
  const verifyOtpHandler = (e) => {
    e.preventDefault();

    if (otp === generatedOtp) {
      setStep(3);
    } else {
      alert("Invalid OTP");
    }
  };

  // ================= RESET PASSWORD =================
  const resetPasswordHandler = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      await api.post("/auth/reset-password", {
        email,
        password: newPassword,
      });

      alert("Password reset successful!");

      navigate("/author-login");
    } catch (error) {
      console.log(error);

      alert(
        error?.response?.data?.message ||
          "Failed to reset password"
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#06131f] px-5 py-10">
      <div className="w-full max-w-md rounded-3xl border border-white/10 bg-white/10 p-8 text-white shadow-2xl backdrop-blur-xl">
        {/* BACK BUTTON */}
        <Link
          to="/author-login"
          className="mb-6 flex items-center text-sm text-white/60 transition hover:text-white"
        >
          <MdArrowBack className="mr-2" />
          Back to Login
        </Link>

        {/* HEADER */}
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold">
            Reset Password
          </h1>

          <p className="mt-2 text-sm tracking-wide text-white/40">
            {step === 1 &&
              "Verify your email address"}

            {step === 2 &&
              "Enter the verification code"}

            {step === 3 &&
              "Create your new password"}
          </p>
        </div>

        {/* ================= STEP 1 ================= */}
        {step === 1 && (
          <form
            onSubmit={sendOtpHandler}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[2px] text-white/40">
                Email Address
              </label>

              <div className="flex items-center border-b border-white/20 py-3 focus-within:border-[#18d89d]">
                <MdEmail className="mr-3 text-xl text-white/40" />

                <input
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) =>
                    setEmail(e.target.value)
                  }
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#18d89d] py-4 font-semibold text-black transition hover:bg-[#14c392] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "SENDING OTP..."
                : "SEND OTP"}
            </button>
          </form>
        )}

        {/* ================= STEP 2 ================= */}
        {step === 2 && (
          <form
            onSubmit={verifyOtpHandler}
            className="space-y-6"
          >
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[2px] text-white/40">
                Verification Code
              </label>

              <div className="flex items-center border-b border-white/20 py-3 focus-within:border-[#18d89d]">
                <MdVpnKey className="mr-3 text-xl text-white/40" />

                <input
                  type="text"
                  required
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) =>
                    setOtp(e.target.value)
                  }
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full rounded-2xl bg-[#18d89d] py-4 font-semibold text-black transition hover:bg-[#14c392]"
            >
              VERIFY OTP
            </button>

            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-[#18d89d]"
            >
              Resend OTP
            </button>
          </form>
        )}

        {/* ================= STEP 3 ================= */}
        {step === 3 && (
          <form
            onSubmit={resetPasswordHandler}
            className="space-y-6"
          >
            {/* PASSWORD */}
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[2px] text-white/40">
                New Password
              </label>

              <div className="flex items-center border-b border-white/20 py-3 focus-within:border-[#18d89d]">
                <MdLock className="mr-3 text-xl text-white/40" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="New password"
                  value={newPassword}
                  onChange={(e) =>
                    setNewPassword(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowPassword(
                      !showPassword
                    )
                  }
                  className="ml-2 text-white/40"
                >
                  {showPassword ? (
                    <MdVisibilityOff className="text-xl" />
                  ) : (
                    <MdVisibility className="text-xl" />
                  )}
                </button>
              </div>
            </div>

            {/* CONFIRM PASSWORD */}
            <div>
              <label className="mb-2 block text-[11px] uppercase tracking-[2px] text-white/40">
                Confirm Password
              </label>

              <div className="flex items-center border-b border-white/20 py-3 focus-within:border-[#18d89d]">
                <MdLock className="mr-3 text-xl text-white/40" />

                <input
                  type={
                    showPassword
                      ? "text"
                      : "password"
                  }
                  required
                  placeholder="Confirm password"
                  value={confirmPassword}
                  onChange={(e) =>
                    setConfirmPassword(
                      e.target.value
                    )
                  }
                  className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-2xl bg-[#18d89d] py-4 font-semibold text-black transition hover:bg-[#14c392] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "RESETTING..."
                : "RESET PASSWORD"}
            </button>
          </form>
        )}
      </div>
    </main>
  );
}