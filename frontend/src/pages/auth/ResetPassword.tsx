import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdLock, MdVisibility, MdVisibilityOff, MdArrowBack, MdEmail } from "react-icons/md";
import { VERIFY_OTP_AND_RESET_PASSWORD_ACTION, SEND_OTP_ACTION } from "@/redux/actions/auth.actions";
import { toast } from "sonner";
import PromoContent from "@/components/auth/PromoContent";
import SportsAnimations from "@/components/common/SportsAnimations";

const ResetPassword = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");

  const [loading, setLoading] = useState(false);
  const [resendingOtp, setResendingOtp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    otp: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    // Get email from localStorage (set when OTP was sent)
    const storedEmail = localStorage.getItem("resetPasswordEmail");
    if (!storedEmail) {
      toast.error("Please request an OTP first.");
      navigate("/forgot-password");
    } else {
      setEmail(storedEmail);
    }
  }, [navigate]);

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.otp.trim()) {
      toast.error("Please enter the OTP");
      return false;
    }

    if (formData.otp.length !== 6) {
      toast.error("OTP must be 6 digits");
      return false;
    }

    if (!formData.newPassword.trim()) {
      toast.error("Please enter a new password");
      return false;
    }

    if (formData.newPassword.length < 6) {
      toast.error("Password must be at least 6 characters long");
      return false;
    }

    if (formData.newPassword !== formData.confirmPassword) {
      toast.error("Passwords do not match");
      return false;
    }

    return true;
  };

  const handleResendOTP = async () => {
    if (!email) {
      toast.error("Email not found. Please go back and request OTP again.");
      navigate("/forgot-password");
      return;
    }

    setResendingOtp(true);
    try {
      await SEND_OTP_ACTION(email);
      toast.success("OTP has been resent to your email");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error(err?.response?.data?.message || "Failed to resend OTP. Please try again.");
    } finally {
      setResendingOtp(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setLoading(true);
    try {
      await VERIFY_OTP_AND_RESET_PASSWORD_ACTION({
        email,
        otp: formData.otp,
        newPassword: formData.newPassword,
      });

      // Clear stored email after successful reset
      localStorage.removeItem("resetPasswordEmail");
      
      toast.success("Password reset successfully! Redirecting to login...");
      
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err: any) {
      console.error("Reset password error:", err);
      toast.error(err?.response?.data?.message || "Failed to reset password. Please try again.");
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

        {/* Reset Password Form */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <button
              onClick={() => navigate("/forgot-password")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="text-sm">Back</span>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Reset Password</h2>
              <p className="text-sm text-gray-600 mt-1">
                Enter the 6-digit OTP sent to your email and set a new password
              </p>
              {email && (
                <div className="mt-3 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <p className="text-xs text-primary">
                    OTP sent to: <span className="font-semibold">{email}</span>
                  </p>
                </div>
              )}
            </div>

            <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
              {/* OTP */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Enter 6-digit OTP"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-primary/90 text-center tracking-widest font-mono"
                  value={formData.otp}
                  onChange={(e) => {
                    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
                    handleInputChange("otp", value);
                  }}
                  maxLength={6}
                  required
                  disabled={loading}
                />
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
              </div>

              {/* New Password */}
              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder="New Password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                  value={formData.newPassword}
                  onChange={(e) => handleInputChange("newPassword", e.target.value)}
                  required
                  disabled={loading}
                />
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
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

              {/* Confirm Password */}
              <div className="relative">
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="Confirm New Password"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-primary"
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
                  required
                  disabled={loading}
                />
                <MdLock className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                <button
                  type="button"
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                  onClick={() => setShowConfirmPassword((prev) => !prev)}
                  aria-label={showConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showConfirmPassword ? (
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
                className="w-full bg-primary/90 text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-primary disabled:opacity-50 cursor-pointer transition-colors"
              >
                {loading ? "Resetting..." : "Reset Password"}
              </button>
            </form>

            {/* Resend OTP */}
            <div className="text-center mt-4">
              <button
                type="button"
                onClick={handleResendOTP}
                disabled={resendingOtp || loading}
                className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium text-sm cursor-pointer disabled:opacity-50"
              >
                {resendingOtp ? "Resending OTP..." : "Didn't receive OTP? Resend"}
              </button>
            </div>

            <div className="text-center text-gray-600 text-sm mt-4">
              Remember your password?{" "}
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

export default ResetPassword;
