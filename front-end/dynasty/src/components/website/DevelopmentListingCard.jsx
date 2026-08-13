import { useNavigate } from "react-router-dom";
import {
  MapPin,
  BedDouble,
  Bath,
  ArrowRight,
} from "lucide-react";

import { supabase } from "../../config/SupabaseClient";


export default function DevelopmentListingCard({
  listing,
}) {
    
   const navigate= useNavigate();

 const primaryMedia =
  listing.listing_media?.find(
    (item) => item.is_primary
  ) || listing.listing_media?.[0];


  const imageUrl = primaryMedia
    ? primaryMedia.media_url.startsWith("http")
      ? primaryMedia.media_url
      : supabase.storage
          .from("listing-media")
          .getPublicUrl(primaryMedia.media_url)
          .data.publicUrl
    : "/placeholder-property.jpg";



  return (

    <div
      className="
        rounded-3xl
        overflow-hidden

        bg-[#0F0F0F]

        border
        border-white/10

        hover:border-[#C9A758]/50

        transition-all
        duration-300
      "
    >


      {/* Image */}

      <div
        className="
          h-56
          overflow-hidden
        "
      >

        <img
          src={imageUrl}
          alt={listing.title}

          className="
            w-full
            h-full

            object-cover

            hover:scale-105

            transition
            duration-500
          "
        />

      </div>



      {/* Content */}

      <div
        className="
          p-6
        "
      >


        <p
          className="
            uppercase
            text-sm
            tracking-[0.25em]
            text-[#C9A758]
          "
        >
          {listing.property_type}
        </p>



        <h3
          className="
            mt-3

            text-2xl
            font-bold

            text-white
          "
        >
          {listing.title}
        </h3>



        {/* Location */}

        <div
          className="
            flex
            items-center
            gap-2

            mt-4

            text-gray-400
          "
        >

          <MapPin
            size={17}
            className="text-[#C9A758]"
          />

          <span>
            {listing.location}
          </span>

        </div>



        {/* Details */}

        <div
          className="
            flex
            gap-6

            mt-5

            text-gray-300
          "
        >

          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <BedDouble
              size={17}
              className="text-[#C9A758]"
            />

            {listing.bedrooms}

          </div>



          <div
            className="
              flex
              items-center
              gap-2
            "
          >

            <Bath
              size={17}
              className="text-[#C9A758]"
            />

            Ensuite

          </div>


        </div>




        {/* Bottom */}

        <div
          className="
            flex
            items-center
            justify-between

            mt-8
          "
        >


          <div>

            <p
              className="
                text-gray-500
                text-sm
              "
            >
              Starting From
            </p>


            <h4
              className="
                text-xl
                font-bold
                text-[#C9A758]
              "
            >
              KES {Number(listing.price).toLocaleString()}
            </h4>


          </div>



          <button
             className="
              w-11
              h-11
              rounded-full

              border
              border-[#C9A758]

              text-[#C9A758]

              hover:bg-[#C9A758]
              hover:text-black

              transition
            "
          >

            <ArrowRight size={20}/>

          </button>


        </div>


      </div>


    </div>

  );

}