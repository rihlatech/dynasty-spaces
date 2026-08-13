import { useState, useEffect } from "react";

import { supabase } from "../../config/SupabaseClient";

import DevelopmentCard from "../../components/website/DevelopmentCard";
import publicDevelopment from "../../assets/images/PublicDevelopment.avif";


export default function PublicDevelopments() {

  const [search, setSearch] = useState("");
  const [developments, setDevelopments] = useState([]);
const [loading, setLoading] = useState(true);

const fetchDevelopments = async () => {

  try {

    const { data, error } = await supabase
      .from("developments")
      .select("*")
      .eq("status", "published")
      .order("created_at", {
        ascending: false,
      });

    if (error) throw error;

    setDevelopments(data || []);

  } catch (error) {

    console.error(error);

  } finally {

    setLoading(false);

  }

};

useEffect(() => {

  fetchDevelopments();

}, []);

  return (

    <>

      {/* ========================================================= */}
      {/* DEVELOPMENTS HERO */}
      {/* ========================================================= */}
      
<section
  className="
    relative
    min-h-[75vh]
    flex
    items-center
    overflow-hidden
    pt-24
  "
>

  {/* Background Image */}

<div
  className="
    absolute
    inset-0
  "
>

  <img
    src={publicDevelopment}
    alt="Developments"
    className="
      w-full
      h-full
      object-cover
    "
  />

</div>

{/* Dark Overlay */}

<div
  className="
    absolute
    inset-0
    bg-black/65
  "
/>

{/* Gold Gradient */}

<div
  className="
    absolute
    inset-0
    bg-gradient-to-r
    from-black/80
    via-black/50
    to-black/70
  "
/>

        {/* Background Glow */}

        <div
          className="
            absolute
            top-0
            left-1/2
            -translate-x-1/2

            w-[700px]
            h-[700px]

            rounded-full

            bg-[#C9A758]/10

            blur-[180px]
          "
        />



       <div
  className="
    relative
    z-10

    max-w-7xl
    mx-auto

    w-full
    px-6

    flex
    justify-start
  "
>

  <div
  className="
    max-w-2xl
  "
>

          <span
            className="
              inline-block
              mb-5

              uppercase
              tracking-[0.3em]

              text-sm

              text-[#C9A758]
            "
          >
            Premium Collection
          </span>


          <h1
            className="
              text-5xl
              md:text-6xl

              font-bold

              text-white
            "
          >
            Explore Developments
          </h1>


          <p
            className="
              mt-6

              max-w-3xl

              text-gray-400
              leading-8
              text-lg
            "
          >
            Discover premium residential developments
            thoughtfully designed for exceptional living,
            timeless architecture and long-term investment.
          </p>



          {/* Search */}

          <div
            className="
              mt-12

              max-w-3xl
            "
          >

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              placeholder="Search developments..."

              className="
                w-full

                px-7
                py-5

                rounded-2xl

                bg-white/5

                border
                border-[#C9A758]/40

                backdrop-blur-md

                text-white

                placeholder:text-gray-500

                outline-none

                focus:border-[#C9A758]
              "
            />

          </div>
          </div>

        </div>

      </section>

      {/* ======================================FILTERS============================= */}

      {/* ========================================================= */}
                  {/* FILTERS */}
      {/* ========================================================= */}

<section
  className="
    bg-[#0A0A0A]
    border-t
    border-white/5
    border-b
    border-white/5
  "
>

  <div
    className="
      max-w-7xl
      mx-auto
      px-6
      py-8
    "
  >

    {/* Statistics */}

    <div
      className="
        flex
        flex-wrap
        gap-10
        mb-8
      "
    >

      <div>

        <p className="text-gray-500 text-sm">
          Developments
        </p>

        <h3 className="text-white text-3xl font-bold">
          --
        </h3>

      </div>

      <div>

        <p className="text-gray-500 text-sm">
          Listings
        </p>

        <h3 className="text-white text-3xl font-bold">
          --
        </h3>

      </div>

      <div>

        <p className="text-gray-500 text-sm">
          Locations
        </p>

        <h3 className="text-white text-3xl font-bold">
          --
        </h3>

      </div>

    </div>



    {/* Filters */}

    <div
      className="
        grid
        md:grid-cols-3
        gap-5
      "
    >

      <input
        placeholder="Search development..."
        className="
          bg-[#121212]
          border
          border-white/10
          rounded-xl
          px-5
          py-4
          text-white
          outline-none
          focus:border-[#C9A758]
        "
      />

      <select
        className="
          bg-[#121212]
          border
          border-white/10
          rounded-xl
          px-5
          py-4
          text-white
        "
      >

        <option>All Locations</option>

      </select>

      <select
        className="
          bg-[#121212]
          border
          border-white/10
          rounded-xl
          px-5
          py-4
          text-white
        "
      >

        <option>Newest First</option>

      </select>

    </div>

  </div>

</section>

{/* ========================================================= */}
{/* DEVELOPMENTS GRID */}
{/* ========================================================= */}

<section
  className="
    py-20
    bg-[#0A0A0A]
  "
>

  <div
    className="
      max-w-7xl
      mx-auto
      px-6
    "
  >

    {loading ? (

      <div
        className="
          py-20
          text-center
          text-gray-400
        "
      >
        Loading developments...
      </div>

    ) : developments.length === 0 ? (

      <div
        className="
          py-20
          text-center
          text-gray-400
        "
      >
        No developments found.
      </div>

    ) : (

      <div
        className="
          flex
          flex-col
          gap-10
        "
      >

        {developments.map((development) => (

          <DevelopmentCard
            key={development.id}
            development={development}
          />

        ))}

      </div>

    )}

  </div>

</section>

    </>

  );

}