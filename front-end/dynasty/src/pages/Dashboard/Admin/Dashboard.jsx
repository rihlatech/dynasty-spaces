import { useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { supabase } from "../../../config/SupabaseClient";

import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import StatCard from "../../../components/dashboard/StatCard";
import QuickActionCard from "../../../components/dashboard/QuickActionCard";

import {
  Building,
  Building2,
  CheckCircle2,
  FileText,
  Archive,
  UserPlus,
} from "lucide-react";


export default function Dashboard() {

  const navigate = useNavigate();


  // =========================================================
  // STATISTICS
  // =========================================================

  const [stats, setStats] = useState({
    total: 0,
    published: 0,
    draft: 0,
    archived: 0,
  });


  // =========================================================
  // FETCH LISTING STATISTICS
  // =========================================================

  useEffect(() => {

    fetchStats();

  }, []);


  const fetchStats = async () => {

    try {

      const {
        data,
        error
      } = await supabase

        .from("listings")

        .select("status");


      if (error) {
        throw error;
      }


      setStats({

        total:
          data.length,

        published:
          data.filter(
            (listing) =>
              listing.status === "published"
          ).length,

        draft:
          data.filter(
            (listing) =>
              listing.status === "draft"
          ).length,

        archived:
          data.filter(
            (listing) =>
              listing.status === "archived"
          ).length,

      });


    } catch (error) {

      console.error(
        "Fetch listing stats error:",
        error
      );

    }

  };


  // =========================================================
  // RETURN
  // =========================================================

  return (

    <DashboardLayout>

      {/* =====================================================
          HEADER
      ===================================================== */}

      <h1
        className="
          text-4xl
          font-bold
          text-black
          dark:text-white
        "
      >
        Welcome back 👋
      </h1>


      <p
        className="
          mt-2
          text-gray-500
          dark:text-gray-400
        "
      >
        Your dashboard to help manage your real estate platform.
      </p>


      {/* =====================================================
          LISTING STATISTICS
      ===================================================== */}

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-2
          xl:grid-cols-4
          gap-6
          mt-10
        "
      >

        {/* TOTAL LISTINGS */}

        <StatCard
          title="Listings"
          value={stats.total}
          icon={
            <Building2 color="black" />
          }
        />


        {/* PUBLISHED */}

        <StatCard
          title="Published"
          value={stats.published}
          icon={
            <CheckCircle2 color="black" />
          }
        />


        {/* DRAFTS */}

        <StatCard
          title="Drafts"
          value={stats.draft}
          icon={
            <FileText color="black" />
          }
        />


        {/* ARCHIVED */}

        <StatCard
          title="Archived"
          value={stats.archived}
          icon={
            <Archive color="black" />
          }
        />

      </div>


      {/* =====================================================
          QUICK ACTIONS
      ===================================================== */}

      <h2
        className="
          text-2xl
          font-bold
          mt-14
          mb-6
          text-black
          dark:text-white
        "
      >
        Quick Actions
      </h2>


      <div
        className="
          grid
          md:grid-cols-2
          gap-6
        "
      >

        {/* NEW LISTING */}

        <QuickActionCard
          title="New Listing"
          description="Add a new property listing."
          icon={
            <Building color="black" />
          }
          onClick={() =>
            navigate("/admin/listings/new")
          }
        />


        {/* INVITE EDITOR */}

        <QuickActionCard
          title="Invite Editor"
          description="Allow another user to manage content."
          icon={
            <UserPlus color="black" />
          }
        />

      </div>


    </DashboardLayout>

  );

}