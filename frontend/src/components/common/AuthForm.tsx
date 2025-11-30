// import type {  IUser } from "@/types/user.types/user.types";
// import { useState } from "react";
// import {
//   MdVisibility,
//   MdVisibilityOff,
//   MdLocationOn,
//   MdPhone,
//   MdEmail,
//   MdPerson,
// } from "react-icons/md";

// type AuthFormProps = {
//   mode: "login" | "signup";
//   formData: Partial<IUser>;
//   setFormData: React.Dispatch<React.SetStateAction<Partial<IUser>>>;
//   loading?: boolean;
//   onSubmit: () => void;
// };

// const AuthForm = ({ mode, formData, setFormData, loading = false, onSubmit }: AuthFormProps) => {
//   const [showPassword, setShowPassword] = useState(false);

//   const handleInputChange = (field: keyof IUser, value: string) => {
//     setFormData((prev) => ({ ...prev, [field]: value }));
//   };

//   const handleSubmit = (e: React.FormEvent) => {
//     e.preventDefault();
//     onSubmit();
//   };

//   return (
//     <div className="flex flex-col gap-6">
//       {/* Form Title */}
//       <div className="text-center mb-2">
//         <h2 className="text-2xl font-bold text-gray-800">
//           {mode === "login" ? "Login" : "Sign Up"}
//         </h2>
//         <p className="text-sm text-gray-600 mt-1">
//           {mode === "login"
//             ? "Welcome back to Athletix"
//             : "Join Athletix today"}
//         </p>
//       </div>

//       <form onSubmit={handleSubmit} className="flex flex-col gap-6">
//         {/* Title */}
//         <div className="text-center mb-2">
//           <h2 className="text-2xl font-bold text-gray-800">
//             {mode === "login" ? "Login" : "Sign Up"}
//           </h2>
//           <p className="text-sm text-gray-600 mt-1">
//             {mode === "login" ? "Welcome back" : "Join us today"}
//           </p>
//         </div>

//         {/* Full Name */}
//         {mode === "signup" && (
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Full Name"
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
//               value={formData.name}
//               onChange={(e) => handleInputChange("name", e.target.value)}
//             />
//             <MdPerson className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           </div>
//         )}

//         {/* Email */}
//         <div className="relative">
//           <input
//             type="email"
//             placeholder="Email Address"
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
//             value={formData.email}
//             onChange={(e) => handleInputChange("email", e.target.value)}
//           />
//           <MdEmail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//         </div>

//         {/* Phone */}
//         {mode === "signup" && (
//           <div className="relative">
//             <input
//               type="tel"
//               placeholder="Phone Number"
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
//               value={formData.phone}
//               onChange={(e) => handleInputChange("phone", e.target.value)}
//             />
//             <MdPhone className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           </div>
//         )}

//         {/* Password */}
//         <div className="relative">
//           <input
//             type={showPassword ? "text" : "password"}
//             placeholder="Password"
//             className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 pr-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
//             value={formData.password}
//             onChange={(e) => handleInputChange("password", e.target.value)}
//           />
//           <button
//             type="button"
//             className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
//             onClick={() => setShowPassword((prev) => !prev)}
//           >
//             {showPassword ? (
//               <MdVisibilityOff className="w-5 h-5" />
//             ) : (
//               <MdVisibility className="w-5 h-5" />
//             )}
//           </button>
//           <MdVisibility className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//         </div>

//         {/* Location */}
//         {mode === "signup" && (
//           <div className="relative">
//             <input
//               type="text"
//               placeholder="Location"
//               className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 text-sm focus:outline-none focus:border-[#2c5aa0]"
//               value={formData.location}
//               onChange={(e) => handleInputChange("location", e.target.value)}
//             />
//             <MdLocationOn className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5" />
//           </div>
//         )}

//         {/* Role Selector */}
//         <select
//           value={formData.role}
//           onChange={(e) => handleInputChange("role", e.target.value)}
//           className="w-full border p-2 rounded-lg"
//         >
//           <option value="PLAYER">Player</option>
//           <option value="VENUE_OWNER">Venue Owner</option>
//           <option value="ADMIN">Admin</option>
//         </select>

//         {/* Forgot Password */}
//         {mode === "login" && (
//           <div className="flex justify-end">
//             <button
//               type="button"
//               className="text-[#2c5aa0] text-sm font-semibold hover:underline"
//             >
//               Forgot Password?
//             </button>
//           </div>
//         )}

//         {/* Submit */}
//         <button
//           type="submit"
//           disabled={loading}
//           className="w-full bg-[#2c5aa0] text-white py-3 px-4 rounded-lg font-semibold text-sm uppercase tracking-wide hover:bg-[#1e3d6f] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
//         >
//           {loading
//             ? mode === "login"
//               ? "Signing In..."
//               : "Signing Up..."
//             : mode === "login"
//             ? "SIGN IN"
//             : "SIGN UP"}
//         </button>
//       </form>
//     </div>
//   );
// };

// export default AuthForm;
