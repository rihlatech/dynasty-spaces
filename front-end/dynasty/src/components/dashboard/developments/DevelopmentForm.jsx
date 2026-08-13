import { useState , useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Save, Send } from "lucide-react";

import MediaUpload from "./MediaUpload";
import { supabase } from "../../../config/SupabaseClient";

export default function DevelopmentForm({
  mode = "create",
  developmentId,
  // mode="edit"
 }) {
  const navigate = useNavigate();

  // const {developmentId} = useParams()

  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({});

  const [formData, setFormData] = useState({
  name: "",
  slug: "",
  description: "",
  location: "",
  google_maps_url: "",
  cover_image: "",
  hero_video_url: "",
  hero_video_thumbnail: "",
  completion_date: "",
  status: "draft",
});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "name") {
      setFormData((prev) => ({
        ...prev,
        slug: value
          .toLowerCase()
          .trim()
          .replace(/[^\w\s-]/g, "")
          .replace(/\s+/g, "-")
          .replace(/-+/g, "-"),
      }));
    }

    setErrors((prev) => ({
      ...prev,
      [name]: "",
    }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.name.trim())
      newErrors.name = "Development name is required";

    if (!formData.description.trim())
      newErrors.description = "Description is required";

    if (!formData.location.trim())
      newErrors.location = "Location is required";

    if (!formData.cover_image)
      newErrors.cover_image = "Cover image is required";

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  const saveDevelopment = async (status) => {
  if (!validate()) return;

  try {
    setLoading(true);

    const {
      data: { user },
    } = await supabase.auth.getUser();


    const payload = {
      ...formData,
      status,
      updated_at: new Date().toISOString(),
    };


    if (mode === "create") {

      payload.created_by = user?.id;

      const { error } = await supabase
        .from("developments")
        .insert([payload]);

      if (error) throw error;

    } else if (mode === "edit") {

      const { error } = await supabase
        .from("developments")
        .update(payload)
        .eq("id", developmentId);

      if (error) throw error;

    }


    navigate("/admin/developments", {
      replace: true,
    });


  } catch (error) {

    console.error(error);

    alert(error.message);

  } finally {

    setLoading(false);

  }
};

useEffect(() => {
  if (mode !== "edit") return;

  const fetchDevelopment = async () => {
    const { data, error } = await supabase
      .from("developments")
      .select("*")
      .eq("id", developmentId)
      .single();

    if (error) {
      console.error(error);
      return;
    }

    setFormData({
      name: data.name || "",
      slug: data.slug || "",
      description: data.description || "",
      location: data.location || "",
      google_maps_url: data.google_maps_url || "",
      cover_image: data.cover_image || "",
      hero_video_url: data.hero_video_url || "",
      hero_video_thumbnail: data.hero_video_thumbnail || "",
      completion_date: data.completion_date || "",
      status: data.status || "draft",
    });
  };

  fetchDevelopment();
}, [mode, developmentId]);

  return (
    <form className="space-y-8">

  {/* BASIC INFORMATION */}

  <section
    className="
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      rounded-3xl
      p-8
    "
  >

    <h2 className="text-2xl font-bold text-black dark:text-white mb-8">
      Basic Information
    </h2>

    <div className="grid lg:grid-cols-2 gap-6">

      <div>

        <label className="font-semibold flex items-center gap-2 mb-2 dark:text-white">
          Development Name
          <span className="text-red-500">*</span>
        </label>

        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          placeholder="Green Valley Residences"
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-white/10
            bg-white
            dark:bg-[#1A1A1A]
            px-4
            py-3
            dark:text-white
            focus:outline-none
            focus:ring-2
            focus:ring-[#C9A758]
          "
        />

        {errors.name && (
          <p className="mt-2 text-sm text-red-500">
            {errors.name}
          </p>
        )}

      </div>

      <div>

        <label className="font-semibold mb-2 block dark:text-white">
          Slug
        </label>

        <input
          type="text"
          name="slug"
          value={formData.slug}
          onChange={handleChange}
          placeholder="green-valley-residences"
          className="
            w-full
            rounded-xl
            border
            border-gray-300
            dark:border-white/10
            bg-gray-100
            dark:bg-[#1A1A1A]
            px-4
            py-3
            dark:text-white
          "
        />

      </div>

    </div>

    <div className="mt-8">

      <label className="font-semibold flex items-center gap-2 mb-2 dark:text-white">
        Description
        <span className="text-red-500">*</span>
      </label>

      <textarea
        rows={6}
        name="description"
        value={formData.description}
        onChange={handleChange}
        placeholder="Write a detailed description of this development..."
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-white/10
          bg-white
          dark:bg-[#1A1A1A]
          p-4
          dark:text-white
          resize-none
          focus:outline-none
          focus:ring-2
          focus:ring-[#C9A758]
        "
      />

      {errors.description && (
        <p className="mt-2 text-sm text-red-500">
          {errors.description}
        </p>
      )}

    </div>

  </section>


  {/* ================================================================= */}


  {/* LOCATION */}

<section
  className="
    bg-white
    dark:bg-[#121212]
    rounded-3xl
    border
    border-gray-200
    dark:border-white/10
    p-8
  "
>
  <h2 className="text-2xl font-bold dark:text-white mb-8">
    Location
  </h2>

  <div className="grid lg:grid-cols-2 gap-6">

    <div>

      <label className="font-semibold dark:text-white flex items-center gap-2 mb-2">
        Development Location
        <span className="text-red-500">*</span>
      </label>

      <input
        type="text"
        name="location"
        value={formData.location}
        onChange={handleChange}
        placeholder="Westlands, Nairobi"
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-white/10
          dark:bg-[#1A1A1A]
          dark:text-white
          px-4
          py-3
          outline-none
          focus:border-[#C9A758]
        "
      />

      {errors.location && (
        <p className="text-red-500 text-sm mt-2">
          {errors.location}
        </p>
      )}

    </div>

    <div>

      <label className="font-semibold dark:text-white mb-2 block">
        Google Maps URL
      </label>

      <input
        type="url"
        name="google_maps_url"
        value={formData.google_maps_url}
        onChange={handleChange}
        placeholder="https://maps.google.com/..."
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-white/10
          dark:bg-[#1A1A1A]
          dark:text-white
          px-4
          py-3
          outline-none
          focus:border-[#C9A758]
        "
      />

    </div>

  </div>

</section>

{/* ============================================================= */}

{/* MEDIA */}

<section
  className="
    bg-white
    dark:bg-[#121212]
    rounded-3xl
    border
    border-gray-200
    dark:border-white/10
    p-8
  "
>

  <h2 className="text-2xl font-bold dark:text-white mb-8">
    Development Media
  </h2>

  <div className="space-y-10">

    <MediaUpload
  label="Cover Image"
  accept="image/*"
  folder="cover-images"
  value={formData.cover_image}
  onUpload={(path) =>
    setFormData((prev) => ({
      ...prev,
      cover_image: path,
    }))
  }
/>

    {errors.cover_image && (
      <p className="text-red-500 text-sm">
        {errors.cover_image}
      </p>
    )}

    <MediaUpload
  label="Hero Video"
  accept="video/*"
  folder="hero-videos"
  value={formData.hero_video_url}
  onUpload={(path) =>
    setFormData((prev) => ({
      ...prev,
      hero_video_url: path,
    }))
  }
/>

    <MediaUpload
  label="Hero Video Thumbnail"
  accept="image/*"
  folder="hero-thumbnails"
  value={formData.hero_video_thumbnail}
  onUpload={(path) =>
    setFormData((prev) => ({
      ...prev,
      hero_video_thumbnail: path,
    }))
  }
/>

  </div>

</section>

{/* =================================================================== */}

{/* PUBLISHING */}

<section
  className="
    bg-white
    dark:bg-[#121212]
    rounded-3xl
    border
    border-gray-200
    dark:border-white/10
    p-8
  "
>

  <h2 className="text-2xl font-bold dark:text-white mb-8">
    Publishing
  </h2>

  <div className="grid lg:grid-cols-2 gap-6">

    <div>

      <label className="font-semibold dark:text-white block mb-2">
        Completion Date
      </label>

      <input
        type="date"
        name="completion_date"
        value={formData.completion_date}
        onChange={handleChange}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-white/10
          dark:bg-[#1A1A1A]
          dark:text-white
          px-4
          py-3
          outline-none
          focus:border-[#C9A758]
        "
      />

    </div>

    <div>

      <label className="font-semibold dark:text-white block mb-2">
        Status
      </label>

      <select
        name="status"
        value={formData.status}
        onChange={handleChange}
        className="
          w-full
          rounded-xl
          border
          border-gray-300
          dark:border-white/10
          dark:bg-[#1A1A1A]
          dark:text-white
          px-4
          py-3
          outline-none
          focus:border-[#C9A758]
        "
      >
        <option value="draft">Draft</option>
        <option value="published">Published</option>
        <option value="archive">Archive</option>
  
      </select>

    </div>

  </div>

</section>

{/* ACTION BUTTONS */}

<div
  className="
    flex
    flex-col
    sm:flex-row
    justify-end
    gap-4
    pb-10
  "
>

  <button
    type="button"
    onClick={() => navigate("/admin/developments")}
    className="
      px-6
      py-3
      rounded-xl
      border
      border-gray-300
      dark:border-white/10
      dark:text-white
      hover:bg-gray-100
      dark:hover:bg-[#1A1A1A]
      transition
    "
  >
    Cancel
  </button>

  <button
    type="button"
    disabled={loading}
    onClick={() => saveDevelopment("draft")}
    className="
      flex
      items-center
      justify-center
      gap-2
      px-6
      py-3
      rounded-xl
      bg-gray-700
      text-white
      hover:bg-gray-800
      transition
    "
  >
    <Save size={18} />
    Save Draft
  </button>

  <button
    type="button"
    disabled={loading}
    onClick={() => saveDevelopment("published")}
    className="
      flex
      items-center
      justify-center
      gap-2
      px-6
      py-3
      rounded-xl
      bg-[#101F34]
      text-white
      hover:opacity-90
      transition
    "
  >
    <Send size={18} />
    {loading
  ? mode === "edit"
    ? "Saving..."
    : "Publishing..."
  : mode === "edit"
    ? "Save Changes"
    : "Publish"}
  </button>

</div>

</form>
  );
}