import { motion } from "framer-motion";
import { ArrowRight, Building2, Handshake, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";
import AboutImage from "../../assets/images/About.png";
import { Helmet } from "react-helmet-async";

export default function About() {

  return (
    <>
    <Helmet>
  <title>
    About Dynasty Spaces | Real Estate in Kenya
  </title>

  <meta
    name="description"
    content="Learn about Dynasty Spaces, a real estate company focused on quality property developments and real estate opportunities in Kenya."
  />

  <link
    rel="canonical"
    href="https://dynastyspace.com/about"
  />

  <meta
    property="og:title"
    content="About Dynasty Spaces | Real Estate in Kenya"
  />

  <meta
    property="og:description"
    content="Learn about Dynasty Spaces, a real estate company focused on quality property developments and real estate opportunities in Kenya."
  />

  <meta
    property="og:url"
    content="https://dynastyspace.com/about"
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
        pt-28
        pb-20
      "
    >

      {/* =========================================================
    ABOUT HERO
========================================================= */}

<section
  className="
    relative
    w-full
    h-[42vh]
    min-h-[320px]
    max-h-[460px]
    overflow-hidden
  "
>
  {/* Background Image */}

  <img
    src={AboutImage}
    alt="About Dynasty Spaces"
    className="
      absolute
      inset-0
      w-full
      h-full
      object-cover
    "
  />

  {/* Dark Overlay */}

  <div
    className="
      absolute
      inset-0
      bg-black/75
    "
  />

  {/* Gold Gradient Overlay */}

  <div
    className="
      absolute
      inset-0
      bg-gradient-to-r
      from-black
      via-black/65
      to-[#C9A758]/20
    "
  />

  {/* Hero Content */}

  <div
    className="
      relative
      z-10
      h-full
      max-w-7xl
      mx-auto
      px-6
      flex
      items-center
    "
  >

    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.7 }}
      className="max-w-2xl"
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
        About Dynasty Spaces
      </p>

      <h1
        className="
          mt-3
          text-3xl
          md:text-4xl
          lg:text-5xl
          font-bold
          text-white
          leading-tight
        "
      >
        More Than Property.
        <span className="text-[#C9A758]">
          {" "}We Build Possibilities.
        </span>
      </h1>

      <p
        className="
          mt-4
          text-sm
          md:text-base
          text-gray-300
          leading-relaxed
          max-w-xl
        "
      >
        Discover who we are, what we believe in, and how
        Dynasty Spaces is creating a better way to discover
        property and opportunities.
      </p>

    </motion.div>

  </div>

  {/* Bottom Gold Accent */}

  <div
    className="
      absolute
      bottom-0
      left-0
      w-full
      h-px
      bg-gradient-to-r
      from-transparent
      via-[#C9A758]
      to-transparent
    "
  />

</section>

      {/* =========================================================
          WHO WE ARE
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-6 mt-24">

        <div
          className="
            grid
            lg:grid-cols-2
            gap-12
            items-start
          "
        >

          <div>

            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#C9A758]
              "
            >
              Who We Are
            </p>

            <h2
              className="
                mt-4
                text-3xl
                md:text-4xl
                font-bold
              "
            >
              A modern approach to real estate.
            </h2>

          </div>


          <div
            className="
              text-gray-400
              leading-relaxed
              space-y-5
            "
          >

            <p>
              Dynasty Spaces is a property and real estate
              platform focused on making it easier to discover
              quality properties and developments.
            </p>

            <p>
              We bring together carefully presented properties,
              developments and opportunities so that buyers,
              investors and partners can make informed decisions
              with confidence.
            </p>

            <p>
              Our goal is simple: create a trusted space where
              property meets opportunity.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================================
          OUR APPROACH
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-6 mt-24">

        <div className="max-w-2xl">

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C9A758]
            "
          >
            Our Approach
          </p>

          <h2
            className="
              mt-4
              text-3xl
              md:text-4xl
              font-bold
            "
          >
            Built around people, property and opportunity.
          </h2>

        </div>


        <div
          className="
            mt-10
            grid
            grid-cols-1
            md:grid-cols-3
            gap-6
          "
        >

          {/* CARD 1 */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-7
            "
          >

            <Building2
              size={28}
              className="text-[#C9A758]"
            />

            <h3 className="mt-6 text-xl font-semibold">
              Exceptional Properties
            </h3>

            <p className="mt-4 text-gray-400 leading-relaxed">
              We present properties with the information and
              details needed to make discovery simple and clear.
            </p>

          </div>


          {/* CARD 2 */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-7
            "
          >

            <Handshake
              size={28}
              className="text-[#C9A758]"
            />

            <h3 className="mt-6 text-xl font-semibold">
              Meaningful Partnerships
            </h3>

            <p className="mt-4 text-gray-400 leading-relaxed">
              We believe strong partnerships create better
              opportunities and lasting value.
            </p>

          </div>


          {/* CARD 3 */}

          <div
            className="
              rounded-2xl
              border
              border-white/10
              bg-white/[0.03]
              p-7
            "
          >

            <Sparkles
              size={28}
              className="text-[#C9A758]"
            />

            <h3 className="mt-6 text-xl font-semibold">
              A Premium Experience
            </h3>

            <p className="mt-4 text-gray-400 leading-relaxed">
              From discovery to communication, we aim to make
              every interaction simple, professional and refined.
            </p>

          </div>

        </div>

      </section>


      {/* =========================================================
          CTA
      ========================================================= */}

      <section className="max-w-7xl mx-auto px-6 mt-24">

        <div
          className="
            rounded-3xl
            border
            border-[#C9A758]/30
            bg-gradient-to-r
            from-[#0D0D0D]
            to-[#17130A]
            p-8
            md:p-12
            flex
            flex-col
            md:flex-row
            items-start
            md:items-center
            justify-between
            gap-8
          "
        >

          <div>

            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#C9A758]
              "
            >
              Let's Connect
            </p>

            <h2
              className="
                mt-3
                text-3xl
                md:text-4xl
                font-bold
              "
            >
              Looking for your next opportunity?
            </h2>

            <p className="mt-4 text-gray-400 max-w-xl">
              Explore our properties or get in touch with
              Dynasty Spaces to discuss how we can work together.
            </p>

          </div>


          <div className="flex flex-wrap gap-4">

            <Link
              to="/properties"
              className="
                inline-flex
                items-center
                gap-2
                px-6
                py-3
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

            <Link
              to="/partnership"
              className="
                inline-flex
                items-center
                gap-2
                px-6
                py-3
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
              Partner With Us
            </Link>

          </div>

        </div>

      </section>

    </main>
    </>
  );
}
