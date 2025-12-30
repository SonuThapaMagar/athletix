import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdEmail, MdArrowBack } from "react-icons/md";
import { SEND_OTP_ACTION } from "@/redux/actions/auth.actions";
import { toast } from "sonner";
import PromoContent from "@/components/auth/PromoContent";
import SportsAnimations from "@/components/common/SportsAnimations";

const ForgotPassword = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await SEND_OTP_ACTION(email);
      setOtpSent(true);
      toast.success("OTP has been sent to your email");
    } catch (err: any) {
      console.error("Send OTP error:", err);
      toast.error(err?.response?.data?.message || "Failed to send OTP. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendOTP = async () => {
    if (!email.trim()) {
      toast.error("Please enter your email address");
      return;
    }

    setLoading(true);
    try {
      await SEND_OTP_ACTION(email);
      toast.success("OTP has been resent to your email");
    } catch (err: any) {
      console.error("Resend OTP error:", err);
      toast.error(err?.response?.data?.message || "Failed to resend OTP. Please try again.");
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

        {/* Forgot Password Form */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <button
              onClick={() => navigate("/login")}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-4 transition-colors cursor-pointer"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="text-sm">Back to Login</span>
            </button>

            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Forgot Password</h2>
              <p className="text-sm text-gray-600 mt-1">
                {otpSent
                  ? "We've sent an OTP to your email. Please check your inbox."
                  : "Enter your email address and we'll send you an OTP to reset your password."}
              </p>
            </div>

            {!otpSent ? (
              <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
                {/* Email */}
                <div className="relative">
                  <input
                    type="email"
                    placeholder="Email Address"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    disabled={loading}
                  />
                  <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                </div>

                {/* Submit */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <div className="flex flex-col gap-4">
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <p className="text-sm text-blue-800 text-center">
                    OTP sent to: <span className="font-semibold">{email}</span>
                  </p>
                </div>

                <button
                  onClick={() => navigate(`/reset-password?email=${encodeURIComponent(email)}`)}
                  className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] transition-colors cursor-pointer"
                >
                  Continue to Reset Password
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={handleResendOTP}
                    disabled={loading}
                    className="text-[#2c5aa0] hover:text-[#1e3d6f] font-medium text-sm cursor-pointer disabled:opacity-50"
                  >
                    {loading ? "Resending..." : "Resend OTP"}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setOtpSent(false);
                    setEmail("");
                  }}
                  className="text-gray-600 hover:text-gray-900 font-medium text-sm cursor-pointer"
                >
                  Use different email
                </button>
              </div>
            )}

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

export default ForgotPassword;
