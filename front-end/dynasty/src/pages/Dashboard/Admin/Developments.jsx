import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../../config/SupabaseClient";
import DevelopmentSearch from "../../../components/dashboard/developments/DevelopmentSearch";
import DevelopmentFilters from "../../../components/dashboard/developments/DevelopmentFilters";
import DevelopmentTable from "../../../components/dashboard/developments/DevelopmentTable";
import DeleteDevelopmentModal from "../../../components/dashboard/developments/DeleteDevelopmentModal";
import DashboardLayout  from "../../../components/dashboard/DashboardLayout"; 

export default function Developments() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [developments, setDevelopments] = useState([]);

  const [filteredDevelopments, setFilteredDevelopments] = useState([]);

  const [search, setSearch] = useState("");

  const [statusFilter, setStatusFilter] = useState("all");

  const [deleteItem, setDeleteItem] = useState(null);

  const fetchDevelopments = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("developments")
        .select("*")


// =====================================

        .order("created_at", { ascending: false });

      if (error) throw error;

      setDevelopments(data || []);
      console.log("Developments:", data)
      // setFilteredDevelopments(data || []);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDevelopments();
  }, []);

  useEffect(() => {

  let results = [...developments];

  if (search.trim()) {
    results = results.filter((item) =>
      item.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );
  }

  if (statusFilter !== "all") {
    results = results.filter(
      (item) => item.status === statusFilter
    );
  }

  console.log("Current filter:", statusFilter);
  console.log("Results:", results);

  setFilteredDevelopments(results);

}, [search, statusFilter, developments]);

  const deleteDevelopment = async () => {
  if (!deleteItem) return;

  try {

    let query;

    if (deleteItem.status === "archived") {

      // Permanent delete
      query = supabase
        .from("developments")
        .delete()
        .eq("id", deleteItem.id);

    } else {

      // Move to archive
      query = supabase
        .from("developments")
        .update({
          status: "archived",
          updated_at: new Date().toISOString(),
        })
        .eq("id", deleteItem.id);

    }

    const { error } = await query;

    if (error) throw error;

    setDeleteItem(null);

    await fetchDevelopments();

  } catch (error) {

    console.error(error);
    alert(error.message);

  }
};


  const archiveDevelopment = async (development) => {
  console.log("Trying to archive:", development);

  try {
    const { data, error } = await supabase
      .from("developments")
      .update({
        status: "archived",
        updated_at: new Date().toISOString(),
      })
      .eq("id", development.id)
      .select();

    console.log("Updated row:", data);
    console.log("Update error:", error);

    if (error) throw error;

    await fetchDevelopments();

  } catch (error) {
    console.error("Archive failed:", error);
    alert(error.message);
  }
};


// };

const restoreDevelopment = async (development) => {
  try {
    const { data, error } = await supabase
      .from("developments")
      .update({
        status: "published",
        updated_at: new Date().toISOString(),
      })
      .eq("id", development.id)
      .select();

    if (error) throw error;

    console.log("Restore result:", data);

    await fetchDevelopments();

  } catch (error) {
    console.error(error);
    alert(error.message);
  }
};

  return (
  <DashboardLayout>

    {/* <div
      className="
        p-6
        bg-[#F8F9FB]
        dark:bg-[#0B0B0B]
        min-h-screen
      "
      > */}

      <div className="w-full">


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
              Developments
            </h1>


            <p
              className="
                mt-2
                text-gray-500
                dark:text-gray-400
              "
            >
              Manage all property developments.
            </p>

          </div>


          <button
            onClick={() => navigate("/admin/developments/new")}
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
            + New Development
          </button>


        </div>

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

          {/* TOTAL */}

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
              Total Developments
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
              {developments.length}
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
              {
                developments.filter(
                  (item) => item.status === "published"
                ).length
              }
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
              {
                developments.filter(
                  (item) => item.status === "draft"
                ).length
              }
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
    {
      developments.filter(
        (item) => item.status === "archived"
      ).length
    }
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

            <DevelopmentSearch
              value={search}
              onChange={setSearch}
            />


            <DevelopmentFilters
              value={statusFilter}
              onChange={setStatusFilter}
            />


          </div>


        </div>

        {/* DEVELOPMENTS TABLE */}

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
<DevelopmentTable
  loading={loading}
  developments={filteredDevelopments}
  onEdit={(item) =>
    navigate(`/admin/developments/${item.id}/edit`)
  }
  onDelete={(item) =>
    setDeleteItem(item)
  }
  onArchive={
    statusFilter === "archived"
      ? restoreDevelopment
      : archiveDevelopment
  }
  showArchive={statusFilter !== "archived"}
/>

        </div>

        {/* DELETE MODAL */}

        <DeleteDevelopmentModal
          open={!!deleteItem}
          development={deleteItem}
          onClose={() => setDeleteItem(null)}
          onDelete={deleteDevelopment}
        />







      </div>

    {/* </div> */}

  </DashboardLayout>
);
}