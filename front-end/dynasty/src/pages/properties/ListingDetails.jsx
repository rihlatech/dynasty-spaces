import { useEffect, useState , useRef} from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  MessageCircle,
  PlayCircle,
  X,
  Play,
  // Maximize,
} from "lucide-react";

import { supabase } from "../../config/SupabaseClient";

import ListingsCarousel from "../../components/website/ListingsCarousel";


export default function ListingDetails() {

  const { listingId } = useParams();
  const navigate = useNavigate();

  const [listing, setListing] = useState(null);
  const [images, setImages] = useState([]);
  const [currentImage, setCurrentImage] = useState(0);

  const [relatedListings, setRelatedListings] = useState([]);
  // const relatedCarouselRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [relatedLoading, setRelatedLoading] = useState(true);

  const [showVirtualTourModal, setShowVirtualTourModal] = useState(false);
  const [showVirtualTourVideo, setShowVirtualTourVideo] = useState(false);


  // =========================================================
  // MEDIA URL
  // =========================================================

  const getMediaUrl = (mediaUrl) => {

    if (!mediaUrl) {
      return "/placeholder-property.jpg";
    }

    if (
      mediaUrl.startsWith("http://") ||
      mediaUrl.startsWith("https://")
    ) {
      return mediaUrl;
    }

    const { data } = supabase.storage
      .from("listing-media")
      .getPublicUrl(mediaUrl);

    return (
      data?.publicUrl ||
      "/placeholder-property.jpg"
    );

  };


  // =========================================================
  // FETCH LISTING
  // =========================================================

  const fetchListing = async () => {

    try {

      setLoading(true);

      const { data, error } = await supabase

        .from("listings")

        .select(`
          *,
            listing_media (
            media_url,
            is_primary
          )
        `)

        .eq("id", listingId)

        .single();


      if (error) throw error;


      setListing(data);


      // -------------------------------------------------------
      // Prepare images
      // -------------------------------------------------------

      const media =
        data.listing_media || [];


      const sortedMedia = [

        ...media.filter(
          (image) => image.is_primary
        ),

        ...media.filter(
          (image) => !image.is_primary
        ),

      ];


      setImages(

        sortedMedia.map(
          (image) =>
            getMediaUrl(image.media_url)
        )

      );


    } catch (error) {

      console.error(
        "Fetch listing details error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };


  // =========================================================
  // FETCH RELATED LISTINGS
  // =========================================================

  const fetchRelatedListings = async () => {

    try {

      setRelatedLoading(true);


      const { data, error } = await supabase

        .from("listings")

        .select(`
          *,
          listing_media (
            media_url,
            is_primary
          )
        `)

        .eq("status", "published")

        .neq("id", listingId)

        .limit(6);


      if (error) throw error;


      setRelatedListings(data || []);


    } catch (error) {

      console.error(
        "Fetch related listings error:",
        error
      );

    } finally {

      setRelatedLoading(false);

    }

  };


  // =========================================================
  // PAGE LOAD
  // =========================================================

  useEffect(() => {

    fetchListing();

    fetchRelatedListings();

  }, [listingId]);


  // =========================================================
  // IMAGE NAVIGATION
  // =========================================================

  const previousImage = () => {

    if (!images.length) return;


    setCurrentImage(

      (currentImage - 1 + images.length) %
      images.length

    );

  };


  const nextImage = () => {

    if (!images.length) return;


    setCurrentImage(

      (currentImage + 1) %
      images.length

    );

  };

  // =========================================================
// LOADING SKELETON
// =========================================================

if (loading) {

  return (
    <>
   <Helmet>
  <title>
    {listing?.title
      ? `${listing.title} | Dynasty Spaces`
      : "Property Details | Dynasty Spaces"}
  </title>

  <meta
    name="description"
    content={
      listing?.description
        ? listing.description.slice(0, 160)
        : "Explore this property with Dynasty Spaces."
    }
  />

  <link
    rel="canonical"
    href={`https://dynastyspace.com/properties/${listingId}`}
  />

  <meta
    property="og:title"
    content={
      listing?.title
        ? `${listing.title} | Dynasty Spaces`
        : "Property Details | Dynasty Spaces"
    }
  />

  <meta
    property="og:description"
    content={
      listing?.description
        ? listing.description.slice(0, 160)
        : "Explore this property with Dynasty Spaces."
    }
  />

  <meta
    property="og:url"
    content={`https://dynastyspace.com/properties/${listingId}`}
  />

  <meta
    property="og:type"
    content="website"
  />

  {images.length > 0 && (
    <meta
      property="og:image"
      content={images[0]}
    />
  )}

  {listing && (
    <script type="application/ld+json">
      {JSON.stringify({
        "@context": "https://schema.org",
        "@type": "RealEstateListing",
        name: listing.title,
        description:
          listing.description ||
          `Explore ${listing.title}, a property available through Dynasty Spaces.`,
        url: `https://dynastyspace.com/properties/${listingId}`,

        image: images.length > 0 ? images : undefined,

        offers: listing.price
          ? {
              "@type": "Offer",
              price: listing.price,
              priceCurrency: listing.currency || "KES",
              url: `https://dynastyspace.com/properties/${listingId}`,
            }
          : undefined,

        address: listing.location
          ? {
              "@type": "PostalAddress",
              addressLocality: listing.location,
              addressCountry: "KE",
            }
          : undefined,

        numberOfBedrooms: listing.bedrooms || undefined,
      })}
    </script>
  )}
</Helmet>


    <main
      className="
        min-h-screen
        bg-[#050505]
        text-white

        pt-24
        sm:pt-28
        pb-16
        sm:pb-20
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-4
          sm:px-6
          lg:px-8
        "
      >

        {/* BACK BUTTON SKELETON */}

        <div
          className="
            mb-6
            sm:mb-8

            h-5
            w-36

            rounded
            bg-white/10

            animate-pulse
          "
        />


        {/* =====================================================
            MAIN CONTENT SKELETON
        ===================================================== */}

        <div
          className="
            grid
            grid-cols-1
            lg:grid-cols-2

            gap-8
            lg:gap-10
          "
        >

          {/* ===================================================
              GALLERY SKELETON
          =================================================== */}

          <section>

            {/* MAIN IMAGE */}

            <div
              className="
                w-full

                h-[280px]
                sm:h-[380px]
                lg:h-[55vh]
                lg:max-h-[580px]

                rounded-xl
                sm:rounded-2xl

                bg-white/10

                animate-pulse
              "
            />


            {/* THUMBNAILS */}

            <div
              className="
                mt-4

                flex
                gap-3

                overflow-hidden
              "
            >

              {[1, 2, 3, 4, 5].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      w-16
                      h-16
                      sm:w-20
                      sm:h-20

                      shrink-0

                      rounded-lg

                      bg-white/10

                      animate-pulse
                    "
                  />

                )
              )}

            </div>


            {/* VIRTUAL TOUR BUTTON */}

            <div
              className="
                mt-6

                w-full
                h-14

                rounded-xl

                bg-white/10

                animate-pulse
              "
            />

          </section>


          {/* ===================================================
              PROPERTY DETAILS SKELETON
          =================================================== */}

          <section>

            {/* PROPERTY TYPE */}

            <div
              className="
                h-4
                w-40

                rounded

                bg-white/10

                animate-pulse
              "
            />


            {/* TITLE */}

            <div
              className="
                mt-5

                h-10
                sm:h-12

                w-full
                max-w-xl

                rounded

                bg-white/10

                animate-pulse
              "
            />


            {/* LOCATION */}

            <div
              className="
                mt-5

                h-5
                w-64

                rounded

                bg-white/10

                animate-pulse
              "
            />


            {/* PRICE */}

            <div className="mt-8">

              <div
                className="
                  h-4
                  w-24

                  rounded

                  bg-white/10

                  animate-pulse
                "
              />

              <div
                className="
                  mt-3

                  h-9

                  w-48

                  rounded

                  bg-white/10

                  animate-pulse
                "
              />

            </div>


            {/* QUICK DETAILS */}

            <div
              className="
                mt-8

                grid
                grid-cols-2

                gap-4
              "
            >

              {[1, 2, 3, 4].map(
                (item) => (

                  <div
                    key={item}
                    className="
                      h-24

                      rounded-xl

                      border
                      border-white/10

                      bg-white/[0.04]

                      p-4

                      animate-pulse
                    "
                  >

                    <div
                      className="
                        h-3
                        w-20

                        rounded

                        bg-white/10
                      "
                    />

                    <div
                      className="
                        mt-4

                        h-5
                        w-16

                        rounded

                        bg-white/10
                      "
                    />

                  </div>

                )
              )}

            </div>


            {/* WHATSAPP BUTTON */}

            <div
              className="
                mt-6
                sm:mt-8

                w-full
                h-14

                rounded-xl

                bg-white/10

                animate-pulse
              "
            />

          </section>

        </div>


        {/* =====================================================
            RELATED PROPERTIES SKELETON
        ===================================================== */}

        <section
          className="
            mt-14
            sm:mt-20
          "
        >

          {/* HEADER */}

          <div
            className="
              mb-8
            "
          >

            <div
              className="
                h-4
                w-28

                rounded

                bg-white/10

                animate-pulse
              "
            />

            <div
              className="
                mt-3

                h-9

                w-64

                rounded

                bg-white/10

                animate-pulse
              "
            />

          </div>


          {/* CARDS */}

          <div
            className="
              grid

              grid-cols-1
              sm:grid-cols-2
              lg:grid-cols-3

              gap-6
            "
          >

            {[1, 2, 3].map(
              (item) => (

                <div
                  key={item}
                  className="
                    overflow-hidden

                    rounded-xl

                    border
                    border-white/10

                    bg-white/[0.03]

                    animate-pulse
                  "
                >

                  {/* IMAGE */}

                  <div
                    className="
                      h-56

                      bg-white/10
                    "
                  />


                  {/* CONTENT */}

                  <div className="p-5">

                    <div
                      className="
                        h-5
                        w-3/4

                        rounded

                        bg-white/10
                      "
                    />

                    <div
                      className="
                        mt-4

                        h-4
                        w-1/2

                        rounded

                        bg-white/10
                      "
                    />

                    <div
                      className="
                        mt-5

                        h-6
                        w-32

                        rounded

                        bg-white/10
                      "
                    />

                  </div>

                </div>

              )
            )}

          </div>

        </section>

      </div>

    </main>
    </>

  );

}


  // =========================================================
  // NOT FOUND
  // =========================================================

  if (!listing) {

    return (

      <div
        className="
          min-h-screen
          bg-[#050505]

          flex
          flex-col
          items-center
          justify-center

          text-center
          px-6
        "
      >

        <h1
          className="
            text-3xl
            font-bold
            text-white
          "
        >

          Property Not Found

        </h1>


        <button

          onClick={() =>
            navigate("/properties")
          }

          className="
            mt-6

            px-6
            py-3

            border
            border-[#C9A758]

            text-[#C9A758]

            hover:bg-[#C9A758]
            hover:text-black

            transition
          "
        >

          Back to Properties

        </button>

      </div>

    );

  }


  return (
    <main
  className="
    min-h-screen
    bg-[#050505]

    pt-24
    sm:pt-28

    pb-16
    sm:pb-20
  "
>

  <div
  className="
    max-w-7xl
    mx-auto

    px-4
    sm:px-6
    lg:px-8
  "
>
    <button
  onClick={() => navigate("/properties")}
  className="
  mb-6
  sm:mb-8

  flex
  items-center
  gap-2

  text-sm
  sm:text-base

  text-gray-400
  hover:text-[#C9A758]

  transition
"
>
  <ArrowLeft size={19} />
  Back to Properties
</button>

{/* ----------------------GALLERY------------------ */}

<div
  className="
    grid
    grid-cols-1
    lg:grid-cols-2

    gap-8
    lg:gap-10

    items-start
  "
>

  {/* GALLERY */}

  <section>

    {/* Main Image */}
<div
  className="
    relative
    w-full

    h-[280px]
    sm:h-[380px]
    lg:h-[55vh]
    lg:max-h-[580px]

    bg-[#111111]

    overflow-hidden
    rounded-xl
    sm:rounded-2xl
  "
>

      {images.length > 0 ? (

        <img
          src={images[currentImage]}
          alt={listing.title}
          className="
            w-full
            h-full
            object-cover
          "
        />

      ) : (

        <div
          className="
            w-full
            h-full
            flex
            items-center
            justify-center
            text-gray-500
          "
        >
          No images available
        </div>

      )}

      {/* Previous */}

      {images.length > 1 && (
        <button
          onClick={previousImage}
          className="
  absolute

  left-3
  sm:left-4

  top-1/2
  -translate-y-1/2

  w-9
  h-9
  sm:w-11
  sm:h-11

  flex
  items-center
  justify-center

  rounded-full

  bg-black/60
  backdrop-blur-md

  text-white

  hover:bg-[#C9A758]
  hover:text-black

  transition
"
        >
          <ArrowLeft size={20} />
        </button>
      )}

      {/* Next */}

{images.length > 1 && (
  <button
    onClick={nextImage}
    className="
      absolute

      right-3
      sm:right-4

      top-1/2
      -translate-y-1/2

      w-9
      h-9
      sm:w-11
      sm:h-11

      flex
      items-center
      justify-center

      rounded-full

      bg-black/60
      backdrop-blur-md

      text-white

      hover:bg-[#C9A758]
      hover:text-black

      transition
    "
  >
    <ArrowRight size={20} />
  </button>
)}

    </div>


    {/* Thumbnails */}

    {images.length > 1 && (

      <div
        className="
          mt-4
          flex
          gap-3
          overflow-x-auto
          pb-2
        "
      >

        {images.map((image, index) => (

          <button
            key={`${image}-${index}`}
            onClick={() => setCurrentImage(index)}
            className={`
  w-16
  h-16
  sm:w-20
  sm:h-20

  shrink-0
  overflow-hidden

  rounded-lg
  scrollerbar-hide

  border
  transition

  ${
    currentImage === index
      ? "border-[#C9A758]"
      : "border-white/10 hover:border-white/40"
  }
`}
          >

            <img
              src={image}
              alt={`${listing.title} ${index + 1}`}
              className="
                w-full
                h-full
                object-cover
              "
            />

          </button>

        ))}

      </div>

    )}

    {/* VIRTUAL TOUR */}

{(listing.virtual_tour_path || listing.virtual_tour_url) && (

  <button
  type="button"
  onClick={() => setShowVirtualTourModal(true)}
  className="
    mt-6
    w-full
    flex
    items-center
    justify-center
    gap-3
    px-6
    py-4
    rounded-xl
    border
    border-[#C9A758]/40
    bg-[#C9A758]/10
    text-[#C9A758]
    font-semibold
    hover:bg-[#C9A758]
    hover:text-black
    transition
    duration-300
  "
>
  <PlayCircle size={21} />

  Virtual Tour
</button>

)}

  </section>
  {/* =========================================================
    PROPERTY DETAILS
========================================================= */}

<section
  className="
    flex
    flex-col
    justify-start
    lg:pt-2
  "
>

 {/* PROPERTY TYPE & LISTING TYPE */}

<div
  className="
    flex
    flex-wrap
    items-center
    gap-2
    sm:gap-3
  "
>

  <span
    className="
      text-sm
      uppercase
      tracking-[0.3em]
      text-[#C9A758]
    "
  >
    {listing.property_type || "Premium Property"}
  </span>

  {/* LISTING TYPE */}

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


  {/* TITLE */}

  <h1
  className="
    mt-3
    sm:mt-4

    text-3xl
    sm:text-4xl
    lg:text-5xl

    font-bold

    text-white

    leading-tight

    break-words
  "
>
  {listing.title}
</h1>


  {/* LOCATION */}

  <div
   className="
  mt-4
  sm:mt-5

  flex
  items-start

  gap-2

  text-sm
  sm:text-base

  text-gray-400
"
  >

   <MapPin
  size={20}
  className="text-[#C9A758] shrink-0 mt-0.5"
/>

    <span>
      {listing.location}
    </span>

  </div>


  {/* PRICE */}

  {listing.price && (

    <div className="mt-8">

      <p className="text-gray-500 text-sm">
        Starting From
      </p>

      <p
  className="
    mt-1

    text-2xl
    sm:text-3xl

    font-bold
    text-[#C9A758]

    break-words
  "
>
        {listing.currency || "KES"}{" "}
        {Number(listing.price).toLocaleString()}
      </p>

    </div>

  )}


  {/* QUICK DETAILS */}

  <div
    className="
      mt-8
      grid
      grid-cols-2
      gap-4
    "
  >

    <div className="border border-white/10 bg-white/5 rounded-xl p-4">
      <p className="text-gray-500 text-sm">
        Bedrooms
      </p>

      <p className="mt-1 text-white font-semibold">
        {listing.bedrooms || "N/A"}
      </p>
    </div>


    <div className="border border-white/10 bg-white/5 rounded-xl p-4">
      <p className="text-gray-500 text-sm">
        Ensuite
      </p>

      <p className="mt-1 text-white font-semibold">
        {listing.ensuite_status || "N/A"}
      </p>
    </div>


    <div className="border border-white/10 bg-white/5 rounded-xl p-4">
      <p className="text-gray-500 text-sm">
        Area
      </p>

      <p className="mt-1 text-white font-semibold">
        {listing.area_sqm
          ? `${listing.area_sqm} m²`
          : "N/A"}
      </p>
    </div>


    <div className="border border-white/10 bg-white/5 rounded-xl p-4">
      <p className="text-gray-500 text-sm">
        Available Units
      </p>

      <p className="mt-1 text-white font-semibold">
        {listing.available_units || "N/A"}
      </p>
    </div>

  </div>



  {/* CONTACT */}

<div className="mt-6 sm:mt-8">

  <a
    href="https://wa.me/254797983216"
    target="_blank"
    rel="noopener noreferrer"
    className="
      w-full
      flex
      items-center
      justify-center
      gap-3

      px-4
      sm:px-6

      py-3.5
      sm:py-4

      rounded-xl

      bg-[#25D366]
      text-white

      font-semibold

      hover:bg-[#20bd5a]

      transition
      duration-300

      shadow-lg
      shadow-[#25D366]/10
    "
  >
    <MessageCircle size={20} />

    Chat on WhatsApp
  </a>

</div>

</section>


</div>


{/* =========================================================
    YOU MAY ALSO LIKE
========================================================= */}

<section className="mt-14 sm:mt-20">

  {/* SECTION HEADER */}

  <div className="mb-8">

    <p
      className="
        text-sm
        uppercase
        tracking-[0.3em]
        text-[#C9A758]
      "
    >
      Explore More
    </p>

    <h2
      className="
        mt-2
        text-3xl
        md:text-4xl
        font-bold
        text-white
      "
    >
      You May Also Like
    </h2>

  </div>


  {/* RELATED LISTINGS */}

  {relatedLoading ? (

    <div className="py-12 text-center text-gray-500">
      Loading properties...
    </div>

  ) : relatedListings.length > 0 ? (

    <ListingsCarousel
      listings={relatedListings}
    />

  ) : (

    <div className="py-12 text-center text-gray-500">
      No other properties available.
    </div>

  )}

</section>



  </div>
{/* =========================================================
    VIRTUAL TOUR OPTIONS MODAL
========================================================= */}

{showVirtualTourModal && (

  <div
    className="
      fixed
      inset-0
      z-[100]
      flex
      items-center
      justify-center
      bg-black/80
      backdrop-blur-sm
      p-6
    "
    onClick={() => setShowVirtualTourModal(false)}
  >

    <div
      className="
        relative
        w-full
        max-w-lg
        rounded-3xl
        border
        border-white/10
        bg-[#101010]
        shadow-2xl
        overflow-hidden
      "
      onClick={(e) => e.stopPropagation()}
    >

      {/* CLOSE */}

      <button
        type="button"
        onClick={() => setShowVirtualTourModal(false)}
        className="
          absolute
          top-4
          right-4
          z-10

          w-10
          h-10

          rounded-full

          bg-black/60
          backdrop-blur-md

          flex
          items-center
          justify-center

          text-white

          hover:bg-[#C9A758]
          hover:text-black

          transition
        "
      >
        <X size={20} />
      </button>


      {/* THUMBNAIL */}

      <div
        className="
          relative
          h-64
          bg-black
          overflow-hidden
        "
      >

        {listing.virtual_tour_path ? (

          <video
            src={
              supabase.storage
                .from("virtual-tours")
                .getPublicUrl(listing.virtual_tour_path)
                .data.publicUrl
            }
            className="
              w-full
              h-full
              object-cover
            "
            muted
          />

        ) : (

          <div
            className="
              w-full
              h-full
              flex
              items-center
              justify-center
              bg-[#151515]
            "
          >
            <Play
              size={55}
              className="text-[#C9A758]"
            />
          </div>

        )}

        {/* PLAY OVERLAY */}

        <div
          className="
            absolute
            inset-0
            flex
            items-center
            justify-center
            bg-black/30
          "
        >

          <div
            className="
              w-16
              h-16
              rounded-full
              bg-[#C9A758]
              text-black
              flex
              items-center
              justify-center
              shadow-xl
            "
          >
            <Play
              size={26}
              fill="currentColor"
            />
          </div>

        </div>

      </div>


      {/* CONTENT */}

      <div className="p-7">

        <p
          className="
            text-xs
            uppercase
            tracking-[0.3em]
            text-[#C9A758]
          "
        >
          Dynasty Spaces
        </p>

        <h2
          className="
            mt-2
            text-2xl
            font-bold
            text-white
          "
        >
          Take a Virtual Tour
        </h2>

        <p
          className="
            mt-3
            text-gray-400
            leading-relaxed
          "
        >
          Explore this property virtually before
          scheduling a viewing.
        </p>


        {/* VIEW NOW */}

        {listing.virtual_tour_path && (

          <button
            type="button"
            onClick={() => {
              setShowVirtualTourModal(false);
              setShowVirtualTourVideo(true);
            }}
            className="
              mt-6
              w-full

              flex
              items-center
              justify-center
              gap-2

              rounded-xl

              bg-[#C9A758]
              text-black

              py-3.5

              font-semibold

              hover:bg-[#D8B968]

              transition
            "
          >

            <Play size={18} fill="currentColor" />

            View Now

          </button>

        )}


        {/* YOUTUBE */}

        {listing.virtual_tour_url && (

          <a
  href={listing.virtual_tour_url}
  target="_blank"
  rel="noopener noreferrer"
  className="
    mt-3
    w-full
    flex
    items-center
    justify-center
    gap-2
    rounded-xl
    border
    border-white/10
    bg-white/[0.04]
    text-white
    py-3.5
    font-semibold
    hover:border-[#C9A758]/50
    hover:bg-white/[0.07]
    transition
  "
 >
  <PlayCircle size={18} />

  View on YouTube
 </a>

        )}


        {/* CANCEL */}

        <button
          type="button"
          onClick={() => setShowVirtualTourModal(false)}
          className="
            mt-3
            w-full
            py-3
            text-sm
            text-gray-500
            hover:text-white
            transition
          "
        >
          Cancel
        </button>

      </div>

    </div>

  </div>

)}

{/* =========================================================
    VIRTUAL TOUR VIDEO MODAL
========================================================= */}

{showVirtualTourVideo && listing.virtual_tour_path && (

  <div
    className="
      fixed
      inset-0
      z-[110]
      bg-black/95
      backdrop-blur-md
      flex
      items-center
      justify-center
      p-4
    "
  >

    {/* VIDEO CONTAINER */}

    <div
      className="
        relative
        w-full
        max-w-6xl
        rounded-2xl
        overflow-hidden
        bg-black
        border
        border-white/10
        shadow-2xl
      "
    >

      {/* CLOSE */}

      <button
        type="button"
        onClick={() => setShowVirtualTourVideo(false)}
        className="
          absolute
          top-4
          right-4
          z-20

          w-10
          h-10

          rounded-full

          bg-black/70
          backdrop-blur-md

          flex
          items-center
          justify-center

          text-white

          hover:bg-[#C9A758]
          hover:text-black

          transition
        "
      >
        <X size={20} />
      </button>


      {/* VIDEO */}

      <video
        src={
          supabase.storage
            .from("virtual-tours")
            .getPublicUrl(listing.virtual_tour_path)
            .data.publicUrl
        }
        controls
        autoPlay
        playsInline
        className="
          w-full
          max-h-[85vh]
          object-contain
          bg-black
        "
      />

    </div>

  </div>

)}

</main>

    

  );

}

