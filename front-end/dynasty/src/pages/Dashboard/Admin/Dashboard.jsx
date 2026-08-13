// import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { useEffect, useState } from "react";
import { supabase } from "../../../config/SupabaseClient";
import DashboardLayout from "../../../components/dashboard/DashboardLayout";
import StatCard from "../../../components/dashboard/StatCard";
import QuickActionCard from "../../../components/dashboard/QuickActionCard";

import {
  Plus,
  Building,
  UserPlus,
} from "lucide-react";


import {
  Building2,
  CheckCircle2,
  FileText,
  Archive,
} from "lucide-react";

export default function Dashboard() {
    const navigate = useNavigate();
    const [stats, setStats] = useState({
  total: 0,
  published: 0,
  draft: 0,
  archived: 0,
});

useEffect(() => {
  fetchStats();
}, []);

const fetchStats = async () => {
  try {
    const { data, error } = await supabase
      .from("developments")
      .select("status");

    if (error) throw error;

    setStats({
      total: data.length,
      published: data.filter(d => d.status === "published").length,
      draft: data.filter(d => d.status === "draft").length,
      archived: data.filter(d => d.status === "archived").length,
    });

  } catch (error) {
    console.error(error);
  }
};

  return (
    <DashboardLayout>

      <h1 className="text-4xl font-bold text-black dark:text-white">
        Welcome back 👋
      </h1>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        Your dashboard to help manage your real estate platform .
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 mt-10">

        <StatCard
          title="Developments"
          value={stats.total}
          icon={<Building2 color="black" />}
        />

        <StatCard
          title="Published"
          value={stats.published}
          icon={<CheckCircle2 color="black" />}
        />

        <StatCard
          title="Drafts"
          value={stats.draft}
          icon={<FileText color="black" />}
        />

        <StatCard
          title="Archived"
          value={stats.archived}
          icon={<Archive color="black" />}
        />

      </div>
      <h2 className="text-2xl font-bold mt-14 mb-6 text-black dark:text-white">
  Quick Actions
</h2>

<div className="grid md:grid-cols-3 gap-6">

<QuickActionCard
  title="New Development"
  description="Create a new development."
  icon={<Plus color="black" />}
  onClick={() => navigate("/admin/developments/new")}
/>
  <QuickActionCard
    title="New Listing"
    description="Add listings to a development."
    icon={<Building color="black" />}
    onClick={() => navigate("/admin/listings/new")}
  />

  <QuickActionCard
    title="Invite Editor"
    description="Allow another user to manage content."
    icon={<UserPlus color="black" />}
  />

</div>

    

    </DashboardLayout>
  );
}