import {
  Check,
  ChevronDown,
  Edit3,
  Loader2,
  Plus,
  Search,
  Settings,
  Trash2,
  X,
} from "lucide-react";
import { useEffect, useMemo, useState } from "react";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import { supabase } from "../../../config/SupabaseClient";
import { amenityIconOptions } from "../../../config/amenityIcons";

export default function SettingsPage() {
  const [amenities, setAmenities] = useState([]);
  const [loadingAmenities, setLoadingAmenities] = useState(true);
  const [fetchError, setFetchError] = useState("");

  const [searchQuery, setSearchQuery] = useState("");

  const [showAmenityForm, setShowAmenityForm] = useState(false);
  const [creatingOrUpdating, setCreatingOrUpdating] = useState(false);

  const [editingAmenity, setEditingAmenity] = useState(null);

  const [deletingAmenity, setDeletingAmenity] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [deleteError, setDeleteError] = useState("");

  const [iconSearch, setIconSearch] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    icon_key: "default",
    is_active: true,
  });

  const [formError, setFormError] = useState("");

  /*
  |--------------------------------------------------------------------------
  | Fetch Amenities
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    fetchAmenities();
  }, []);

  const fetchAmenities = async () => {
    try {
      setLoadingAmenities(true);
      setFetchError("");

      const { data, error } = await supabase
        .from("amenities")
        .select("*")
        .order("name", { ascending: true });

      if (error) throw error;

      setAmenities(data || []);
    } catch (error) {
      console.error("Fetch amenities error:", error);

      setFetchError(
        error.message || "Unable to load amenities."
      );
    } finally {
      setLoadingAmenities(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Derived Data
  |--------------------------------------------------------------------------
  */

  const activeAmenityCount = useMemo(
    () => amenities.filter((amenity) => amenity.is_active).length,
    [amenities]
  );

  const inactiveAmenityCount = useMemo(
    () => amenities.filter((amenity) => !amenity.is_active).length,
    [amenities]
  );

  const filteredAmenities = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();

    if (!query) {
      return amenities;
    }

    return amenities.filter((amenity) => {
      const name = amenity.name?.toLowerCase() || "";
      const description =
        amenity.description?.toLowerCase() || "";

      return (
        name.includes(query) ||
        description.includes(query)
      );
    });
  }, [amenities, searchQuery]);

  const filteredIconOptions = useMemo(() => {
    const query = iconSearch.trim().toLowerCase();

    if (!query) {
      return amenityIconOptions;
    }

    return amenityIconOptions.filter((option) => {
      return option.label.toLowerCase().includes(query);
    });
  }, [iconSearch]);

  /*
  |--------------------------------------------------------------------------
  | Keyboard Handling
  |--------------------------------------------------------------------------
  */

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key !== "Escape") return;

      if (deletingAmenity && !deleteLoading) {
        closeDeleteConfirmation();
        return;
      }

      if (showAmenityForm && !creatingOrUpdating) {
        closeAmenityForm();
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [
    deletingAmenity,
    deleteLoading,
    showAmenityForm,
    creatingOrUpdating,
  ]);

  /*
  |--------------------------------------------------------------------------
  | Form Helpers
  |--------------------------------------------------------------------------
  */

  const handleFormChange = (event) => {
    const { name, value, type, checked } = event.target;

    setFormData((previous) => ({
      ...previous,
      [name]: type === "checkbox" ? checked : value,
    }));

    setFormError("");
  };

  const handleIconSelect = (iconKey) => {
    setFormData((previous) => ({
      ...previous,
      icon_key: iconKey,
    }));

    setFormError("");
  };

  const resetForm = () => {
    setFormData({
      name: "",
      description: "",
      icon_key: "default",
      is_active: true,
    });

    setFormError("");
    setIconSearch("");
  };

  /*
  |--------------------------------------------------------------------------
  | Open Create Modal
  |--------------------------------------------------------------------------
  */

  const openCreateModal = () => {
    setEditingAmenity(null);
    resetForm();
    setShowAmenityForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Open Edit Modal
  |--------------------------------------------------------------------------
  */

  const openEditModal = (amenity) => {
    setEditingAmenity(amenity);

    setFormData({
      name: amenity.name || "",
      description: amenity.description || "",
      icon_key: amenity.icon_key || "default",
      is_active: amenity.is_active ?? true,
    });

    setFormError("");
    setIconSearch("");
    setShowAmenityForm(true);
  };

  /*
  |--------------------------------------------------------------------------
  | Close Form
  |--------------------------------------------------------------------------
  */

  const closeAmenityForm = () => {
    if (creatingOrUpdating) return;

    resetForm();
    setEditingAmenity(null);
    setShowAmenityForm(false);
  };

  /*
  |--------------------------------------------------------------------------
  | Create / Update Amenity
  |--------------------------------------------------------------------------
  */

  const handleSubmitAmenity = async (event) => {
    event.preventDefault();

    const name = formData.name.trim();
    const description = formData.description.trim();

    if (!name) {
      setFormError("Please enter an amenity name.");
      return;
    }

    try {
      setCreatingOrUpdating(true);
      setFormError("");

      /*
      |--------------------------------------------------------------------------
      | UPDATE
      |--------------------------------------------------------------------------
      */

      if (editingAmenity) {
        const { data, error } = await supabase
          .from("amenities")
          .update({
            name,
            description,
            icon_key: formData.icon_key,
            is_active: formData.is_active,
            updated_at: new Date().toISOString(),
          })
          .eq("id", editingAmenity.id)
          .select()
          .single();

        if (error) throw error;

        setAmenities((previous) =>
          [...previous]
            .map((amenity) =>
              amenity.id === data.id ? data : amenity
            )
            .sort((a, b) =>
              a.name.localeCompare(b.name)
            )
        );
      }

      /*
      |--------------------------------------------------------------------------
      | CREATE
      |--------------------------------------------------------------------------
      */

      else {
        const { data, error } = await supabase
          .from("amenities")
          .insert([
            {
              name,
              description,
              icon_key: formData.icon_key,
              is_active: formData.is_active,
            },
          ])
          .select()
          .single();

        if (error) throw error;

        setAmenities((previous) =>
          [...previous, data].sort((a, b) =>
            a.name.localeCompare(b.name)
          )
        );
      }

      resetForm();
      setEditingAmenity(null);
      setShowAmenityForm(false);
    } catch (error) {
      console.error(
        editingAmenity
          ? "Update amenity error:"
          : "Create amenity error:",
        error
      );

      if (error.code === "23505") {
        setFormError(
          "An amenity with this name already exists."
        );
      } else {
        setFormError(
          error.message ||
            `Unable to ${
              editingAmenity ? "update" : "create"
            } amenity.`
        );
      }
    } finally {
      setCreatingOrUpdating(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Open Delete Confirmation
  |--------------------------------------------------------------------------
  */

  const openDeleteConfirmation = (amenity) => {
    setDeletingAmenity(amenity);
    setDeleteError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Close Delete Confirmation
  |--------------------------------------------------------------------------
  */

  const closeDeleteConfirmation = () => {
    if (deleteLoading) return;

    setDeletingAmenity(null);
    setDeleteError("");
  };

  /*
  |--------------------------------------------------------------------------
  | Delete Amenity
  |--------------------------------------------------------------------------
  */

  const handleDeleteAmenity = async () => {
    if (!deletingAmenity) return;

    try {
      setDeleteLoading(true);
      setDeleteError("");

      const { error } = await supabase
        .from("amenities")
        .delete()
        .eq("id", deletingAmenity.id);

      if (error) throw error;

      setAmenities((previous) =>
        previous.filter(
          (amenity) =>
            amenity.id !== deletingAmenity.id
        )
      );

      setDeletingAmenity(null);
    } catch (error) {
      console.error("Delete amenity error:", error);

      setDeleteError(
        error.message ||
          "Unable to delete this amenity."
      );
    } finally {
      setDeleteLoading(false);
    }
  };

  /*
  |--------------------------------------------------------------------------
  | Icon Preview
  |--------------------------------------------------------------------------
  */

  const selectedIconOption =
    amenityIconOptions.find(
      (option) =>
        option.key === formData.icon_key
    ) ||
    amenityIconOptions.find(
      (option) => option.key === "default"
    );

  const SelectedIcon =
    selectedIconOption?.icon || Settings;

  /*
  |--------------------------------------------------------------------------
  | Render
  |--------------------------------------------------------------------------
  */

  return (
    <DashboardLayout>
      <div className="space-y-8">
        {/* ---------------------------------------------------------------- */}
        {/* Page Header */}
        {/* ---------------------------------------------------------------- */}

        <div>
          <div className="flex items-center gap-2 text-xs font-medium uppercase tracking-[0.3em] text-[#C9A758]">
            <Settings size={14} />
            Administration
          </div>

          <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-white md:text-4xl">
                Settings
              </h1>

              <p className="mt-3 max-w-2xl text-sm leading-6 text-gray-400 md:text-base">
                Manage system preferences and administrative
                configuration for Dynasty Spaces.
              </p>
            </div>
          </div>
        </div>

        {/* ---------------------------------------------------------------- */}
        {/* Amenities Section */}
        {/* ---------------------------------------------------------------- */}

        <section className="space-y-5">
          {/* Section Header */}
          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-[#101010]
              p-5
              sm:p-6
            "
          >
            <div className="flex flex-col gap-5 xl:flex-row xl:items-center xl:justify-between">
              <div className="flex items-start gap-4">
                <div
                  className="
                    flex
                    h-12
                    w-12
                    shrink-0
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#C9A758]/20
                    bg-[#C9A758]/10
                    text-[#C9A758]
                  "
                >
                  <Settings size={22} strokeWidth={1.7} />
                </div>

                <div>
                  <div className="flex flex-wrap items-center gap-3">
                    <h2 className="text-xl font-semibold text-white sm:text-2xl">
                      Amenities
                    </h2>

                    <span className="rounded-full border border-white/10 bg-white/[0.03] px-2.5 py-1 text-xs text-gray-400">
                      {amenities.length}{" "}
                      {amenities.length === 1
                        ? "amenity"
                        : "amenities"}
                    </span>
                  </div>

                  <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-400">
                    Manage the reusable amenities that can be
                    assigned to your property listings.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={openCreateModal}
                className="
                  inline-flex
                  w-full
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-[#C9A758]
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-black
                  shadow-lg
                  shadow-[#C9A758]/10
                  transition-all
                  duration-200
                  hover:bg-[#d8b86b]
                  hover:shadow-[#C9A758]/20
                  sm:w-auto
                "
              >
                <Plus size={18} />
                Create Amenity
              </button>
            </div>

            {/* Statistics */}
            <div className="mt-6 grid grid-cols-2 gap-3 border-t border-white/10 pt-5 sm:grid-cols-3">
              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Total
                </p>

                <p className="mt-1 text-xl font-semibold text-white">
                  {amenities.length}
                </p>
              </div>

              <div>
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Active
                </p>

                <p className="mt-1 text-xl font-semibold text-green-400">
                  {activeAmenityCount}
                </p>
              </div>

              <div className="col-span-2 sm:col-span-1">
                <p className="text-xs uppercase tracking-wider text-gray-500">
                  Inactive
                </p>

                <p className="mt-1 text-xl font-semibold text-gray-500">
                  {inactiveAmenityCount}
                </p>
              </div>
            </div>
          </div>

          {/* ---------------------------------------------------------------- */}
          {/* Search */}
          {/* ---------------------------------------------------------------- */}

          {!loadingAmenities &&
            amenities.length > 0 && (
              <div className="relative">
                <Search
                  size={18}
                  className="
                    pointer-events-none
                    absolute
                    left-4
                    top-1/2
                    -translate-y-1/2
                    text-gray-500
                  "
                />

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search amenities..."
                  className="
                    w-full
                    rounded-xl
                    border
                    border-white/10
                    bg-[#101010]
                    py-3.5
                    pl-11
                    pr-11
                    text-sm
                    text-white
                    outline-none
                    transition
                    placeholder:text-gray-600
                    focus:border-[#C9A758]/40
                    focus:bg-[#121212]
                  "
                />

                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="
                      absolute
                      right-3
                      top-1/2
                      flex
                      h-8
                      w-8
                      -translate-y-1/2
                      items-center
                      justify-center
                      rounded-lg
                      text-gray-500
                      transition
                      hover:bg-white/5
                      hover:text-white
                    "
                    aria-label="Clear search"
                  >
                    <X size={16} />
                  </button>
                )}
              </div>
            )}

          {/* ---------------------------------------------------------------- */}
          {/* Amenities List */}
          {/* ---------------------------------------------------------------- */}

          <div
            className="
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#101010]
            "
          >
            {loadingAmenities ? (
              <div className="flex min-h-[280px] items-center justify-center p-10">
                <div className="flex flex-col items-center">
                  <Loader2
                    size={28}
                    className="animate-spin text-[#C9A758]"
                  />

                  <p className="mt-4 text-sm text-gray-400">
                    Loading amenities...
                  </p>
                </div>
              </div>
            ) : fetchError ? (
              <div className="p-10 text-center">
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    text-red-400
                  "
                >
                  <Settings size={24} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  Unable to Load Amenities
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  {fetchError}
                </p>

                <button
                  type="button"
                  onClick={fetchAmenities}
                  className="
                    mt-5
                    rounded-xl
                    border
                    border-white/10
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-gray-300
                    transition
                    hover:border-[#C9A758]/30
                    hover:bg-[#C9A758]/10
                    hover:text-[#C9A758]
                  "
                >
                  Try Again
                </button>
              </div>
            ) : amenities.length === 0 ? (
              <div className="p-10 text-center sm:p-14">
                <div
                  className="
                    mx-auto
                    flex
                    h-16
                    w-16
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-[#C9A758]/20
                    bg-[#C9A758]/10
                    text-[#C9A758]
                  "
                >
                  <Settings size={28} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No Amenities Yet
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Create your first property amenity. It will
                  become available when assigning amenities to
                  listings.
                </p>

                <button
                  type="button"
                  onClick={openCreateModal}
                  className="
                    mt-6
                    inline-flex
                    items-center
                    gap-2
                    rounded-xl
                    border
                    border-[#C9A758]/30
                    bg-[#C9A758]/10
                    px-4
                    py-2.5
                    text-sm
                    font-medium
                    text-[#C9A758]
                    transition
                    hover:bg-[#C9A758]/15
                  "
                >
                  <Plus size={16} />
                  Create your first amenity
                </button>
              </div>
            ) : filteredAmenities.length === 0 ? (
              <div className="p-10 text-center sm:p-14">
                <div
                  className="
                    mx-auto
                    flex
                    h-14
                    w-14
                    items-center
                    justify-center
                    rounded-2xl
                    border
                    border-white/10
                    bg-white/[0.03]
                    text-gray-500
                  "
                >
                  <Search size={24} />
                </div>

                <h3 className="mt-5 text-lg font-semibold text-white">
                  No Matching Amenities
                </h3>

                <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-gray-500">
                  Nothing matches{" "}
                  <span className="text-gray-300">
                    "{searchQuery}"
                  </span>
                  .
                </p>

                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="
                    mt-5
                    text-sm
                    font-medium
                    text-[#C9A758]
                    transition
                    hover:text-[#d8b86b]
                  "
                >
                  Clear search
                </button>
              </div>
            ) : (
              <div className="divide-y divide-white/10">
                {filteredAmenities.map((amenity) => {
                  const iconOption =
                    amenityIconOptions.find(
                      (option) =>
                        option.key === amenity.icon_key
                    ) ||
                    amenityIconOptions.find(
                      (option) =>
                        option.key === "default"
                    );

                  const Icon =
                    iconOption?.icon || Settings;

                  return (
                    <div
                      key={amenity.id}
                      className="
                        group
                        flex
                        flex-col
                        gap-4
                        p-5
                        transition
                        duration-200
                        hover:bg-white/[0.025]
                        sm:flex-row
                        sm:items-center
                        sm:p-6
                      "
                    >
                      {/* Icon */}
                      <div
                        className={`
                          flex
                          h-12
                          w-12
                          shrink-0
                          items-center
                          justify-center
                          rounded-xl
                          border
                          transition
                          ${
                            amenity.is_active
                              ? "border-[#C9A758]/20 bg-[#C9A758]/10 text-[#C9A758]"
                              : "border-white/10 bg-white/[0.03] text-gray-600"
                          }
                        `}
                      >
                        <Icon
                          size={22}
                          strokeWidth={1.7}
                        />
                      </div>

                      {/* Information */}
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2.5">
                          <h3
                            className={`
                              font-semibold
                              ${
                                amenity.is_active
                                  ? "text-white"
                                  : "text-gray-400"
                              }
                            `}
                          >
                            {amenity.name}
                          </h3>

                          <span
                            className={`
                              inline-flex
                              items-center
                              gap-1.5
                              rounded-full
                              px-2.5
                              py-1
                              text-[11px]
                              font-medium
                              ${
                                amenity.is_active
                                  ? "bg-green-500/10 text-green-400"
                                  : "bg-white/5 text-gray-500"
                              }
                            `}
                          >
                            <span
                              className={`
                                h-1.5
                                w-1.5
                                rounded-full
                                ${
                                  amenity.is_active
                                    ? "bg-green-400"
                                    : "bg-gray-600"
                                }
                              `}
                            />

                            {amenity.is_active
                              ? "Active"
                              : "Inactive"}
                          </span>
                        </div>

                        <p
                          className={`
                            mt-1.5
                            text-sm
                            leading-6
                            ${
                              amenity.description
                                ? "text-gray-500"
                                : "text-gray-700 italic"
                            }
                          `}
                        >
                          {amenity.description ||
                            "No description provided."}
                        </p>
                      </div>

                      {/* Actions */}
                      <div className="flex items-center gap-2 sm:shrink-0">
                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(amenity)
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-white/10
                            px-3
                            py-2
                            text-sm
                            text-gray-300
                            transition
                            hover:border-[#C9A758]/30
                            hover:bg-[#C9A758]/10
                            hover:text-[#C9A758]
                          "
                        >
                          <Edit3 size={16} />

                          <span className="hidden sm:inline">
                            Edit
                          </span>
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            openDeleteConfirmation(
                              amenity
                            )
                          }
                          className="
                            inline-flex
                            items-center
                            justify-center
                            gap-2
                            rounded-lg
                            border
                            border-red-500/10
                            px-3
                            py-2
                            text-sm
                            text-red-400
                            transition
                            hover:border-red-500/30
                            hover:bg-red-500/10
                          "
                        >
                          <Trash2 size={16} />

                          <span className="hidden sm:inline">
                            Delete
                          </span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>
      </div>

      {/* ================================================================== */}
      {/* CREATE / EDIT AMENITY MODAL */}
      {/* ================================================================== */}

      {showAmenityForm && (
        <div
          className="
            fixed
            inset-0
            z-50
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeAmenityForm();
            }
          }}
        >
          <div
            className="
              flex
              max-h-[92vh]
              w-full
              max-w-2xl
              flex-col
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#101010]
              shadow-2xl
              shadow-black/50
            "
          >
            {/* Modal Header */}
            <div
              className="
                flex
                shrink-0
                items-center
                justify-between
                border-b
                border-white/10
                bg-[#101010]
                px-5
                py-5
                sm:px-6
              "
            >
              <div className="flex items-center gap-3">
                <div
                  className="
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-xl
                    border
                    border-[#C9A758]/20
                    bg-[#C9A758]/10
                    text-[#C9A758]
                  "
                >
                  <SelectedIcon
                    size={19}
                    strokeWidth={1.7}
                  />
                </div>

                <div>
                  <h2 className="text-lg font-semibold text-white sm:text-xl">
                    {editingAmenity
                      ? "Edit Amenity"
                      : "Create Amenity"}
                  </h2>

                  <p className="mt-0.5 text-xs text-gray-500 sm:text-sm">
                    {editingAmenity
                      ? "Update this property amenity."
                      : "Add a reusable amenity to your property catalogue."}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={closeAmenityForm}
                disabled={creatingOrUpdating}
                className="
                  flex
                  h-9
                  w-9
                  items-center
                  justify-center
                  rounded-lg
                  text-gray-500
                  transition
                  hover:bg-white/5
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
                aria-label="Close modal"
              >
                <X size={19} />
              </button>
            </div>

            {/* Form Scroll Area */}
            <form
              onSubmit={handleSubmitAmenity}
              className="overflow-y-auto"
            >
              <div className="space-y-6 p-5 sm:p-6">
                {/* -------------------------------------------------------- */}
                {/* Name */}
                {/* -------------------------------------------------------- */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="amenity-name"
                      className="text-sm font-medium text-gray-300"
                    >
                      Amenity Name
                    </label>

                    <span className="text-[11px] text-gray-600">
                      {formData.name.length}/100
                    </span>
                  </div>

                  <input
                    id="amenity-name"
                    name="name"
                    type="text"
                    value={formData.name}
                    onChange={handleFormChange}
                    placeholder="e.g. Swimming Pool"
                    maxLength={100}
                    required
                    autoFocus
                    className="
                      w-full
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      px-4
                      py-3
                      text-sm
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-600
                      focus:border-[#C9A758]/50
                      focus:bg-white/[0.05]
                    "
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* Description */}
                {/* -------------------------------------------------------- */}

                <div>
                  <div className="mb-2 flex items-center justify-between">
                    <label
                      htmlFor="amenity-description"
                      className="text-sm font-medium text-gray-300"
                    >
                      Description
                    </label>

                    <span className="text-[11px] text-gray-600">
                      {formData.description.length}/500
                    </span>
                  </div>

                  <textarea
                    id="amenity-description"
                    name="description"
                    value={formData.description}
                    onChange={handleFormChange}
                    placeholder="Briefly describe this amenity..."
                    rows={3}
                    maxLength={500}
                    className="
                      w-full
                      resize-none
                      rounded-xl
                      border
                      border-white/10
                      bg-white/[0.03]
                      px-4
                      py-3
                      text-sm
                      leading-6
                      text-white
                      outline-none
                      transition
                      placeholder:text-gray-600
                      focus:border-[#C9A758]/50
                      focus:bg-white/[0.05]
                    "
                  />
                </div>

                {/* -------------------------------------------------------- */}
                {/* Icon Picker */}
                {/* -------------------------------------------------------- */}

                <div>
                  <div className="mb-3 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
                    <div>
                      <p className="text-sm font-medium text-gray-300">
                        Choose Icon
                      </p>

                      <p className="mt-1 text-xs text-gray-500">
                        Select the icon that best represents
                        this amenity.
                      </p>
                    </div>

                    {/* Selected Icon Preview */}
                    <div
                      className="
                        inline-flex
                        w-fit
                        items-center
                        gap-2
                        rounded-lg
                        border
                        border-[#C9A758]/20
                        bg-[#C9A758]/10
                        px-3
                        py-2
                        text-xs
                        text-[#C9A758]
                      "
                    >
                      <SelectedIcon
                        size={16}
                        strokeWidth={1.7}
                      />

                      {selectedIconOption?.label ||
                        "Default"}
                    </div>
                  </div>

                  {/* Icon Search */}
                  <div className="relative mb-3">
                    <Search
                      size={15}
                      className="
                        pointer-events-none
                        absolute
                        left-3.5
                        top-1/2
                        -translate-y-1/2
                        text-gray-600
                      "
                    />

                    <input
                      type="text"
                      value={iconSearch}
                      onChange={(event) =>
                        setIconSearch(event.target.value)
                      }
                      placeholder="Search icons..."
                      className="
                        w-full
                        rounded-xl
                        border
                        border-white/10
                        bg-white/[0.02]
                        py-2.5
                        pl-9
                        pr-4
                        text-xs
                        text-white
                        outline-none
                        transition
                        placeholder:text-gray-600
                        focus:border-[#C9A758]/40
                      "
                    />
                  </div>

                  <div
                    className="
                      grid
                      max-h-64
                      grid-cols-4
                      gap-2
                      overflow-y-auto
                      pr-1
                      sm:grid-cols-5
                      md:grid-cols-6
                    "
                  >
                    {filteredIconOptions.length === 0 ? (
                      <div className="col-span-full py-8 text-center">
                        <p className="text-sm text-gray-500">
                          No icons match your search.
                        </p>
                      </div>
                    ) : (
                      filteredIconOptions.map((option) => {
                        const Icon = option.icon;
                        const selected =
                          formData.icon_key ===
                          option.key;

                        return (
                          <button
                            key={option.key}
                            type="button"
                            onClick={() =>
                              handleIconSelect(
                                option.key
                              )
                            }
                            title={option.label}
                            className={`
                              relative
                              flex
                              min-h-[76px]
                              flex-col
                              items-center
                              justify-center
                              gap-2
                              rounded-xl
                              border
                              p-2
                              transition-all
                              duration-200
                              ${
                                selected
                                  ? "border-[#C9A758] bg-[#C9A758]/10 text-[#C9A758] shadow-lg shadow-[#C9A758]/5"
                                  : "border-white/10 bg-white/[0.02] text-gray-500 hover:border-white/20 hover:bg-white/[0.05] hover:text-white"
                              }
                            `}
                          >
                            <Icon
                              size={22}
                              strokeWidth={1.7}
                            />

                            <span className="w-full truncate text-center text-[10px]">
                              {option.label}
                            </span>

                            {selected && (
                              <span
                                className="
                                  absolute
                                  right-1.5
                                  top-1.5
                                  flex
                                  h-4
                                  w-4
                                  items-center
                                  justify-center
                                  rounded-full
                                  bg-[#C9A758]
                                  text-black
                                "
                              >
                                <Check
                                  size={10}
                                  strokeWidth={3}
                                />
                              </span>
                            )}
                          </button>
                        );
                      })
                    )}
                  </div>
                </div>

                {/* -------------------------------------------------------- */}
                {/* Active Toggle */}
                {/* -------------------------------------------------------- */}

                <label
                  className="
                    flex
                    cursor-pointer
                    items-center
                    justify-between
                    gap-4
                    rounded-xl
                    border
                    border-white/10
                    bg-white/[0.02]
                    p-4
                    transition
                    hover:border-white/15
                    hover:bg-white/[0.03]
                  "
                >
                  <div className="min-w-0">
                    <p className="text-sm font-medium text-white">
                      Active Amenity
                    </p>

                    <p className="mt-1 text-xs leading-5 text-gray-500">
                      Active amenities can be assigned to new
                      listings.
                    </p>
                  </div>

                  {/* Custom Toggle */}
                  <div className="relative shrink-0">
                    <input
                      type="checkbox"
                      name="is_active"
                      checked={formData.is_active}
                      onChange={handleFormChange}
                      className="peer sr-only"
                    />

                    <div
                      className="
                        h-6
                        w-11
                        rounded-full
                        bg-white/10
                        transition
                        peer-checked:bg-[#C9A758]
                        peer-focus-visible:ring-2
                        peer-focus-visible:ring-[#C9A758]/40
                      "
                    />

                    <div
                      className="
                        pointer-events-none
                        absolute
                        left-1
                        top-1
                        h-4
                        w-4
                        rounded-full
                        bg-gray-400
                        shadow
                        transition
                        peer-checked:translate-x-5
                        peer-checked:bg-black
                      "
                    />
                  </div>
                </label>

                {/* -------------------------------------------------------- */}
                {/* Error */}
                {/* -------------------------------------------------------- */}

                {formError && (
                  <div
                    className="
                      flex
                      items-start
                      gap-3
                      rounded-xl
                      border
                      border-red-500/20
                      bg-red-500/10
                      px-4
                      py-3
                      text-sm
                      leading-5
                      text-red-400
                    "
                  >
                    <X
                      size={17}
                      className="mt-0.5 shrink-0"
                    />

                    <span>{formError}</span>
                  </div>
                )}
              </div>

              {/* ---------------------------------------------------------- */}
              {/* Form Actions */}
              {/* ---------------------------------------------------------- */}

              <div
                className="
                  flex
                  flex-col-reverse
                  gap-3
                  border-t
                  border-white/10
                  bg-[#101010]
                  p-5
                  sm:flex-row
                  sm:justify-end
                  sm:px-6
                "
              >
                <button
                  type="button"
                  onClick={closeAmenityForm}
                  disabled={creatingOrUpdating}
                  className="
                    rounded-xl
                    border
                    border-white/10
                    px-5
                    py-3
                    text-sm
                    font-medium
                    text-gray-300
                    transition
                    hover:bg-white/5
                    hover:text-white
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  disabled={creatingOrUpdating}
                  className="
                    inline-flex
                    items-center
                    justify-center
                    gap-2
                    rounded-xl
                    bg-[#C9A758]
                    px-5
                    py-3
                    text-sm
                    font-semibold
                    text-black
                    shadow-lg
                    shadow-[#C9A758]/10
                    transition-all
                    hover:bg-[#d8b86b]
                    disabled:cursor-not-allowed
                    disabled:opacity-60
                  "
                >
                  {creatingOrUpdating ? (
                    <>
                      <Loader2
                        size={17}
                        className="animate-spin"
                      />

                      Saving...
                    </>
                  ) : (
                    <>
                      {editingAmenity ? (
                        <Edit3 size={17} />
                      ) : (
                        <Plus size={17} />
                      )}

                      {editingAmenity
                        ? "Save Changes"
                        : "Create Amenity"}
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ================================================================== */}
      {/* DELETE CONFIRMATION MODAL */}
      {/* ================================================================== */}

      {deletingAmenity && (
        <div
          className="
            fixed
            inset-0
            z-[60]
            flex
            items-center
            justify-center
            bg-black/75
            p-4
            backdrop-blur-sm
          "
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeDeleteConfirmation();
            }
          }}
        >
          <div
            className="
              w-full
              max-w-md
              overflow-hidden
              rounded-2xl
              border
              border-white/10
              bg-[#101010]
              shadow-2xl
              shadow-black/50
            "
          >
            <div className="p-6">
              {/* Warning Icon */}
              <div
                className="
                  flex
                  h-12
                  w-12
                  items-center
                  justify-center
                  rounded-xl
                  border
                  border-red-500/20
                  bg-red-500/10
                  text-red-400
                "
              >
                <Trash2 size={22} />
              </div>

              <h2 className="mt-5 text-xl font-semibold text-white">
                Delete Amenity?
              </h2>

              <p className="mt-3 text-sm leading-6 text-gray-400">
                Are you sure you want to delete{" "}
                <span className="font-semibold text-white">
                  {deletingAmenity.name}
                </span>
                ?
              </p>

              <div
                className="
                  mt-4
                  rounded-xl
                  border
                  border-red-500/10
                  bg-red-500/[0.04]
                  p-4
                "
              >
                <p className="text-xs leading-5 text-gray-500">
                  This will also remove the amenity from any
                  listings where it is currently assigned.
                  This action cannot be undone.
                </p>
              </div>

              {/* Delete Error */}
              {deleteError && (
                <div
                  className="
                    mt-4
                    flex
                    items-start
                    gap-3
                    rounded-xl
                    border
                    border-red-500/20
                    bg-red-500/10
                    px-4
                    py-3
                    text-sm
                    leading-5
                    text-red-400
                  "
                >
                  <X
                    size={17}
                    className="mt-0.5 shrink-0"
                  />

                  <span>{deleteError}</span>
                </div>
              )}
            </div>

            {/* Actions */}
            <div
              className="
                flex
                flex-col-reverse
                gap-3
                border-t
                border-white/10
                p-5
                sm:flex-row
                sm:justify-end
              "
            >
              <button
                type="button"
                onClick={closeDeleteConfirmation}
                disabled={deleteLoading}
                className="
                  rounded-xl
                  border
                  border-white/10
                  px-5
                  py-3
                  text-sm
                  font-medium
                  text-gray-300
                  transition
                  hover:bg-white/5
                  hover:text-white
                  disabled:cursor-not-allowed
                  disabled:opacity-50
                "
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={handleDeleteAmenity}
                disabled={deleteLoading}
                className="
                  inline-flex
                  items-center
                  justify-center
                  gap-2
                  rounded-xl
                  bg-red-500
                  px-5
                  py-3
                  text-sm
                  font-semibold
                  text-white
                  transition
                  hover:bg-red-600
                  disabled:cursor-not-allowed
                  disabled:opacity-60
                "
              >
                {deleteLoading ? (
                  <>
                    <Loader2
                      size={17}
                      className="animate-spin"
                    />

                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 size={17} />
                    Delete Amenity
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}