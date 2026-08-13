import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";

import ListingCard from "../../components/website/ListingCard";


export default function DevelopmentListingsPublic() {

  const { developmentId } = useParams();

  const [listings, setListings] = useState([]);

  const [loading, setLoading] = useState(true);


  const fetchListings = async () => {

    try {

      const { data, error } = await supabase
        .from("listings")
        .select(`
          *,
          listing_media (
            media_url,
            is_primary
          )
        `)
        .eq("development_id", developmentId)
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        });


      if(error) throw error;


      setListings(data || []);


    } catch(error){

      console.error(
        "Fetch development listings error:",
        error
      );


    } finally {

      setLoading(false);

    }

  };


  useEffect(() => {

    fetchListings();

  }, [developmentId]);



  return (

    <>

      <section
        className="
          py-32
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


          <h1
            className="
              text-5xl
              font-bold
              text-white
            "
          >
            Available Properties
          </h1>


          <p
            className="
              mt-4
              text-gray-400
            "
          >
            Explore available properties in this development.
          </p>



          {loading ? (

            <div
              className="
                py-20
                text-center
                text-gray-400
              "
            >
              Loading properties...
            </div>


          ) : listings.length === 0 ? (

            <div
              className="
                py-20
                text-center
                text-gray-400
              "
            >
              No properties available.
            </div>


          ) : (

            <div
              className="
                mt-14
                grid
                md:grid-cols-2
                lg:grid-cols-3
                gap-10
              "
            >

              {listings.map((listing)=>(

                <ListingCard
                  key={listing.id}
                  listing={listing}
                />

              ))}

            </div>

          )}


        </div>

      </section>


    </>

  );

}