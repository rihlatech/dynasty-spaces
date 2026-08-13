import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { ArrowLeft, MapPin } from "lucide-react";

import { supabase } from "../../config/SupabaseClient";

import DevelopmentListingCard from "../../components/website/DevelopmentListingCard";

export default function DevelopmentDetails() {

  const { developmentId } = useParams();
  console.log("Route developmentId:", developmentId);

  const navigate = useNavigate();


  const [development, setDevelopment] = useState(null);

  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);

  const fetchDevelopment = async () => {

  try {
    console.log("Fetching ID:", developmentId);

    const { data, error } = await supabase
      .from("developments")
      .select(`
        *,
        listings (
          *,
          listing_media (
            media_url,
            is_primary
          )
        )
      `)
      .eq("id", developmentId)
      .single();


    if (error) throw error;

    console.log("Development ID:", developmentId);
console.log("Fetched development:", data);


    setDevelopment(data);

    setListings(
      data.listings || []
    );


  } 
  
  catch (error) {
  console.error("Fetch development details error:", error);
}

finally {

    setLoading(false);

  }

};

useEffect(() => {

  fetchDevelopment();

}, [developmentId]);

const heroImage = development?.cover_image
  ? development.cover_image.startsWith("http")
    ? development.cover_image
    : supabase.storage
        .from("development-media")
        .getPublicUrl(development.cover_image)
        .data.publicUrl
  : "/placeholder-property.jpg";

  return (

    <>

    <section
  className="
    relative
    h-[70vh]
    min-h-[600px]
    overflow-hidden
    flex
    items-end
  "
>

  {/* Background Image */}

  <img
 src={heroImage}
    alt={development?.name}
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  />


  {/* Overlay */}

  <div
    className="
      absolute
      inset-0
      bg-black/70
    "
  />


  {/* Content */}

  <div
    className="
      relative
      z-10

      max-w-7xl
      mx-auto

      px-6
      pb-20

      w-full
    "
  >


    {/* Back Button */}

    <button
      onClick={() =>
        navigate("/developments")
      }
      className="
        mb-8

        flex
        items-center
        gap-2

        text-white

        hover:text-[#C9A758]

        transition
      "
    >

      <ArrowLeft size={20}/>

      Back to Developments

    </button>



    {/* Title */}

    <span
      className="
        uppercase
        tracking-[0.3em]

        text-sm

        text-[#C9A758]
      "
    >
      Premium Development
    </span>



    <h1
      className="
        mt-4

        text-5xl
        md:text-7xl

        font-bold

        text-white
      "
    >
      {development?.name}
    </h1>



    {/* Location */}

    <div
      className="
        flex
        items-center
        gap-2

        mt-6

        text-gray-300
        text-lg
      "
    >

      <MapPin
        className="text-[#C9A758]"
      />

      {development?.location}

    </div>


  </div>


</section>



{/* ========================================================= */}
{/* AVAILABLE PROPERTIES */}
{/* ========================================================= */}

<section
  className="
    py-20
    bg-[#050505]
  "
>

  <div
    className="
      max-w-7xl
      mx-auto
      px-6
    "
  >

    <span
      className="
        uppercase
        tracking-[0.3em]
        text-sm
        text-[#C9A758]
      "
    >
      Available Collection
    </span>

    <h2
      className="
        mt-4
        text-4xl
        font-bold
        text-white
      "
    >
      Available Properties
    </h2>

    <p
      className="
        mt-5
        text-gray-400
        max-w-2xl
      "
    >
      Browse every available property within this development.
    </p>


    <div
      className="
        mt-14
        grid
        md:grid-cols-2
        gap-10
      "
    >

      {listings.map((listing) => (

        <DevelopmentListingCard
          key={listing.id}
          listing={listing}
        />

      ))}

    </div>

  </div>

</section>


</>
  );

}