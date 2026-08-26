import { useEffect, useState , useRef} from "react";
import { useNavigate } from "react-router-dom";
import { Link } from "react-router-dom";
import { ArrowLeft , ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet-async";

import { supabase } from "../../config/SupabaseClient";

import Hero from "./Hero";
import ListingCard from "../../components/website/ListingCard";


export default function Home() {
  const navigate = useNavigate();

  // const [developments, setDevelopments] = useState([]);
  const [listings, setListings] = useState([]);
const [homepageListings, setHomepageListings] = useState([]);

const [loading, setLoading] = useState(true);
const featuredScrollRef = useRef(null);

///----------------------

const scrollFeatured = (direction) => {
  if (!featuredScrollRef.current) return;

  featuredScrollRef.current.scrollBy({
    left: direction === "left" ? -400 : 400,
    behavior: "smooth",
  });
};

  // -------------------FETCH LISTINGS---------------

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

const dataListings = data || [];

setListings(dataListings);

// =====================================================
// PRIORITIZE FEATURED LISTINGS FOR HOMEPAGE
// =====================================================

const featuredListings = dataListings.filter(
  (listing) => listing.featured === true
);

const nonFeaturedListings = dataListings.filter(
  (listing) => listing.featured !== true
);

// Featured listings appear first.
// Non-featured listings fill the remaining spaces.
// Maximum of 10 listings on homepage.

const prioritizedListings = [
  ...featuredListings,
  ...nonFeaturedListings,
].slice(0, 10);

setHomepageListings(prioritizedListings);

} catch (error) {

    console.error(
      "Fetch listings error:",
      error
    );

  } finally {

    setLoading(false);

  }

};


// ========================================================useEffect=========================
useEffect(() => {

  fetchListings();

}, []);
  

  



  return (

    <>
    <Helmet>
  <title>
    Dynasty Spaces | Real Estate & Property Developments in Kenya
  </title>

  <meta
    name="description"
    content="Discover quality property developments, homes, and real estate investment opportunities in Kenya with Dynasty Spaces."
  />

  <link
    rel="canonical"
    href="https://dynastyspace.com/"
  />

  <meta
    property="og:title"
    content="Dynasty Spaces | Real Estate & Property Developments in Kenya"
  />

  <meta
    property="og:description"
    content="Discover quality property developments, homes, and real estate investment opportunities in Kenya with Dynasty Spaces."
  />

  <meta
    property="og:url"
    content="https://dynastyspace.com/"
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

      <Hero />


{/* ========================================================= */}
{/* FEATURED PROPERTIES */}
{/* ========================================================= */}

<section
  className="
    py-24
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

    {/* Section Header */}

    <div
      className="
        flex
        flex-col
        lg:flex-row
        lg:items-end
        lg:justify-between
        gap-6
        mb-16
      "
    >

      <div>

        <span
          className="
            inline-block
            mb-4
            text-sm
            tracking-[0.25em]
            uppercase
            text-[#C9A758]
          "
        >
          Find Your Next Property
        </span>

        <h2
          className="
            text-4xl
            md:text-5xl
            font-bold
            text-white
          "
        >
          Featured Listings
        </h2>

        <p
          className="
            mt-5
            max-w-2xl
            text-gray-400
            leading-8
          "
        >
          Explore a curated selection of premium properties
          available across our featured developments.
        </p>

      </div>


      {/* View All */}

      <button
        onClick={() => navigate("/properties")}
        className="
          w-fit

          px-7
          py-4

          rounded-xl

          border
          border-[#C9A758]

          text-[#C9A758]

          hover:bg-[#C9A758]
          hover:text-black

          transition-all
          duration-300
        "
      >
        View All Properties →
      </button>

    </div>


    {/* ===================================================== */}
    {/* CONTENT */}
    {/* ===================================================== */}

    {loading ? (

  <div
    className="
      flex
      gap-3
      sm:gap-5
      lg:gap-6

      overflow-hidden

      pb-4
    "
  >

    {[1, 2, 3].map((card) => (

      <div
        key={card}
        className="
          shrink-0

          w-[280px]
          sm:w-[320px]
          lg:w-[calc((100%-48px)/3)]

          overflow-hidden

          rounded-2xl

          border
          border-white/10

          bg-[#0F0F0F]
        "
      >

        {/* IMAGE SKELETON */}

        <div
          className="
            h-36
            sm:h-56
            lg:h-72

            bg-white/10

            animate-pulse
          "
        />


        {/* CONTENT SKELETON */}

        <div
          className="
            p-3
            sm:p-5
            lg:p-8
          "
        >

          {/* PROPERTY TYPE */}

          <div
            className="
              h-2
              sm:h-3

              w-16
              sm:w-24

              bg-white/10

              animate-pulse
            "
          />


          {/* TITLE */}

          <div
            className="
              mt-3

              h-4
              sm:h-6

              w-3/4

              bg-white/10

              animate-pulse
            "
          />


          {/* LOCATION */}

          <div
            className="
              mt-4

              h-3

              w-1/2

              bg-white/10

              animate-pulse
            "
          />


          {/* DETAILS */}

          <div
            className="
              mt-6

              flex
              gap-8
            "
          >

            <div
              className="
                h-3
                w-16

                bg-white/10

                animate-pulse
              "
            />

            <div
              className="
                h-3
                w-20

                bg-white/10

                animate-pulse
              "
            />

          </div>


          {/* PRICE */}

          <div
            className="
              mt-7

              h-5
              sm:h-7

              w-28
              sm:w-36

              bg-white/10

              animate-pulse
            "
          />

        </div>

      </div>

    ))}

  </div>

) : listings.length === 0 ? (


      <div
        className="
          py-20
          text-center
          text-gray-400
        "
      >
        No properties are currently available.
      </div>

    ) : (

      <div className="space-y-16">

        {!loading && listings.length > 0 && (
  <div className="relative">

    {/* LEFT ARROW */}

    <button
      type="button"
      onClick={() => scrollFeatured("left")}
      aria-label="Previous properties"
      className="
        hidden
        lg:flex

        absolute
        left-3
        top-1/2
        -translate-y-1/2

        z-30

        w-11
        h-11

        items-center
        justify-center

        rounded-full

        bg-black/80
        backdrop-blur-md

        border
        border-[#C9A758]/60

        text-[#C9A758]

        shadow-lg

        hover:bg-[#C9A758]
        hover:text-black

        transition-all
        duration-300
      "
    >
      <ArrowLeft size={20} />
    </button>


    {/* RIGHT ARROW */}

    <button
      type="button"
      onClick={() => scrollFeatured("right")}
      aria-label="Next properties"
      className="
        hidden
        lg:flex

        absolute
        right-3
        top-1/2
        -translate-y-1/2

        z-30

        w-11
        h-11

        items-center
        justify-center

        rounded-full

        bg-black/80
        backdrop-blur-md

        border
        border-[#C9A758]/60

        text-[#C9A758]

        shadow-lg

        hover:bg-[#C9A758]
        hover:text-black

        transition-all
        duration-300
      "
    >
      <ArrowRight size={20} />
    </button>


    {/* SCROLLING CARDS */}

    <div
      ref={featuredScrollRef}
      className="
        flex
        gap-3
        sm:gap-5
        lg:gap-6

        overflow-x-auto
        overflow-y-hidden

        pb-4

        snap-x
        snap-mandatory

        scrollbar-thin
        scrollbar-thumb-[#C9A758]/40
        scrollbar-track-transparent
      "
    >

      {homepageListings.map((listing) => (

        <div
          key={listing.id}
          className="
            shrink-0
            w-[280px]
            sm:w-[320px]
            lg:w-[calc((100%-48px)/3)]
            snap-start
          "
        >

          <ListingCard
            listing={listing}
          />

        </div>

      ))}

    </div>

  </div>
)}

         

{/* ================================================= */}
{/* VIEW ALL PROPERTIES */}
{/* ================================================= */}

<div
  className="
    pt-8
    flex
    justify-center
  "
>
  <button
    onClick={() => navigate("/properties")}
    className="
      px-8
      py-4

      border
      border-[#C9A758]

      text-[#C9A758]

      font-semibold

      hover:bg-[#C9A758]
      hover:text-black

      transition-all
      duration-300
    "
  >
    View All Properties →
  </button>
</div>



        

      </div>

    )}

  </div>
  

</section>

{/* =========================================================
    WHY DYNASTY SPACES
========================================================= */}

<section
  className="
    py-24
    bg-[#080808]
    border-t
    border-white/5
  "
>
  <div
    className="
      max-w-7xl
      mx-auto
      px-6
    "
  >

    {/* Header */}

    <div className="max-w-2xl">

      <span
        className="
          text-sm
          uppercase
          tracking-[0.3em]
          text-[#C9A758]
        "
      >
        Why Dynasty Spaces
      </span>

      <h2
        className="
          mt-4
          text-3xl
          md:text-4xl
          font-bold
          text-white
        "
      >
        A Better Way to Discover Property.
      </h2>

      <p
        className="
          mt-5
          text-gray-400
          leading-relaxed
        "
      >
        We combine quality properties, trusted developments
        and meaningful opportunities into one refined
        property experience.
      </p>

    </div>


    {/* Features */}

    <div
      className="
        mt-12
        grid
        grid-cols-1
        md:grid-cols-3
        gap-6
      "
    >

      {/* CARD 1 */}

      <div
        className="
          group
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-7
          hover:border-[#C9A758]/40
          hover:bg-[#C9A758]/5
          transition-all
          duration-300
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-[#C9A758]/10
            border
            border-[#C9A758]/20
            flex
            items-center
            justify-center
            text-[#C9A758]
            text-xl
            font-bold
          "
        >
          01
        </div>

        <h3
          className="
            mt-6
            text-xl
            font-semibold
            text-white
          "
        >
          Curated Properties
        </h3>

        <p
          className="
            mt-4
            text-gray-400
            leading-relaxed
          "
        >
          Discover carefully presented properties with
          the essential details you need to make confident
          decisions.
        </p>

      </div>


      {/* CARD 2 */}

      <div
        className="
          group
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-7
          hover:border-[#C9A758]/40
          hover:bg-[#C9A758]/5
          transition-all
          duration-300
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-[#C9A758]/10
            border
            border-[#C9A758]/20
            flex
            items-center
            justify-center
            text-[#C9A758]
            text-xl
            font-bold
          "
        >
          02
        </div>

        <h3
          className="
            mt-6
            text-xl
            font-semibold
            text-white
          "
        >
          Trusted Developments
        </h3>

        <p
          className="
            mt-4
            text-gray-400
            leading-relaxed
          "
        >
          Explore properties within developments and
          discover opportunities beyond individual listings.
        </p>

      </div>


      {/* CARD 3 */}

      <div
        className="
          group
          rounded-2xl
          border
          border-white/10
          bg-white/[0.03]
          p-7
          hover:border-[#C9A758]/40
          hover:bg-[#C9A758]/5
          transition-all
          duration-300
        "
      >

        <div
          className="
            w-12
            h-12
            rounded-xl
            bg-[#C9A758]/10
            border
            border-[#C9A758]/20
            flex
            items-center
            justify-center
            text-[#C9A758]
            text-xl
            font-bold
          "
        >
          03
        </div>

        <h3
          className="
            mt-6
            text-xl
            font-semibold
            text-white
          "
        >
          Meaningful Opportunities
        </h3>

        <p
          className="
            mt-4
            text-gray-400
            leading-relaxed
          "
        >
          From finding a home to exploring investment and
          partnership opportunities, we connect people with
          possibilities.
        </p>

      </div>

    </div>

  </div>
</section>

{/* =========================================================
    PARTNERSHIP CTA
========================================================= */}

<section
  className="
    relative
    py-24
    overflow-hidden
    bg-[#050505]
  "
>
  {/* Gold Glow */}

  <div
    className="
      absolute
      -right-40
      top-1/2
      -translate-y-1/2
      w-[500px]
      h-[500px]
      rounded-full
      bg-[#C9A758]/10
      blur-[120px]
      pointer-events-none
    "
  />

  <div
    className="
      relative
      max-w-7xl
      mx-auto
      px-6
    "
  >

    <div
      className="
        rounded-3xl
        border
        border-[#C9A758]/30
        bg-gradient-to-br
        from-[#101010]
        via-[#0C0C0C]
        to-[#17130A]
        overflow-hidden
      "
    >

      <div
        className="
          grid
          lg:grid-cols-[1.2fr_0.8fr]
          items-center
        "
      >

        {/* Content */}

        <div className="p-8 md:p-12 lg:p-16">

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C9A758]
              font-medium
            "
          >
            Partnership
          </p>

          <h2
            className="
              mt-4
              text-3xl
              md:text-4xl
              lg:text-5xl
              font-bold
              text-white
              leading-tight
            "
          >
            Let's Build
            <span className="text-[#C9A758]">
              {" "}Something Great.
            </span>
          </h2>

          <p
            className="
              mt-5
              max-w-xl
              text-gray-400
              text-base
              md:text-lg
              leading-relaxed
            "
          >
            Whether you're a property owner , property developer, investor,
            agent or business looking to create new
            opportunities, Dynasty Spaces is open to
            meaningful partnerships.
          </p>

          <Link
            to="/partnership"
            className="
              mt-8
              inline-flex
              items-center
              gap-2
              px-6
              py-3.5
              rounded-xl
              bg-[#C9A758]
              text-black
              font-semibold
              hover:opacity-90
              transition
            "
          >
            Partner With Us
            <ArrowRight size={18} />
          </Link>

        </div>


        {/* Right Visual */}

        <div
          className="
            hidden
            lg:flex
            min-h-[320px]
            items-center
            justify-center
            border-l
            border-white/10
            relative
          "
        >

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-br
              from-[#C9A758]/10
              via-transparent
              to-transparent
            "
          />

          <div
            className="
              relative
              z-10
              text-center
              px-10
            "
          >

            <p
              className="
                text-6xl
                font-bold
                text-[#C9A758]
              "
            >
              ∞
            </p>

            <p
              className="
                mt-4
                text-xl
                font-semibold
                text-white
              "
            >
              Possibilities
            </p>

            <p
              className="
                mt-2
                text-sm
                text-gray-500
              "
            >
              Built through collaboration.
            </p>

          </div>

        </div>

      </div>

    </div>

  </div>

</section>

{/* =========================================================
    FINAL CTA
========================================================= */}

<section
  className="
    py-24
    bg-[#050505]
  "
>
  <div
    className="
      max-w-5xl
      mx-auto
      px-6
      text-center
    "
  >

    <p
      className="
        text-sm
        uppercase
        tracking-[0.3em]
        text-[#C9A758]
        font-medium
      "
    >
      Your Next Move
    </p>

    <h2
      className="
        mt-4
        text-3xl
        md:text-4xl
        lg:text-5xl
        font-bold
        text-white
        leading-tight
      "
    >
      Find a Space That
      <span className="text-[#C9A758]">
        {" "}Fits Your Vision.
      </span>
    </h2>

    <p
      className="
        mt-5
        max-w-2xl
        mx-auto
        text-gray-400
        text-base
        md:text-lg
        leading-relaxed
      "
    >
      Explore our available properties or get in touch with
      Dynasty Spaces and let us help you discover the right
      opportunity.
    </p>

    <div
      className="
        mt-8
        flex
        flex-wrap
        justify-center
        gap-4
      "
    >

      {/* Explore Properties */}

      <Link
        to="/properties"
        className="
          inline-flex
          items-center
          gap-2
          px-7
          py-3.5
          rounded-xl
          bg-[#C9A758]
          text-black
          font-semibold
          hover:opacity-90
          transition
        "
      >
        Explore Properties
        <ArrowRight size={18} />
      </Link>


      {/* Contact */}

      <Link
        to="/contact"
        className="
          inline-flex
          items-center
          gap-2
          px-7
          py-3.5
          rounded-xl
          border
          border-[#C9A758]
          text-[#C9A758]
          font-semibold
          hover:bg-[#C9A758]
          hover:text-black
          transition
        "
      >
        Contact Us
      </Link>

    </div>

  </div>
</section>














    </>

  );
}