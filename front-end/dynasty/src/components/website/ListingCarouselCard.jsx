import { MapPin, BedDouble, Bath, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";

export default function ListingCarouselCard({
  listing,
}) {

  const navigate = useNavigate();

  const primaryMedia =
    listing.listing_media?.find((item) => item.is_primary) ||
    listing.listing_media?.[0];

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
        relative
        rounded-3xl
        border
        border-white/10
        bg-[#0F0F0F]
        overflow-hidden
      "
    >

      <div
        className="
          absolute
          inset-3
          rounded-[22px]
          border
          border-[#C9A758]/40
          pointer-events-none
        "
      />

      <div
        className="
          relative
          z-10
          flex
          flex-col
        "
      >

        {/* Image */}

        <div
          className="
            h-52
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
              transition
              duration-500
              hover:scale-105
            "
          />

        </div>


        {/* Content */}

        <div className="p-6">

          <div className="flex items-center gap-3 flex-wrap">

  <p
    className="
      text-sm
      uppercase
      tracking-[0.25em]
      text-[#C9A758]
    "
  >
    {listing.property_type || "Property"}
  </p>

  <span
  className="
    px-3
    py-1
    rounded-full
    text-xs
    font-semibold
    border
    border-[#C9A758]/40
    bg-[#C9A758]/10
    text-[#C9A758]
  "
>
  {listing.listing_type?.toLowerCase() === "rent" ||
  listing.listing_type?.toLowerCase() === "for_rent"
    ? "For Rent"
    : listing.listing_type?.toLowerCase() === "both"
    ? "For Sale & Rent"
    : "For Sale"}
</span>

</div>


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


          <div
            className="
              flex
              items-center
              gap-2
              mt-5
              text-gray-400
            "
          >

            <MapPin
              size={18}
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
              gap-5
              mt-6
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
                size={18}
                className="text-[#C9A758]"
              />

              {listing.bedrooms} Bedrooms

            </div>


            <div
              className="
                flex
                items-center
                gap-2
              "
            >

             <Bath
  size={18}
  className="text-[#C9A758]"
/>

{listing.ensuite_status || "Not specified"}

            </div>

          </div>


          {/* Price */}

          <div
            className="
              flex
              items-center
              justify-between
              mt-10
            "
          >

            <div>

              <p className="text-gray-500">
                Starting From
              </p>

              <h4
                className="
                  text-2xl
                  font-bold
                  text-[#C9A758]
                "
              >
                KES {Number(listing.price).toLocaleString()}
              </h4>

            </div>


            {/* View Listing */}

            <button
              onClick={() =>
                navigate(`/properties/${listing.id}`)
              }
              aria-label={`View ${listing.title}`}
              className="
                w-12
                h-12
                rounded-full
                border
                border-[#C9A758]
                text-[#C9A758]
                hover:bg-[#C9A758]
                hover:text-black
                transition
                duration-300
                flex
                items-center
                justify-center
              "
            >

              <ArrowRight size={22} />

            </button>

          </div>

        </div>

      </div>

    </div>

  );
}