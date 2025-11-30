import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromoContent from "@/components/auth/PromoContent";
import { REGISTER_ACTION } from "@/redux/actions/auth.actions";
import {
  MdVisibility,
  MdVisibilityOff,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdPerson,
} from "react-icons/md";
import type { IUser } from "@/types/user.types/user.types";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const [formData, setFormData] = useState<Partial<IUser>>({
    name: "",
    email: "",
    password: "",
    phone: "",
    location: "",
    role: "PLAYER",
  });

  const handleInputChange = (field: keyof IUser, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const user: IUser = {
        name: formData.name || "",
        email: formData.email || "",
        password: formData.password || "",
        phone: formData.phone || "",
        location: formData.location || "",
        role: (formData.role as IUser["role"]) || "PLAYER",
      };
      await REGISTER_ACTION(user);

      // Reset the form
      setFormData({
        name: "",
        email: "",
        password: "",
        phone: "",
        location: "",
        role: "PLAYER",
      });

      // Make sure no old tokens exist
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

      // Navigate to login
      navigate("/login");
    } catch (err) {
      console.error("Register error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-dvh flex bg-gray-50">
      <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8">
        {/* Promo Section */}
        <div className="lg:w-3/5 flex items-center justify-center">
          <div className="max-w-lg">
            <PromoContent />
          </div>
        </div>

        {/* Signup Form */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-sm text-gray-600 mt-1">Join Athletix today</p>
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* Name */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                />
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.email}
                  onChange={(e) => handleInputChange("email", e.target.value)}
                />
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  type="tel"
                  placeholder="Phone Number"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.phone}
                  onChange={(e) => handleInputChange("phone", e.target.value)}
                />
                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.password}
                  onChange={(e) =>
                    handleInputChange("password", e.target.value)
                  }
                />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
                  onClick={() => setShowPassword((prev) => !prev)}
                >
                  {showPassword ? (
                    <MdVisibilityOff className="w-5 h-5" />
                  ) : (
                    <MdVisibility className="w-5 h-5" />
                  )}
                </button>
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Location */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Location"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                />
                <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* Role Selector */}
              <select
                value={formData.role}
                onChange={(e) => handleInputChange("role", e.target.value)}
                className="w-full border p-2 rounded-lg"
              >
                <option value="PLAYER">Player</option>
                <option value="VENUE_OWNER">Venue Owner</option>
                <option value="ADMIN">Admin</option>
              </select>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {loading ? "Signing Up..." : "SIGN UP"}
              </button>
            </form>

            <div className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-[#2c5aa0] cursor-pointer font-semibold hover:underline"
                onClick={() => navigate("/login")}
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
