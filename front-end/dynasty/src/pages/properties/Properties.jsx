import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";

import { supabase } from "../../config/SupabaseClient";

import ListingCard from "../../components/website/ListingCard";
import PropertyFilters from "../../components/website/PropertyFilters";

import propertyHero from "../../assets/images/PublicDevelopment.avif";

export default function Properties() {

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Property types fetched from the database
  const [propertyTypes, setPropertyTypes] = useState([]);
  const [locations, setLocations] = useState([]);

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [filters, setFilters] = useState({
    search: "",
    location: "",
    propertyType: "",
    listingType: "",
    bedrooms: "",
    minPrice: "",
    maxPrice: "",
    sort: "newest",
  });

  // =========================================================
  // CLEAR FILTERS
  // =========================================================

  const clearFilters = () => {

    setFilters({
      search: "",
      location: "",
      propertyType: "",
      listingType: "",
      bedrooms: "",
      minPrice: "",
      maxPrice: "",
      sort: "newest",
    });

  };

  // =========================================================
  // FETCH PROPERTIES
  // =========================================================

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
        .eq("status", "published")
        .order("created_at", {
          ascending: false,
        });

      if (error) throw error;

      // =====================================================
      // SAVE LISTINGS
      // =====================================================

      const dataListings = data || [];

      setListings(dataListings);

      // =====================================================
      // GET UNIQUE PROPERTY TYPES FROM DATABASE
      // =====================================================

      const uniquePropertyTypes = [
        ...new Map(
          dataListings
            .map((listing) => listing.property_type)
            .filter(Boolean)
            .map((type) => {

              const normalized = type
                .toLowerCase()
                .trim()
                .replace(/s$/, "");

              return [normalized, normalized];

            })
        ).values(),
      ];

      setPropertyTypes(uniquePropertyTypes);

      //=============================================
      //GET UNIQUE LOCATION
      //=============================================
      const uniqueLocations = [
  ...new Set(
    dataListings
      .map((listing) => listing.location?.trim())
      .filter(Boolean)
  ),
].sort();

setLocations(uniqueLocations);

    } catch (error) {

      console.error(
        "Fetch properties error:",
        error
      );

    } finally {

      setLoading(false);

    }

  };

  // =========================================================
  // INITIAL LOAD
  // =========================================================

  useEffect(() => {

    fetchListings();

  }, []);

  // =========================================================
  // FILTER PROPERTIES
  // =========================================================

  const filteredListings = listings
    .filter((listing) => {

      // =====================================================
      // SEARCH
      // =====================================================

      const searchTerm =
        filters.search
          .toLowerCase()
          .trim();

      const matchesSearch =
  !searchTerm ||
  listing.title
    ?.toLowerCase()
    .includes(searchTerm) ||
  listing.location
    ?.toLowerCase()
    .includes(searchTerm);

    // ===============================================
    // LOCATION
    //============================================
    const matchesLocation =
  !filters.location ||
  listing.location
    ?.toLowerCase()
    .trim() ===
  filters.location
    .toLowerCase()
    .trim();

      // =====================================================
      // PROPERTY TYPE
      // =====================================================

      const matchesPropertyType =
        !filters.propertyType ||
        listing.property_type
          ?.toLowerCase()
          .trim()
          .replace(/s$/, "") ===
        filters.propertyType
          .toLowerCase()
          .trim()
          .replace(/s$/, "");

      // =====================================================
      // LISTING TYPE
      // =====================================================

     const matchesListingType =
  !filters.listingType ||
  listing.listing_type === filters.listingType ||
  (
    filters.listingType !== "both" &&
    listing.listing_type === "both"
  );

      // =====================================================
      // BEDROOMS
      // =====================================================

      const matchesBedrooms =
        !filters.bedrooms ||
        Number(listing.bedrooms || 0) >=
          Number(filters.bedrooms);

      // =====================================================
      // MINIMUM PRICE
      // =====================================================

      const matchesMinPrice =
        !filters.minPrice ||
        Number(listing.price || 0) >=
          Number(filters.minPrice);

      // =====================================================
      // MAXIMUM PRICE
      // =====================================================

      const matchesMaxPrice =
        !filters.maxPrice ||
        Number(listing.price || 0) <=
          Number(filters.maxPrice);

      return (
  matchesSearch &&
  matchesLocation &&
  matchesPropertyType &&
  matchesListingType &&
  matchesBedrooms &&
  matchesMinPrice &&
  matchesMaxPrice
);

    })
    .sort((a, b) => {

      // =====================================================
      // PRICE LOW → HIGH
      // =====================================================

      if (filters.sort === "price-low") {

        return (
          Number(a.price || 0) -
          Number(b.price || 0)
        );

      }

      // =====================================================
      // PRICE HIGH → LOW
      // =====================================================

      if (filters.sort === "price-high") {

        return (
          Number(b.price || 0) -
          Number(a.price || 0)
        );

      }

      // =====================================================
      // NEWEST
      // =====================================================

      return (
        new Date(b.created_at) -
        new Date(a.created_at)
      );

    });

  // =========================================================
  // GROUP FILTERED LISTINGS BY DEVELOPMENT
  // =========================================================

  // const groupedProperties = Object.values(

  //   filteredListings.reduce(
  //     (groups, listing) => {

  //       const developmentId =
  //         listing.developments?.id ||
  //         "other";

  //       const developmentName =
  //         listing.developments?.name ||
  //         "Other Properties";

  //       if (!groups[developmentId]) {

  //         groups[developmentId] = {

  //           id: developmentId,

  //           name: developmentName,

  //           listings: [],

  //         };

  //       }

  //       groups[developmentId].listings.push(
  //         listing
  //       );

  //       return groups;

  //     },
  //     {}
  //   )

  // );


  return (
    <>

    <Helmet>
  <title>
    Properties for Sale in Kenya | Dynasty Spaces
  </title>

  <meta
    name="description"
    content="Explore properties available through Dynasty Spaces, including quality homes and real estate investment opportunities in Kenya."
  />

  <link
    rel="canonical"
    href="https://dynastyspace.com/properties"
  />

  <meta
    property="og:title"
    content="Properties for Sale in Kenya | Dynasty Spaces"
  />

  <meta
    property="og:description"
    content="Explore properties available through Dynasty Spaces, including quality homes and real estate investment opportunities in Kenya."
  />

  <meta
    property="og:url"
    content="https://dynastyspace.com/properties"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:image"
    content="https://dynastyspace.com/dynasty-favicon.png"
  />
</Helmet>

    <main
      className="
        min-h-screen
        bg-[#050505]
        text-white
      "
    >
{/* ========================================================= */}
{/* PROPERTIES HERO */}
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
      src={propertyHero}
      alt="Properties"
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


  {/* Content */}

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
        Property Collection
      </span>


      <h1
        className="
          text-5xl
          md:text-6xl

          font-bold

          text-white
        "
      >
        Explore Properties
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
        Discover carefully selected homes,
        apartments, offices and investment
        opportunities available across our
        property collection.
      </p>


      {/* Search */}

      <div
        className="
          mt-12

          max-w-3xl
        "
      >

      </div>

    </div>

  </div>

</section>

{/* =========================================================
    PROPERTY FILTERS
========================================================= */}

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

<PropertyFilters
  filters={filters}
  onChange={setFilters}
  onClear={clearFilters}
  propertyTypes={propertyTypes}
  locations={locations}
/>

  </div>
</section>


      {/* ===================================================== */}
      {/* PROPERTY COLLECTIONS */}
      {/* ===================================================== */}

      <section
        className="
          py-20
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
          "
        >


          {/* LOADING */}

          {loading && (

  <div className="space-y-20">

    {[1, 2].map((section) => (

      <section key={section}>

        {/* DEVELOPMENT HEADER SKELETON */}

        <div className="mb-8">

          <div
            className="
              h-3
              w-28
              bg-white/10
              animate-pulse
              mb-3
            "
          />

          <div
            className="
              h-9
              w-56
              bg-white/10
              animate-pulse
            "
          />

        </div>


        {/* PROPERTY CARDS SKELETON */}

        <div
          className="
            grid
            grid-cols-1
            sm:grid-cols-2
            lg:grid-cols-3
            gap-6
          "
        >

          {[1, 2, 3].map((card) => (

            <div
              key={card}
              className="
                overflow-hidden
                bg-[#0A0A0A]
                border
                border-white/5
              "
            >

              {/* IMAGE */}

              <div
                className="
                  h-64
                  bg-white/10
                  animate-pulse
                "
              />


              {/* CONTENT */}

              <div className="p-6 space-y-4">

                {/* PROPERTY TYPE */}

                <div
                  className="
                    h-3
                    w-24
                    bg-white/10
                    animate-pulse
                  "
                />


                {/* TITLE */}

                <div
                  className="
                    h-6
                    w-3/4
                    bg-white/10
                    animate-pulse
                  "
                />


                {/* LOCATION */}

                <div
                  className="
                    h-4
                    w-1/2
                    bg-white/10
                    animate-pulse
                  "
                />


                {/* PRICE */}

                <div
                  className="
                    h-5
                    w-32
                    bg-[#C9A758]/20
                    animate-pulse
                  "
                />

              </div>

            </div>

          ))}

        </div>

      </section>

    ))}

  </div>

)}


          {/* EMPTY */}

          {!loading &&
            listings.length === 0 && (

              <div className="py-24 text-center">

  <h2 className="text-2xl font-semibold text-white">
  No Properties Available
</h2>

<p className="mt-3 text-gray-500">
  There are currently no published properties available.
  Please check back later.
</p>

</div>

            )}

          {/* NO MATCHING PROPERTIES */}

{!loading &&
  listings.length > 0 &&
  filteredListings.length === 0 && (

    <div
      className="
        py-24
        text-center
      "
    >

      <h2
        className="
          text-2xl
          md:text-3xl
          font-semibold
          text-white
        "
      >
        No Matching Properties
      </h2>

      <p
        className="
          mt-3
          max-w-md
          mx-auto
          text-gray-500
          leading-7
        "
      >
        We couldn't find any properties matching
        your current filters. Try adjusting your
        search criteria.
      </p>

      <button
        type="button"
        onClick={clearFilters}
        className="
          mt-7
          px-6
          py-3
          bg-[#C9A758]
          text-black
          font-medium
          hover:bg-[#E6C56A]
          transition
        "
      >
        Clear Filters
      </button>

    </div>

)}


          {/* GROUPS */}

        {!loading &&
  filteredListings.length > 0 && (

    <div
      className="
        grid
        grid-cols-1
        sm:grid-cols-2
        lg:grid-cols-3
        gap-6
      "
    >

      {filteredListings.map((listing) => (

        <ListingCard
          key={listing.id}
          listing={listing}
        />

      ))}

    </div>

  )}

        </div>

      </section>

    </main>
  </>
  );

}