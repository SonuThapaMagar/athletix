import { useState, useEffect, type JSX } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  MdArrowBack,
  MdSave,
  MdCancel,
  MdAttachMoney,
  MdSportsSoccer,
  MdImage,
  MdPhone,
  MdEmail,
  MdSchedule,
} from "react-icons/md";
import requests from "@/helper/requests";
import { toast } from "sonner";
import type {
  VenueFormData,
  VenueSubmitData,
  VenueFormErrors,
} from "@/types/venue.types/venue.types";
import { availableAmenities, availableSports } from "./venueConstants";
import { useDispatch } from "react-redux";
import { uploadImageToCloudinary } from "@/helper/cloudinary";
import {
  CREATE_VENUE_ACTION,
  UPDATE_VENUE_ACTION,
} from "@/redux/actions/venue/venue.actions";
import { venueSchema } from "@/validation/venueCreation.validation";
import { Skeleton } from "@/components/ui/skeleton";

const initialOperatingHours = [
  { day: "Monday", openTime: "06:00", closeTime: "22:00" },
  { day: "Tuesday", openTime: "06:00", closeTime: "22:00" },
  { day: "Wednesday", openTime: "06:00", closeTime: "22:00" },
  { day: "Thursday", openTime: "06:00", closeTime: "22:00" },
  { day: "Friday", openTime: "06:00", closeTime: "23:00" },
  { day: "Saturday", openTime: "07:00", closeTime: "23:00" },
  { day: "Sunday", openTime: "07:00", closeTime: "21:00" },
];

export default function VenueForm(): JSX.Element {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const isEditing = Boolean(id);
  const dispatch = useDispatch();

  // formData stores only new-file images (File[]). existingImages holds already uploaded URLs.
  const [formData, setFormData] = useState<VenueFormData>({
    name: "",
    location: "",
    pricePerHour: "",
    description: "",
    sports: [],
    amenities: [],
    operatingHours: initialOperatingHours,
    images: [],
    phone: "",
    email: "",
  });

  const [existingImages, setExistingImages] = useState<string[]>([]); // Option A: existing URLs when editing
  const [errors, setErrors] = useState<VenueFormErrors>({});
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // If editing, load venue and populate form + existingImages
  useEffect(() => {
    if (isEditing && id) {
      setLoading(true);
      requests.venueMgmt
        .getVenueById(Number(id))
        .then((res) => {
          // Handle API response structure: res.data.data or res.data
          const v = res.data.data || res.data;
          console.log("✅ Venue data fetched:", v);
          
          if (!v) {
            throw new Error("No venue data received");
          }

          setFormData((prev) => ({
            ...prev,
            name: v.name ?? "",
            location: v.location ?? "",
            pricePerHour:
              v.pricePerHour != null ? v.pricePerHour.toString() : "",
            description: v.description ?? "",
            sports: v.sports ?? [],
            amenities: v.amenities ?? [],
            // if backend provides operatingHours as array use it, otherwise keep defaults
            operatingHours: v.operatingHours?.length
              ? v.operatingHours
              : prev.operatingHours,
            phone: v.phone ?? "",
            email: v.email ?? "",
            images: [], // keep empty; new files go here
          }));

          // Load existing image URLs into separate state so user can remove them
          setExistingImages(Array.isArray(v.images) ? v.images : []);
        })
        .catch((err) => {
          console.error("❌ Failed to load venue data:", err);
          toast.error(err?.response?.data?.message || "Failed to load venue data");
          navigate("/venue-owner/venues");
        })
        .finally(() => setLoading(false));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id, isEditing]);

  const handleInputChange = (field: keyof VenueFormData, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field as keyof VenueFormErrors]) {
      setErrors((prev) => ({
        ...prev,
        [field as keyof VenueFormErrors]: undefined,
      }));
    }
  };

  const handleContactChange = (field: "phone" | "email", value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  const handleToggle = (type: "sports" | "amenities", value: string) => {
    setFormData((prev) => {
      const arr = prev[type] as string[];
      return {
        ...prev,
        [type]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
    const errorKey = type as keyof Pick<
      VenueFormErrors,
      "sports" | "amenities"
    >;
    if (errors[errorKey])
      setErrors((prev) => ({ ...prev, [errorKey]: undefined }));
  };

  const handleOperatingHoursChange = (
    day: string,
    field: "openTime" | "closeTime",
    value: string
  ) => {
    setFormData((prev) => ({
      ...prev,
      operatingHours: prev.operatingHours.map((oh) =>
        oh.day === day ? { ...oh, [field]: value } : oh
      ),
    }));
  };

  // Add new File[] (user chosen files). We append to allow multiple selects across interactions.
  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;
    setFormData((prev) => ({ ...prev, images: [...prev.images, ...files] }));
    if (errors.images) setErrors((prev) => ({ ...prev, images: undefined }));
  };

  // Remove a newly selected file (before upload)
  const removeNewImage = (index: number) => {
    setFormData((prev) => {
      const next = [...prev.images];
      next.splice(index, 1);
      return { ...prev, images: next };
    });
  };

  // Remove an existing image URL (Option A)
  const removeExistingImage = (url: string) => {
    setExistingImages((prev) => prev.filter((u) => u !== url));
  };

  const validateForm = (): boolean => {
    // Use zod schema but we must adapt images: supply File[] (formData.images) — existingImages are URLs so excluded
    const validationTarget: any = {
      ...formData,
      images: formData.images.length ? formData.images : undefined,
    };

    const parseResult = venueSchema.safeParse(validationTarget);
    if (!parseResult.success) {
      const errs: VenueFormErrors = {};
      parseResult.error.issues.forEach((err) => {
        const field = err.path[0] as keyof VenueFormErrors;
        errs[field] = err.message;
      });
      setErrors(errs);
      return false;
    }
    setErrors({});
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);

    // Validate
    if (!validateForm()) {
      toast.error("Please fix the highlighted fields");
      setIsSubmitting(false);
      return;
    }

    try {
      // Upload only new files (if any) in parallel
      const uploadedUrls =
        formData.images && formData.images.length
          ? await Promise.all(
              formData.images.map((f) => uploadImageToCloudinary(f))
            )
          : [];

      // Final image list = remaining existing images (user might have removed some) + newly uploaded
      const finalImages = [...existingImages, ...uploadedUrls];

      // Build payload
      const payload: VenueSubmitData = {
        name: formData.name,
        location: formData.location,
        sports: formData.sports,
        pricePerHour: Number(formData.pricePerHour),
        description: formData.description,
        images: finalImages,
        amenities: formData.amenities,
        operatingHours: formData.operatingHours,
        phone: formData.phone,
        email: formData.email,
      };

      if (!isEditing) {
        // CREATE
        await CREATE_VENUE_ACTION(payload);
        toast.success("Venue created successfully");
      } else {
        await UPDATE_VENUE_ACTION(Number(id), payload);
        toast.success("Venue updated successfully");
        navigate("/venue-owner/venues");
      }

      // Redirect to venues list after showing toast
      setTimeout(() => {
        navigate("/venue-owner/venues");
      }, 1000);
    } catch (err: any) {
      console.error("Submit error:", err);
      toast.error(err?.response?.data?.message || "Failed to submit venue");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => navigate("/venue-owner/venues");

  if (loading) {
    return (
      <div className="p-6">
        <div className="flex items-center gap-4 mb-6">
          <Skeleton className="w-10 h-10 rounded-lg" />
          <Skeleton className="h-8 w-48" />
        </div>
        
        <div className="max-w-4xl mx-auto space-y-6">
          {/* Basic Info Skeleton */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-24 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-32 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="md:col-span-2">
                <Skeleton className="h-4 w-28 mb-2" />
                <Skeleton className="h-24 w-full" />
              </div>
            </div>
            <div className="mt-4">
              <Skeleton className="h-4 w-32 mb-2" />
              <Skeleton className="h-24 w-full" />
            </div>
          </div>

          {/* Sports & Amenities Skeleton */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow border">
              <Skeleton className="h-6 w-40 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
            <div className="bg-white p-6 rounded-2xl shadow border">
              <Skeleton className="h-6 w-32 mb-4" />
              <div className="grid grid-cols-2 gap-2">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Skeleton key={i} className="h-6 w-full" />
                ))}
              </div>
            </div>
          </div>

          {/* Operating Hours Skeleton */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <Skeleton className="h-6 w-40 mb-4" />
            <div className="space-y-4">
              {[1, 2, 3, 4, 5, 6, 7].map((i) => (
                <div key={i} className="flex items-center gap-4">
                  <Skeleton className="h-4 w-20" />
                  <Skeleton className="h-10 w-32" />
                  <Skeleton className="h-4 w-4" />
                  <Skeleton className="h-10 w-32" />
                </div>
              ))}
            </div>
          </div>

          {/* Contact Info Skeleton */}
          <div className="bg-white p-6 rounded-2xl shadow border">
            <Skeleton className="h-6 w-48 mb-4" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Skeleton className="h-4 w-20 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div>
                <Skeleton className="h-4 w-16 mb-2" />
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          </div>

          {/* Buttons Skeleton */}
          <div className="flex justify-end gap-4 pt-4">
            <Skeleton className="h-10 w-24" />
            <Skeleton className="h-10 w-32" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={handleCancel}
          className="p-2 rounded-lg hover:bg-gray-100"
        >
          <MdArrowBack className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold">
          {isEditing ? "Edit Venue" : "Add New Venue"}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className="max-w-4xl mx-auto space-y-6">
        {/* Basic Info */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <MdSportsSoccer /> Basic Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block mb-2 text-sm font-medium">
                Venue Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.name ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter venue name"
              />
              {errors.name && (
                <p className="text-red-500 text-sm mt-1">{errors.name}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Location *
              </label>
              <input
                type="text"
                value={formData.location}
                onChange={(e) => handleInputChange("location", e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.location ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="City"
              />
              {errors.location && (
                <p className="text-red-500 text-sm mt-1">{errors.location}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 text-sm font-medium">
                Price per Hour *
              </label>
              <div className="relative">
                <MdAttachMoney className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="number"
                  value={formData.pricePerHour}
                  onChange={(e) =>
                    handleInputChange("pricePerHour", e.target.value)
                  }
                  required
                  className={`w-full p-3 pl-10 border rounded-lg focus:ring-2 ${
                    errors.pricePerHour ? "border-red-500" : "border-gray-300"
                  }`}
                  placeholder="0"
                  min="0"
                  step="any"
                />
              </div>
              {errors.pricePerHour && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.pricePerHour}
                </p>
              )}
            </div>

            <div className="md:col-span-2">
              <label className="block mb-2 text-sm font-medium">
                Description *
              </label>
              <textarea
                value={formData.description}
                onChange={(e) =>
                  handleInputChange("description", e.target.value)
                }
                rows={4}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.description ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Describe your venue"
              />
              {errors.description && (
                <p className="text-red-500 text-sm mt-1">
                  {errors.description}
                </p>
              )}
            </div>
          </div>

          {/* Image Upload */}
          <div className="mt-4">
            <label className="flex items-center gap-2 mb-2 text-sm font-medium">
              <MdImage /> Venue Images
            </label>

            {/* Existing images preview (editing) */}
            {existingImages.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {existingImages.map((url) => (
                  <div
                    key={url}
                    className="relative w-32 h-24 rounded overflow-hidden border"
                  >
                    <img
                      src={url}
                      alt="existing"
                      className="object-cover w-full h-full"
                    />
                    <button
                      type="button"
                      onClick={() => removeExistingImage(url)}
                      className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs shadow"
                      title="Remove image"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            )}

            {/* New files preview */}
            {formData.images.length > 0 && (
              <div className="flex gap-2 flex-wrap mb-2">
                {formData.images.map((f, idx) => {
                  const url = URL.createObjectURL(f);
                  return (
                    <div
                      key={idx}
                      className="relative w-32 h-24 rounded overflow-hidden border"
                    >
                      <img
                        src={url}
                        alt={f.name}
                        className="object-cover w-full h-full"
                      />
                      <button
                        type="button"
                        onClick={() => removeNewImage(idx)}
                        className="absolute top-1 right-1 bg-white rounded-full p-1 text-xs shadow"
                        title="Remove file"
                      >
                        ✕
                      </button>
                    </div>
                  );
                })}
              </div>
            )}

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handleImageChange}
              className="w-full border p-3 rounded-lg"
            />
            {errors.images && (
              <p className="text-red-500 text-sm mt-1">{errors.images}</p>
            )}
          </div>
        </div>

        {/* Sports & Amenities */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-lg font-semibold mb-4">Available Sports *</h2>
            <div className="grid grid-cols-2 gap-2">
              {availableSports.map((sport) => (
                <label key={sport} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.sports.includes(sport)}
                    onChange={() => handleToggle("sports", sport)}
                  />
                  <span>{sport}</span>
                </label>
              ))}
            </div>
            {errors.sports && (
              <p className="text-red-500 text-sm mt-1">{errors.sports}</p>
            )}
          </div>

          <div className="bg-white p-6 rounded-2xl shadow border">
            <h2 className="text-lg font-semibold mb-4">Amenities</h2>
            <div className="grid grid-cols-2 gap-2">
              {availableAmenities.map((amenity) => (
                <label key={amenity} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={formData.amenities.includes(amenity)}
                    onChange={() => handleToggle("amenities", amenity)}
                  />
                  <span>{amenity}</span>
                </label>
              ))}
            </div>
            {errors.amenities && (
              <p className="text-red-500 text-sm mt-1">{errors.amenities}</p>
            )}
          </div>
        </div>

        {/* Operating Hours */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            <MdSchedule /> Operating Hours
          </h2>
          <div className="space-y-4">
            {formData.operatingHours.map((hours) => (
              <div key={hours.day} className="flex items-center gap-4">
                <span className="w-20 font-medium">{hours.day}</span>
                <div className="flex gap-2">
                  <input
                    type="time"
                    value={hours.openTime}
                    onChange={(e) =>
                      handleOperatingHoursChange(
                        hours.day,
                        "openTime",
                        e.target.value
                      )
                    }
                    required
                    className="p-2 border rounded-lg focus:ring-2"
                  />
                  <span>to</span>
                  <input
                    type="time"
                    value={hours.closeTime}
                    onChange={(e) =>
                      handleOperatingHoursChange(
                        hours.day,
                        "closeTime",
                        e.target.value
                      )
                    }
                    required
                    className="p-2 border rounded-lg focus:ring-2"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Contact Info */}
        <div className="bg-white p-6 rounded-2xl shadow border">
          <h2 className="flex items-center gap-2 text-lg font-semibold mb-4">
            Contact Information *
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium">
                <MdPhone /> Phone *
              </label>
              <input
                type="tel"
                value={formData.phone}
                onChange={(e) => handleContactChange("phone", e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.phone ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter phone number"
              />
              {errors.phone && (
                <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
              )}
            </div>

            <div>
              <label className="flex items-center gap-2 mb-2 text-sm font-medium">
                <MdEmail /> Email *
              </label>
              <input
                type="email"
                value={formData.email}
                onChange={(e) => handleContactChange("email", e.target.value)}
                required
                className={`w-full p-3 border rounded-lg focus:ring-2 ${
                  errors.email ? "border-red-500" : "border-gray-300"
                }`}
                placeholder="Enter email address"
              />
              {errors.email && (
                <p className="text-red-500 text-sm mt-1">{errors.email}</p>
              )}
            </div>
          </div>
        </div>

        {/* Submit Buttons */}
        <div className="flex justify-end gap-4 pt-4">
          <button
            type="button"
            onClick={handleCancel}
            className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            <MdCancel className="inline mr-2" /> Cancel
          </button>
          <button
            type="submit"
            disabled={isSubmitting}
            className="bg-[#2c5aa0] text-white px-6 py-2 rounded-lg hover:bg-[#1e3d6f] disabled:opacity-50 flex items-center gap-2"
          >
            <MdSave className="w-4 h-4" />
            {isSubmitting ? "Saving..." : "Save Venue"}
          </button>
        </div>
      </form>
    </div>
  );
}
