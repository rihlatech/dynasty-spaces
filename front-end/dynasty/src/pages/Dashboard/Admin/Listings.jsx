import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../../config/SupabaseClient";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";

import ListingSearch from "../../../components/dashboard/listings/ListingSearch";
import ListingFilters from "../../../components/dashboard/listings/ListingFilters";
import ListingTable from "../../../components/dashboard/listings/ListingTable";
// import DeleteListingModal from "../../../components/dashboard/listings/DeleteListingModal";


export default function Listings() {

  const navigate = useNavigate();


  const [loading, setLoading] = useState(true);

  const [listings, setListings] = useState([]);

  const [filteredListings, setFilteredListings] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  // const [deleteItem, setDeleteItem] = useState(null);


    const fetchListings = async () => {
  try {
    setLoading(true);

   const { data, error } = await supabase
  .from("listings")
  .select(`
    *,
    listing_media (
      media_url,
      is_primary
    )
  `)
  .order("created_at", { ascending: false });


    if (error) throw error;


    setListings(data || []);


  } catch (error) {

    console.error("Fetch listings error:", error);

  } finally {

    setLoading(false);

  }
};

useEffect(() => {
  fetchListings();
}, []);

// ------------------------------------------
const handleArchive = async (listing) => {
  try {
    const { error } = await supabase
      .from("listings")
      .update({ status: "archived" })
      .eq("id", listing.id);

    if (error) throw error;

    await fetchListings();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
// -----------------------------------------------------------

const handleRestore = async (listing) => {
  try {
    const { error } = await supabase
      .from("listings")
      .update({ status: "published" })
      .eq("id", listing.id);

    if (error) throw error;

    await fetchListings();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
// -----------------------------------------

const handleDelete = async (listing) => {
  const confirmed = window.confirm(
    `Delete "${listing.title}"?\n\nThis action cannot be undone.`
  );

  if (!confirmed) return;

  try {
    // Fetch listing media
    const { data: media, error: mediaError } = await supabase
      .from("listing_media")
      .select("storage_path")
      .eq("listing_id", listing.id);

    if (mediaError) throw mediaError;

    // Delete files from Storage
    if (media && media.length > 0) {
      const paths = media.map(item => item.storage_path);

      const { error: storageError } = await supabase.storage
        .from("listing-media")
        .remove(paths);

      if (storageError) throw storageError;
    }

    // Delete media records
    const { error: mediaDeleteError } = await supabase
      .from("listing_media")
      .delete()
      .eq("listing_id", listing.id);

    if (mediaDeleteError) throw mediaDeleteError;

    // Delete listing
    const { error: listingDeleteError } = await supabase
      .from("listings")
      .delete()
      .eq("id", listing.id);

    if (listingDeleteError) throw listingDeleteError;

    await fetchListings();

    alert("Listing deleted successfully.");

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};
// -------------------------------------

useEffect(() => {

  let results = [...listings];


  // Search by listing title
  if (search.trim()) {

    results = results.filter((item) =>
      item.title
        .toLowerCase()
        .includes(search.toLowerCase())
    );

  }


  // Filter by status
  if (statusFilter !== "all") {

    results = results.filter(
      (item) => item.status === statusFilter
    );

  }


  setFilteredListings(results);


}, [search, statusFilter, listings]);

const totalListings = listings.length;

const published = listings.filter(
  (item) => item.status === "published"
).length;

const drafts = listings.filter(
  (item) => item.status === "draft"
).length;

const archived = listings.filter(
  (item) => item.status === "archived"
).length;



  return (
    <DashboardLayout>
        {/* PAGE HEADER */}

<div
  className="
    flex
    flex-col
    lg:flex-row
    lg:items-center
    lg:justify-between
    gap-6
    mb-8
  "
>

  <div>

    <h1
      className="
        text-3xl
        font-bold
        text-[#101F34]
        dark:text-white
      "
    >
      Listings
    </h1>

    <p
      className="
        mt-2
        text-gray-500
        dark:text-gray-400
      "
    >
      Manage property listings and units.
    </p>

  </div>


  <button
    onClick={() => navigate("/admin/listings/new")}
    className="
      px-6
      py-3
      rounded-xl
      bg-[#101F34]
      text-white
      hover:opacity-90
      transition
    "
  >
    + New Listing
  </button>

</div>

{/* -------------------------------- */}

{/* STATISTICS CARDS */}

<div
  className="
    grid
    grid-cols-1
    md:grid-cols-2
    xl:grid-cols-4
    gap-5
    mb-8
  "
>

  {/* TOTAL LISTINGS */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      rounded-2xl
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Total Listings
    </p>

    <h2
      className="
        text-4xl
        font-bold
        mt-3
        text-[#101F34]
        dark:text-white
      "
    >
      {totalListings}
    </h2>

  </div>


  {/* PUBLISHED */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      rounded-2xl
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Published
    </p>

    <h2
      className="
        text-4xl
        font-bold
        mt-3
        text-green-600
        dark:text-green-400
      "
    >
      {published}
    </h2>

  </div>


  {/* DRAFTS */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      rounded-2xl
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Drafts
    </p>

    <h2
      className="
        text-4xl
        font-bold
        mt-3
        text-amber-500
        dark:text-amber-400
      "
    >
      {drafts}
    </h2>

  </div>


  {/* ARCHIVED */}

  <div
    className="
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      rounded-2xl
      p-6
    "
  >

    <p className="text-sm text-gray-500 dark:text-gray-400">
      Archived
    </p>

    <h2
      className="
        text-4xl
        font-bold
        mt-3
        text-gray-600
        dark:text-gray-300
      "
    >
      {archived}
    </h2>

  </div>


</div>



{/* SEARCH & FILTERS */}

<div
  className="
    bg-white
    dark:bg-[#121212]
    border
    border-gray-200
    dark:border-white/10
    rounded-2xl
    p-6
    mb-8
  "
>

  <div
    className="
      grid
      lg:grid-cols-2
      gap-5
    "
  >

    <ListingSearch
      value={search}
      onChange={setSearch}
    />


    <ListingFilters
      value={statusFilter}
      onChange={setStatusFilter}
    />


  </div>

</div>

{/* LISTINGS TABLE */}

<div
  className="
    bg-white
    dark:bg-[#121212]
    border
    border-gray-200
    dark:border-white/10
    rounded-2xl
    overflow-hidden
  "
>
<ListingTable
  loading={loading}
  listings={filteredListings}
  onEdit={(item) =>
    navigate(`/admin/listings/${item.id}/edit`)
  }
  onDelete={handleDelete}
  onArchive={handleArchive}
  onRestore={handleRestore}
/>

</div>






      

    </DashboardLayout>
  );
}