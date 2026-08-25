import {
  MapPin,
  BedDouble,
  Bath,
  ArrowRight,
} from "lucide-react";

import { useNavigate } from "react-router-dom";

import { supabase } from "../../config/SupabaseClient";

export default function ListingCard({
  listing,
}) {

  const navigate = useNavigate();


  // =========================================================
  // PRIMARY MEDIA
  // =========================================================

  const primaryMedia =
    listing.listing_media?.find(
      (item) => item.is_primary
    ) ||
    listing.listing_media?.[0];


  const imageUrl = primaryMedia
    ? primaryMedia.media_url?.startsWith("http")
      ? primaryMedia.media_url
      : supabase.storage
          .from("listing-media")
          .getPublicUrl(
            primaryMedia.media_url
          )
          .data?.publicUrl
    : "/placeholder-property.jpg";


  // =========================================================
  // LISTING TYPE
  // =========================================================

  const listingType =
    listing.listing_type === "sale"
      ? "For Sale"
      : listing.listing_type === "rent"
      ? "For Rent"
      : listing.listing_type === "both"
      ? "For Sale & Rent"
      : "N/A";


  // =========================================================
  // PROPERTY DATA
  // =========================================================

  const propertyType =
    listing.property_type?.trim() || "N/A";


  const title =
    listing.title?.trim() || "N/A";


  const location =
    listing.location?.trim() || "N/A";


  const bedrooms =
    listing.bedrooms !== null &&
    listing.bedrooms !== undefined &&
    listing.bedrooms !== ""
      ? listing.bedrooms
      : "N/A";


  const ensuite =
    listing.ensuite_status?.trim()
      ? listing.ensuite_status
      : "N/A";


  const currency =
    listing.currency?.trim() || "N/A";


  const price =
    listing.price !== null &&
    listing.price !== undefined &&
    listing.price !== ""
      ? Number(listing.price).toLocaleString()
      : "N/A";


  // =========================================================
  // OPEN LISTING DETAILS
  // =========================================================

  const openDetails = () => {

    navigate(
      `/properties/${listing.id}`
    );

  };


  return (

    <article
      className="
        relative
        rounded-2xl
        sm:rounded-3xl

        border
        border-white/10

        bg-[#0F0F0F]

        overflow-hidden
      "
    >

      {/* =====================================================
          INNER BORDER
      ===================================================== */}

      <div
        className="
          absolute
          inset-1.5
          sm:inset-3

          rounded-[15px]
          sm:rounded-[22px]

          border
          border-[#C9A758]/30

          pointer-events-none

          z-20
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

        {/* ===================================================
            IMAGE
        =================================================== */}

        <div
  className="
    relative
    h-36
    sm:h-56
    lg:h-72
    overflow-hidden
  "
>
  <img
    src={imageUrl}
    alt={title}
    className="
      w-full
      h-full
      object-cover
      transition
      duration-500
      hover:scale-105
    "
  />

  {/* Listing Type Badge */}

  <div
    className="
      absolute
      top-3
      left-3
      sm:top-5
      sm:left-5

      px-3
      py-1.5
      sm:px-4
      sm:py-2

      rounded-full

      bg-black/75
      backdrop-blur-md

      border
      border-[#C9A758]/50

      text-[9px]
      sm:text-xs

      font-semibold

      text-[#C9A758]

      uppercase
      tracking-wide
    "
  >
    {listingType}
  </div>
</div>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <div
          className="
            p-3
            sm:p-5
            lg:p-8
          "
        >

          {/* PROPERTY TYPE */}

          <p
            className="
              text-[8px]
              sm:text-xs

              uppercase
              tracking-[0.12em]
              sm:tracking-[0.2em]

              text-[#C9A758]

              truncate
            "
          >
            {propertyType}
          </p>


          {/* TITLE */}

          <h3
            className="
              mt-1
              sm:mt-2

              text-sm
              sm:text-xl
              lg:text-3xl

              font-bold
              text-white

              line-clamp-2

              leading-tight
            "
          >
            {title}
          </h3>


          {/* LOCATION */}

          <div
            className="
              flex
              items-center
              gap-1
              sm:gap-2

              mt-2
              sm:mt-4

              text-[9px]
              sm:text-sm

              text-gray-400
            "
          >

            <MapPin
              size={12}
              className="
                shrink-0
                text-[#C9A758]

                sm:w-[16px]
                sm:h-[16px]
              "
            />

            <span className="truncate">
              {location}
            </span>

          </div>


          {/* =================================================
              PROPERTY DETAILS
          ================================================= */}

          <div
            className="
              grid
              grid-cols-2

              gap-x-2
              sm:gap-x-4

              gap-y-2
              sm:gap-y-3

              mt-4
              sm:mt-6

              text-[9px]
              sm:text-xs
              lg:text-sm

              text-gray-300
            "
          >

            {/* BEDROOMS */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-2

                min-w-0
              "
            >

              <BedDouble
                size={12}
                className="
                  shrink-0
                  text-[#C9A758]

                  sm:w-[16px]
                  sm:h-[16px]
                "
              />

              <span className="truncate">
                {bedrooms} Beds
              </span>

            </div>


            {/* ENSUITE */}

            <div
              className="
                flex
                items-center
                gap-1
                sm:gap-2

                min-w-0
              "
            >

              <Bath
                size={12}
                className="
                  shrink-0
                  text-[#C9A758]

                  sm:w-[16px]
                  sm:h-[16px]
                "
              />

              <span className="truncate">
                {ensuite}
              </span>

            </div>

          </div>


          {/* =================================================
              PRICE + BUTTON
          ================================================= */}

          <div
            className="
              flex
              items-end
              justify-between

              gap-2

              mt-5
              sm:mt-7
              lg:mt-10
            "
          >

            {/* PRICE */}

            <div className="min-w-0">

  <h4
    className="
      text-xs
      sm:text-lg
      lg:text-3xl
      font-bold
      text-[#C9A758]
      truncate
    "
  >
    {currency} {price}
  </h4>

</div>


            {/* DETAILS BUTTON */}

            <button
              type="button"
              onClick={openDetails}
              aria-label={`View ${title}`}
              className="
                shrink-0

                w-8
                h-8

                sm:w-11
                sm:h-11

                lg:w-14
                lg:h-14

                flex
                items-center
                justify-center

                rounded-full

                border
                border-[#C9A758]

                text-[#C9A758]

                hover:bg-[#C9A758]
                hover:text-black

                transition
              "
            >

              <ArrowRight
                size={14}
                className="
                  sm:w-[18px]
                  sm:h-[18px]

                  lg:w-[22px]
                  lg:h-[22px]
                "
              />

            </button>

          </div>

        </div>

      </div>

    </article>

  );

}