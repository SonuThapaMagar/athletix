import { useState } from "react";
import { useNavigate } from "react-router-dom";
import PromoContent from "@/components/auth/PromoContent";
import { REGISTER_ACTION } from "@/redux/actions/auth.actions";
import { toast } from "sonner";
import {
  MdVisibility,
  MdVisibilityOff,
  MdLocationOn,
  MdPhone,
  MdEmail,
  MdPerson,
} from "react-icons/md";
import type { IUser } from "@/types/user.types/user.types";
import loginBg from "@/assets/landing/hero-bg.png";
import logo from "@/assets/landing/final_logo-removebg-preview.png";
import {
  registerSchema,
  type RegisterSchemaType,
} from "@/validation/auth.validation";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const Signup = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // const [formData, setFormData] = useState<Partial<IUser>>({
  //   name: "",
  //   email: "",
  //   password: "",
  //   phone: "",
  //   location: "",
  //   role: "PLAYER",
  // });

  const {
    register,
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterSchemaType>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      location: "",
      role: "PLAYER",
    },
  });

  // const handleInputChange = (field: keyof IUser, value: string) => {
  //   setFormData((prev) => ({ ...prev, [field]: value }));
  // };

  const handleFormSubmit = async (data: RegisterSchemaType) => {
    setLoading(true);
    try {
      // const user: IUser = {
      //   name: formData.name || "",
      //   email: formData.email || "",
      //   password: formData.password || "",
      //   phone: formData.phone || "",
      //   location: formData.location || "",
      //   role: (formData.role as IUser["role"]) || "PLAYER",
      // };

      // registerSchema.parse(formData);
      // await REGISTER_ACTION(user);
      await REGISTER_ACTION(data as any);

      // Reset the form
      // setFormData({
      //   name: "",
      //   email: "",
      //   password: "",
      //   phone: "",
      //   location: "",
      //   role: "PLAYER",
      // });

      // Make sure no old tokens exist
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      localStorage.removeItem("userRole");

      toast.success("Account created successfully! Please login to continue.");

      // Navigate to login
      navigate("/login");
    } catch (err: any) {
      if (err?.errors) {
        toast.error(err.errors[0].message);
      } else {
        toast.error(
          err?.response?.data?.message ||
            "Registration failed. Please try again.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-dvh flex relative overflow-hidden bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: `url(${loginBg})` }}
    >
      {" "}
      <div className="flex flex-col lg:flex-row w-full gap-8 px-4 py-8">
        {/* Promo Section */}
        <div className="hidden lg:flex lg:w-3/5 items-center justify-center">
          <div className="max-w-lg">
            <PromoContent />
          </div>
        </div>

        {/* Signup Form */}
        <div className="lg:w-2/5 flex items-center justify-center">
          <div className="bg-white rounded-xl shadow-lg border w-full max-w-md p-6 sm:p-8">
            <div className="text-center mb-6">
              {/* Logo */}
              <img
                src={logo}
                alt="Athletix Logo"
                className="mx-auto h-12 w-auto mb-3"
              />

              <h2 className="text-2xl font-bold text-gray-800">Sign Up</h2>
              <p className="text-sm text-gray-600 mt-1">Join Athletix today</p>
            </div>

            <form
              className="flex flex-col gap-4"
              onSubmit={handleSubmit(handleFormSubmit)}
            >
              {/* Name */}
              <div className="relative">
                <input
                  {...register("name")}
                  placeholder="Full Name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-primary"
                />
                <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {errors.name && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="relative">
                <input
                  {...register("email")}
                  placeholder="Email Address"
                  className="w-full border px-4 py-3 pl-10 rounded-lg"
                />
                <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="relative">
                <input
                  {...register("phone")}
                  placeholder="Phone Number"
                  className="w-full border px-4 py-3 pl-10 rounded-lg"
                />
                <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {errors.phone && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.phone.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div className="relative">
                <input
                  {...register("password")}
                  type={showPassword ? "text" : "password"}
                  placeholder="Password"
                  className="w-full border px-4 py-3 pl-10 pr-10 rounded-lg"
                />
                <svg
                  className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
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
                {errors.password && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              {/* Location */}
              <div className="relative">
                <input
                  {...register("location")}
                  placeholder="Location"
                  className="w-full border px-4 py-3 pl-10 rounded-lg"
                />
                <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
                {errors.location && (
                  <p className="text-red-500 text-xs mt-1">
                    {errors.location.message}
                  </p>
                )}
              </div>

              {/* Role Selector */}
              <Controller
                name="role"
                control={control}
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>

                    <SelectContent>
                      <SelectItem value="PLAYER">Player</SelectItem>
                      <SelectItem value="VENUE_OWNER">Venue Owner</SelectItem>
                      <SelectItem value="ADMIN">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                )}
              />

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2
             bg-primary text-white py-3 px-4 rounded-lg
             font-semibold text-sm uppercase tracking-wide
             hover:bg-[#1e3d6f]
             disabled:opacity-70 cursor-pointer
             transition-all"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                    Signing Up...
                  </>
                ) : (
                  "SIGN UP"
                )}
              </button>
            </form>

            <div className="text-center text-gray-600 text-sm mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-primary cursor-pointer font-semibold hover:underline"
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
