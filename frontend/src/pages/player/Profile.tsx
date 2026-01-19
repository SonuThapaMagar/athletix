import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import {
  MdArrowBack,
  MdEdit,
  MdSave,
  MdCancel,
  MdEmail,
  MdPhone,
  MdLocationOn,
  MdSportsSoccer,
  MdStar,
  MdEmojiEvents,
  MdHistory,
  MdErrorOutline,
  MdVerifiedUser,
} from "react-icons/md";
import PlayerNavLayout from "@/layout/PlayerNavLayout";
import {
  FETCH_PROFILE,
  UPDATE_PROFILE_ACTION,
} from "@/redux/actions/user.actions";
import { toast } from "sonner";
import { Skeleton } from "@/components/ui/skeleton";
import type { StateType } from "@/redux/slices";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";

interface ProfileFormData {
  name: string;
  phone: string;
  location: string;
  bio: string;
}

interface ValidationErrors {
  name?: string;
  phone?: string;
  location?: string;
  bio?: string;
}

const Profile = () => {
  const navigate = useNavigate();
  const { profile } = useSelector((state: StateType) => state.authSlice);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<ProfileFormData>({
    name: "",
    phone: "",
    location: "",
    bio: "",
  });
  const [errors, setErrors] = useState<ValidationErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return undefined; // Optional field
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    if (name.trim().length > 50) return "Name must be less than 50 characters";
    if (!/^[a-zA-Z\s'-]+$/.test(name.trim()))
      return "Name can only contain letters, spaces, hyphens, and apostrophes";
    return undefined;
  };

  const validatePhone = (phone: string): string | undefined => {
    if (!phone.trim()) return undefined; // Optional field
    // Remove spaces, dashes, and parentheses for validation
    const cleanedPhone = phone.replace(/[\s\-\(\)]/g, "");
    // Allow formats: +1234567890, 1234567890, (123) 456-7890, etc.
    if (!/^[\+]?[0-9]{7,15}$/.test(cleanedPhone)) {
      return "Please enter a valid phone number (7-15 digits)";
    }
    return undefined;
  };

  const validateLocation = (location: string): string | undefined => {
    if (!location.trim()) return undefined; // Optional field
    if (location.trim().length < 2)
      return "Location must be at least 2 characters";
    if (location.trim().length > 100)
      return "Location must be less than 100 characters";
    return undefined;
  };

  const validateBio = (bio: string): string | undefined => {
    if (!bio.trim()) return undefined; // Optional field
    if (bio.trim().length < 10) return "Bio must be at least 10 characters";
    if (bio.trim().length > 500) return "Bio must be less than 500 characters";
    return undefined;
  };

  // Validate all fields
  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {};

    if (touched.name || formData.name) {
      const nameError = validateName(formData.name);
      if (nameError) newErrors.name = nameError;
    }

    if (touched.phone || formData.phone) {
      const phoneError = validatePhone(formData.phone);
      if (phoneError) newErrors.phone = phoneError;
    }

    if (touched.location || formData.location) {
      const locationError = validateLocation(formData.location);
      if (locationError) newErrors.location = locationError;
    }

    if (touched.bio || formData.bio) {
      const bioError = validateBio(formData.bio);
      if (bioError) newErrors.bio = bioError;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Fetch profile on mount
  useEffect(() => {
    const loadProfile = async () => {
      if (!profile) {
        setIsLoading(true);
        try {
          const fetchedProfile = await FETCH_PROFILE();
          // Set form data immediately after fetching
          if (fetchedProfile) {
            setFormData({
              name: fetchedProfile.name || "",
              phone: fetchedProfile.phone || "",
              location: fetchedProfile.location || "",
              bio: "",
            });
          }
        } catch (err: any) {
          console.error("Failed to fetch profile:", err);
          toast.error(
            err?.response?.data?.message ||
              err?.message ||
              "Failed to load profile",
          );
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadProfile();
  }, [profile]);

  // Update form data when profile loads or changes
  useEffect(() => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: "", // Bio might not be in IUserProfile, keeping for future
      });
      // Only reset errors and touched when profile changes, not when entering edit mode
      if (!isEditing) {
        setErrors({});
        setTouched({});
      }
    }
  }, [profile]);

  // Validate on form data change
  useEffect(() => {
    if (isEditing) {
      validateForm();
    }
  }, [formData, touched, isEditing]);

  const handleEdit = () => {
    // Ensure form data is populated from profile before entering edit mode
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: "",
      });
    }
    setIsEditing(true);
    setTouched({});
    setErrors({});
  };

  const handleSave = async () => {
    if (!profile) return;

    // Mark all fields as touched to show validation errors
    setTouched({
      name: true,
      phone: true,
      location: true,
      bio: true,
    });

    // Validate form
    if (!validateForm()) {
      toast.error("Please fix the validation errors before saving");
      return;
    }

    setIsSaving(true);
    try {
      const updateData: { name?: string; phone?: string; location?: string } =
        {};

      // Only include fields that have changed and are valid
      const trimmedName = formData.name.trim();
      const trimmedPhone = formData.phone.trim();
      const trimmedLocation = formData.location.trim();

      // Name: send if changed or if clearing (empty string)
      if (trimmedName !== (profile.name || "")) {
        if (trimmedName) {
          updateData.name = trimmedName;
        } else {
          // Allow clearing name if it was previously set
          updateData.name = "";
        }
      }

      // Phone: send if changed or if clearing
      if (trimmedPhone !== (profile.phone || "")) {
        if (trimmedPhone) {
          updateData.phone = trimmedPhone;
        } else {
          updateData.phone = "";
        }
      }

      // Location: send if changed or if clearing
      if (trimmedLocation !== (profile.location || "")) {
        if (trimmedLocation) {
          updateData.location = trimmedLocation;
        } else {
          updateData.location = "";
        }
      }

      // Only make API call if there are changes
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        toast.info("No changes to save");
        return;
      }

      await UPDATE_PROFILE_ACTION(updateData);
      toast.success("Profile updated successfully");
      setIsEditing(false);
      setTouched({});
      setErrors({});
      // Redirect to dashboard after successful update
      setTimeout(() => {
        navigate("/player");
      }, 1000);
    } catch (err: any) {
      console.error("Failed to update profile:", err);
      toast.error(
        err?.response?.data?.message ||
          err?.message ||
          "Failed to update profile",
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setFormData({
        name: profile.name || "",
        phone: profile.phone || "",
        location: profile.location || "",
        bio: "",
      });
    }
    setIsEditing(false);
    setTouched({});
    setErrors({});
  };

  const handleInputChange = (field: keyof ProfileFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
    // Mark field as touched when user starts typing
    if (!touched[field]) {
      setTouched((prev) => ({ ...prev, [field]: true }));
    }
  };

  const handleBlur = (field: keyof ProfileFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    validateForm();
  };

  if (isLoading || !profile) {
    return (
      <div className="min-h-screen bg-gray-50">
        <PlayerNavLayout />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          {/* Header Skeleton */}
          <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50 mb-6">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <Skeleton className="h-16 w-full" />
            </div>
          </div>

          {/* Profile Header Card Skeleton */}
          <div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 mb-6">
            <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6">
              <Skeleton className="w-24 h-24 rounded-2xl" />
              <div className="flex-1 w-full">
                <Skeleton className="h-8 w-48 mb-2" />
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-4 w-40" />
              </div>
              <Skeleton className="h-10 w-32" />
            </div>
          </div>

          {/* Content Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="space-y-6">
              <Skeleton className="h-48 rounded-2xl" />
              <Skeleton className="h-64 rounded-2xl" />
            </div>
            <div className="lg:col-span-2 space-y-6">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[1, 2, 3, 4].map((i) => (
                  <Skeleton key={i} className="h-32 rounded-2xl" />
                ))}
              </div>
              <Skeleton className="h-48 rounded-2xl" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  const currentProfile = profile;
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <PlayerNavLayout />
      {/* Loading overlay when saving */}
      {isSaving && (
        <div className="fixed inset-0 bg-black/20 backdrop-blur-sm z-50 flex items-center justify-center">
          <div className="bg-white rounded-2xl shadow-xl p-6 max-w-sm w-full mx-4">
            <div className="flex items-center gap-4">
              <div className="w-8 h-8 border-4 border-[#2c5aa0] border-t-transparent rounded-full animate-spin"></div>
              <div>
                <h3 className="font-semibold text-gray-900">Saving Profile</h3>
                <p className="text-sm text-gray-600">Please wait...</p>
              </div>
            </div>
          </div>
        </div>
      )}
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-md shadow-sm border-b border-gray-200/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
            >
              <MdArrowBack className="w-5 h-5" />
              <span className="hidden sm:inline">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Profile</h1>
            <div className="w-20"></div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Profile Card */}
        <Card className="p-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          {/* Avatar */}
          <div className="w-24 h-24 bg-primary rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg">
            {currentProfile.name?.charAt(0).toUpperCase() || "U"}
          </div>

          {/* Info */}
          <div className="flex-1 w-full text-center sm:text-left space-y-2">
            <div className="flex items-center gap-2 text-gray-600">
              <MdVerifiedUser />
              {isEditing ? (
                <Input
                  value={formData.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  placeholder="Name"
                />
              ) : (
                <h2 className="text-2xl font-bold">
                  {currentProfile.name || "No name set"}
                </h2>
              )}
            </div>
            <div className="flex items-center gap-2 text-gray-600">
              <MdLocationOn />
              {isEditing ? (
                <Input
                  value={formData.location}
                  onChange={(e) =>
                    handleInputChange("location", e.target.value)
                  }
                  placeholder="Location"
                />
              ) : (
                <span>{currentProfile.location || "No location set"}</span>
              )}
            </div>

            <div className="flex items-center gap-2 text-gray-600">
              <MdEmail /> {currentProfile.email}
            </div>
          </div>

          {/* Actions */}
          <div className="w-full sm:w-auto flex gap-2">
            {isEditing ? (
              <>
                <button
                  onClick={handleSave}
                  className="flex items-center cursor-pointer gap-2 bg-primary text-white py-2 px-4 rounded-xl hover:bg-primary/90"
                >
                  <MdSave /> Save
                </button>
                <button
                  onClick={handleCancel}
                  className="flex items-center cursor-pointer gap-2 border border-gray-300 text-gray-700 py-2 px-4 rounded-xl hover:bg-gray-50"
                >
                  <MdCancel /> Cancel
                </button>
              </>
            ) : (
              <button
                onClick={handleEdit}
                className="flex items-center cursor-pointer gap-2 bg-primary text-white py-2 px-6 rounded-xl hover:shadow-lg"
              >
                <MdEdit /> Edit Profile
              </button>
            )}
          </div>
        </Card>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* LEFT COLUMN */}
          <div className="space-y-6">
            {/* ABOUT */}
            <Card>
              <CardHeader>
                <CardTitle>About</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {isEditing ? (
                  <>
                    <Textarea
                      value={formData.bio}
                      onChange={(e) => handleInputChange("bio", e.target.value)}
                      placeholder="Tell us about yourself..."
                      maxLength={500}
                      rows={4}
                    />
                    <p className="text-xs text-muted-foreground text-right">
                      {formData.bio.length}/500
                    </p>
                  </>
                ) : (
                  <p className="text-sm text-muted-foreground">
                    {formData.bio || "No bio added yet."}
                  </p>
                )}
              </CardContent>
            </Card>

            {/* CONTACT INFO */}
            <Card>
              <CardHeader>
                <CardTitle>Contact Info</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Email */}
                <div className="flex items-center gap-3">
                  <MdEmail className="text-muted-foreground" />
                  <span className="text-sm">{currentProfile.email}</span>
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <MdPhone /> Phone
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.phone}
                      onChange={(e) =>
                        handleInputChange("phone", e.target.value)
                      }
                      placeholder="Phone number"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {currentProfile.phone || "Not provided"}
                    </p>
                  )}
                </div>

                {/* Location */}
                <div className="space-y-1">
                  <Label className="flex items-center gap-2">
                    <MdLocationOn /> Location
                  </Label>
                  {isEditing ? (
                    <Input
                      value={formData.location}
                      onChange={(e) =>
                        handleInputChange("location", e.target.value)
                      }
                      placeholder="City, Area"
                    />
                  ) : (
                    <p className="text-sm text-muted-foreground">
                      {currentProfile.location || "Not set"}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* RIGHT COLUMN */}
          <div className="lg:col-span-2 space-y-6">
            {/* STATS */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { icon: MdSportsSoccer, label: "Games", value: "-" },
                { icon: MdEmojiEvents, label: "Wins", value: "-" },
                { icon: MdStar, label: "Win Rate", value: "-" },
                { icon: MdHistory, label: "Hours", value: "-" },
              ].map((stat, i) => (
                <Card key={i} className="text-center">
                  <CardContent className="pt-6 space-y-2">
                    <stat.icon className="mx-auto text-primary" size={28} />
                    <div className="text-xl font-semibold">{stat.value}</div>
                    <p className="text-xs text-muted-foreground">
                      {stat.label}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* ACCOUNT INFO */}
            <Card>
              <CardHeader>
                <CardTitle>Account Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">User ID</span>
                  <span className="font-medium">{currentProfile.userId}</span>
                </div>

                <Separator />

                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Role</span>
                  <Badge variant="secondary">
                    {currentProfile.role || "PLAYER"}
                  </Badge>
                </div>

                <Separator />

                <div className="flex justify-between">
                  <span className="text-muted-foreground">Email</span>
                  <span className="font-medium">{currentProfile.email}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
