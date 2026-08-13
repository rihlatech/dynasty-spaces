import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmationModal from "../../../components/modals/ConfirmationModal";

import {
  Pencil,
  Trash2,
  Archive,
  RotateCcw,
  Loader2,
  Plus,
  MapPin,
  Calendar,
  Building2,
} from "lucide-react";

import { supabase } from "../../../config/SupabaseClient";

export default function DevelopmentOverview() {
  const navigate = useNavigate();
  const { slug } = useParams();

  // ==========================================
  // STATES
  // ==========================================

  const [loading, setLoading] = useState(true);

  const [development, setDevelopment] = useState(null);

  const [listings, setListings] = useState([]);

  const [showDeleteModal, setShowDeleteModal] = useState(false);

const [selectedListing, setSelectedListing] = useState(null);

const openDeleteModal = (listing) => {
  setSelectedListing(listing);
  setShowDeleteModal(true);
};

  // ==========================================
  // LOAD DEVELOPMENT + LISTINGS
  // ==========================================

  useEffect(() => {
    fetchDevelopment();
  }, [slug]);

  const fetchDevelopment = async () => {
    try {
      setLoading(true);

      // Development
      const { data: developmentData, error: developmentError } =
        await supabase
          .from("developments")
          .select("*")
          .eq("slug", slug)
          .single();

      if (developmentError) throw developmentError;

      setDevelopment(developmentData);

      // Listings
      const { data: listingsData, error: listingsError } =
        await supabase
          .from("listings")
          .select("*")
          .eq("development_id", developmentData.id)
          .order("created_at", {
            ascending: false,
          });

      if (listingsError) throw listingsError;

      setListings(listingsData || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // ==========================================
  // ACTIONS
  // ==========================================

  const handleEditDevelopment = () => {
    navigate(`/admin/developments/edit/${development.id}`);
  };

  const handleAddListing = () => {
    navigate(
      `/admin/listings/new?development=${development.id}`
    );
  };

  const handleEditListing = (listing) => {
    navigate(`/admin/listings/edit/${listing.id}`);
  };

  const handleArchiveListing = async (listing) => {
    console.log("Archive", listing.id);
  };

  const handleDeleteListing = async (listing) => {
    console.log("Delete", listing.id);
  };

  // ==========================================
  // LOADING
  // ==========================================

  if (loading) {
    return (
      <div className="flex justify-center items-center py-24">
        <Loader2
          size={42}
          className="animate-spin text-[#C9A758]"
        />
      </div>
    );
  }

  // ==========================================
  // PAGE
  // ==========================================

  return (

    <div className="space-y-8">

  {/* ==========================================
      DEVELOPMENT HEADER
  ========================================== */}

  <section
    className="
      flex
      flex-col
      lg:flex-row
      lg:justify-between
      lg:items-center
      gap-6
    "
  >

    {/* Left */}

    <div>

      <div className="flex items-center gap-3">

        <Building2
          size={34}
          className="text-[#C9A758]"
        />

        <h1
          className="
            text-4xl
            font-bold
            text-[#101F34]
            dark:text-white
          "
        >
          {development?.name}
        </h1>

      </div>

      <div
        className="
          flex
          flex-wrap
          items-center
          gap-5
          mt-5
          text-gray-500
          dark:text-gray-400
        "
      >

        <div className="flex items-center gap-2">

          <MapPin size={18} />

          <span>
            {development?.location || "No location"}
          </span>

        </div>

        <div className="flex items-center gap-2">

          <Calendar size={18} />

          <span>
            {development?.completion_date || "No completion date"}
          </span>

        </div>

      </div>

    </div>

    {/* Right */}

    <div
      className="
        flex
        items-center
        gap-4
      "
    >

      <span
        className={`
          px-4
          py-2
          rounded-full
          text-sm
          font-semibold

          ${
            development?.status === "published"
              ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
              : development?.status === "draft"
              ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
              : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
          }
        `}
      >
        {development?.status}
      </span>

      <button
        onClick={handleEditDevelopment}
        className="
          flex
          items-center
          gap-2
          px-5
          py-3
          rounded-xl
          bg-[#101F34]
          text-white
          hover:opacity-90
          transition
        "
      >

        <Pencil size={18} />

        Edit Development

      </button>

    </div>

  </section>

  {/* ============================================================= */}

  {/* ==========================================
    HERO SECTION
========================================== */}

<section
  className="
    relative
    rounded-3xl
    overflow-hidden
    border
    border-gray-200
    dark:border-white/10
    bg-gray-100
    dark:bg-[#1A1A1A]
  "
>

  <div className="aspect-[21/8] w-full">

    {development?.cover_image ? (

      <img
        src={development.cover_image}
        alt={development.name}
        className="
          w-full
          h-full
          object-cover
        "
      />

    ) : (

      <div
        className="
          w-full
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-gray-400
        "
      >

        <Building2 size={60} />

        <p className="mt-4 text-lg">
          No Cover Image
        </p>

      </div>

    )}

  </div>

  {/* Overlay */}

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-t
      from-black/80
      via-black/20
      to-transparent
    "
  />

  {/* Bottom Info */}

  <div
    className="
      absolute
      bottom-0
      left-0
      right-0
      p-8
      flex
      justify-between
      items-end
    "
  >

    <div>

      <p
        className="
          text-sm
          uppercase
          tracking-[3px]
          text-[#C9A758]
        "
      >
        Development
      </p>

      <h2
        className="
          text-4xl
          font-bold
          text-white
          mt-2
        "
      >
        {development?.name}
      </h2>

    </div>

    <button
      onClick={handleAddListing}
      className="
        flex
        items-center
        gap-2
        px-6
        py-3
        rounded-xl
        bg-[#C9A758]
        text-black
        font-semibold
        hover:opacity-90
        transition
      "
    >

      <Plus size={20} />

      Add Listing

    </button>

  </div>

</section>

{/* ================================================================== */}

{/* ==========================================
    STATISTICS
========================================== */}

<section
  className="
    grid
    grid-cols-2
    lg:grid-cols-4
    gap-6
  "
>

  {/* Total Listings */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      rounded-3xl
      border
      border-gray-200
      dark:border-white/10
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Total Listings
    </p>

    <h2 className="text-4xl font-bold mt-3 text-[#101F34] dark:text-white">
      {listings.length}
    </h2>

  </div>

  {/* Published */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      rounded-3xl
      border
      border-gray-200
      dark:border-white/10
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Published
    </p>

    <h2 className="text-4xl font-bold mt-3 text-green-600">
      {
        listings.filter(
          (listing) => listing.status === "published"
        ).length
      }
    </h2>

  </div>

  {/* Draft */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      rounded-3xl
      border
      border-gray-200
      dark:border-white/10
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Draft
    </p>

    <h2 className="text-4xl font-bold mt-3 text-yellow-500">
      {
        listings.filter(
          (listing) => listing.status === "draft"
        ).length
      }
    </h2>

  </div>

  {/* Archived */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      rounded-3xl
      border
      border-gray-200
      dark:border-white/10
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Archived
    </p>

    <h2 className="text-4xl font-bold mt-3 text-red-500">
      {
        listings.filter(
          (listing) => listing.status === "archived"
        ).length
      }
    </h2>

  </div>

</section>

{/* ========================================================= */}

{/* ==========================================
    LISTINGS
========================================== */}

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

  {/* Header */}

  <div
    className="
      flex
      flex-col
      md:flex-row
      md:items-center
      md:justify-between
      gap-5
      mb-8
    "
  >

    <div>

      <h2
        className="
          text-2xl
          font-bold
          text-[#101F34]
          dark:text-white
        "
      >
        Property Listings
      </h2>

      <p className="text-gray-500 dark:text-gray-400 mt-1">
        Manage all listings belonging to this development.
      </p>

    </div>

    <button
      onClick={handleAddListing}
      className="
        flex
        items-center
        gap-2
        px-6
        py-3
        rounded-xl
        bg-[#C9A758]
        text-black
        font-semibold
        hover:opacity-90
        transition
      "
    >

      <Plus size={18} />

      Add Listing

    </button>

  </div>

  {/* Empty State */}

  {listings.length === 0 ? (

    <div
      className="
        py-20
        text-center
      "
    >

      <Building2
        size={60}
        className="
          mx-auto
          text-gray-300
        "
      />

      <h3
        className="
          mt-6
          text-2xl
          font-bold
          dark:text-white
        "
      >
        No Listings Yet
      </h3>

      <p
        className="
          mt-3
          text-gray-500
          dark:text-gray-400
        "
      >
        Create your first property listing for this development.
      </p>

    </div>

  ) : (

    <div className="space-y-6">

      {listings.map((listing) => (

        <div
        onClick={() => navigate(`/admin/listings/${listing.id}`)}
          key={listing.id}
          className="
            flex
            flex-col
            lg:flex-row
            lg:items-center
            lg:justify-between
            gap-6
            rounded-2xl
            border
            border-gray-200
            dark:border-white/10
            p-6
            hover:border-[#C9A758]
            transition
            cursor - pointer
          "
        >

          {/* Left */}

        <div className="flex items-center gap-6">

  {/* Thumbnail */}

  <div
    className="
      w-40
      h-28
      rounded-2xl
      overflow-hidden
      bg-gray-100
      dark:bg-[#1A1A1A]
      shrink-0
    "
  >

    <img
      src={
        listing.cover_image ||
        "https://placehold.co/600x400?text=No+Image"
      }
      alt={listing.title}
      className="w-full h-full object-cover"
    />

  </div>

  {/* Information */}

  <div>

    <h3
      className="
        text-xl
        font-bold
        text-[#101F34]
        dark:text-white
      "
    >
      {listing.title}
    </h3>

    <div
      className="
        flex
        flex-wrap
        gap-5
        mt-3
        text-sm
        text-gray-500
        dark:text-gray-400
      "
    >

      <span>{listing.property_type}</span>

      <span>{listing.bedrooms} Bedrooms</span>

      <span>
        {listing.currency}{" "}
        {Number(listing.price).toLocaleString()}
      </span>

    </div>

  </div>

</div>

          {/* Right */}

          <div
            className="
              flex
              items-center
              gap-3
            "
          >

            <button
             onClick={(e) => {
  e.stopPropagation();
  handleEditListing(listing);
}}
              className="
                p-3
                rounded-xl
                bg-blue-100
                text-blue-700
                hover:bg-blue-200
                transition
              "
            >
              <Pencil size={18} />
            </button>

            <button
              onClick={(e) => {
  e.stopPropagation();
  handleArchiveListing(listing);
}}
              className="
                p-3
                rounded-xl
                bg-yellow-100
                text-yellow-700
                hover:bg-yellow-200
                transition
              "
            >
              <Archive size={18} />
            </button>

            <button
              onClick={(e) => {
  e.stopPropagation();
  handleDeleteListing(listing);
}}
              className="
                p-3
                rounded-xl
                bg-red-100
                text-red-600
                hover:bg-red-200
                transition
              "
            >
              <Trash2 size={18} />
            </button>

          </div>

        </div>

      ))}

    </div>

  )}

</section>

<ConfirmationModal
  open={showDeleteModal}
  title="Delete Listing"
  message={`Are you sure you want to delete "${selectedListing?.title}"? This action cannot be undone.`}
  confirmText="Delete"
  confirmColor="red"
  onClose={()=>setShowDeleteModal(false)}
  onConfirm={()=>{
    handleDeleteListing(selectedListing);
    setShowDeleteModal(false);
  }}
/>



</div>

   
  );
}