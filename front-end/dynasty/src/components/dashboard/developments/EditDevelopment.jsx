import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "../../../config/SupabaseClient";

import DevelopmentForm from "./DevelopmentForm";

export default function EditDevelopment() {
  const { id } = useParams();
  const [loading, setLoading] = useState(true);

const [development, setDevelopment] = useState(null);

useEffect(() => {
  const fetchDevelopment = async () => {
    try {
      setLoading(true);

      const { data, error } = await supabase
        .from("developments")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;

      setDevelopment(data);

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchDevelopment();
}, [id]);



  return (
    <div className="min-h-screen bg-[#F8F9FB] dark:bg-[#0B0B0B] p-6">

    <div className="max-w-7xl mx-auto">

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-[#101F34] dark:text-white">
          Edit Development
        </h1>

        <p className="mt-2 text-gray-500 dark:text-gray-400">
          Update your development details.
        </p>

      </div>

      {loading ? (

        <div className="text-center py-20">
          <p className="text-gray-500 dark:text-gray-400">
            Loading development...
          </p>
        </div>

      ) : (

        <DevelopmentForm
          mode="edit"
          development={development}
        />

      )}

    </div>

  </div>








  );
}