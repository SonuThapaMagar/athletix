import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "@/redux/store";
import PromoContent from "@/components/auth/PromoContent";
import SportsAnimations from "@/components/common/SportsAnimations";
import { LOGIN_ACTION } from "@/redux/actions/auth.actions";
import { MdVisibility, MdVisibilityOff } from "react-icons/md";

const Login = () => {
  const navigate = useNavigate();
  const { isLoggedIn, userRole } = useSelector(
    (state: RootState) => state.authSlice
  );
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<{ email: string; password: string }>({
    email: "",
    password: "",
  });

  // Redirect if already logged in
  useEffect(() => {
  if (isLoggedIn && userRole) {
    if (userRole === "PLAYER") navigate("/player");
    if (userRole === "VENUE_OWNER") navigate("/venue-owner");
    if (userRole === "ADMIN") navigate("/admin");
  }
}, [isLoggedIn, userRole, navigate]);

  const handleInputChange = (field: "email" | "password", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const loginData = {
        email: formData.email,
        password: formData.password,
      };

      const res = await LOGIN_ACTION(loginData);

      const role = res.userRole;
      if (role === "PLAYER") navigate("/player");
      if (role === "VENUE_OWNER") navigate("/venue-owner");
      if (role === "ADMIN") navigate("/admin");
    } catch (err) {
      console.error("Login error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <SportsAnimations variant="login" />
      <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8 relative z-10">
        {/* Promo Section */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <div className="max-w-lg">
            <PromoContent />
          </div>
        </div>

        {/* Login Form */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Login</h2>
              <p className="text-sm text-gray-600 mt-1">Welcome back to Athletix</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleLoginSubmit}>
              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5">
                  <use xlinkHref="#email-icon" />
                </svg>
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.password}
                  onChange={(e) => handleInputChange("password", e.target.value)}
                />
                <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowPassword((prev) => !prev)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Signing In..." : "SIGN IN"}
              </button>
            </form>

            <div className="text-center text-gray-600 text-sm mt-4">
              Don't have an account?{" "}
              <button
                type="button"
                className="text-[#2c5aa0] cursor-pointer font-semibold hover:underline"
                onClick={() => navigate("/signup")}
              >
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
