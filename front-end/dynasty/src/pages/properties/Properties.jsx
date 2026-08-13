import { useEffect, useState } from "react";

import { supabase } from "../../config/SupabaseClient";

import ListingsCarousel from "../../components/website/ListingsCarousel";
import PropertyFilters from "../../components/website/PropertyFilters";

import propertyHero from "../../assets/images/PublicDevelopment.avif";

export default function Properties() {

  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);

  // Property types fetched from the database
  const [propertyTypes, setPropertyTypes] = useState([]);

  // =========================================================
  // FILTER STATE
  // =========================================================

  const [filters, setFilters] = useState({
    search: "",
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
          developments (
            id,
            name
          ),
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
          .includes(searchTerm) ||
        listing.developments?.name
          ?.toLowerCase()
          .includes(searchTerm);

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

  const groupedProperties = Object.values(

    filteredListings.reduce(
      (groups, listing) => {

        const developmentId =
          listing.developments?.id ||
          "other";

        const developmentName =
          listing.developments?.name ||
          "Other Properties";

        if (!groups[developmentId]) {

          groups[developmentId] = {

            id: developmentId,

            name: developmentName,

            listings: [],

          };

        }

        groups[developmentId].listings.push(
          listing
        );

        return groups;

      },
      {}
    )

  );


  return (

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

            <div
              className="
                py-24
                text-center
                text-gray-400
              "
            >
              Loading properties...
            </div>

          )}


          {/* EMPTY */}

          {!loading &&
            listings.length === 0 && (

              <div className="py-24 text-center">

  <h2 className="text-2xl font-semibold text-white">
    No properties found
  </h2>

  <p className="mt-3 text-gray-500">
    Try adjusting your filters or clearing your search.
  </p>

</div>

            )}


          {/* GROUPS */}

          {!loading &&
            groupedProperties.length > 0 && (

              <div
                className="
                  space-y-20
                "
              >

                {groupedProperties.map(
                  (group) => (

                    <section
                      key={group.id}
                    >

                      {/* DEVELOPMENT HEADER */}

                      <div
                        className="
                          flex
                          items-end
                          justify-between
                          gap-6
                          mb-8
                        "
                      >

                        <div>

                          <p
                            className="
                              text-xs
                              uppercase
                              tracking-[0.25em]
                              text-[#C9A758]
                              mb-2
                            "
                          >
                            Properties at
                          </p>


                          <h2
                            className="
                              text-3xl
                              md:text-4xl
                              font-bold
                              text-white
                            "
                          >
                            {group.name}
                          </h2>

                        </div>


                        {/* PROPERTY COUNT */}

                        <span
                          className="
                            hidden
                            md:block
                            text-sm
                            text-gray-500
                          "
                        >
                          {group.listings.length}{" "}
                          {group.listings.length === 1
                            ? "property"
                            : "properties"}
                        </span>

                      </div>


                      {/* CAROUSEL */}

                      <ListingsCarousel
                        listings={group.listings}
                      />

                    </section>

                  )
                )}

              </div>

            )}

        </div>

      </section>

    </main>

  );

}