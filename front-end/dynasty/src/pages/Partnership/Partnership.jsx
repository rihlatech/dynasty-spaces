import { ArrowRight, Building2, Handshake, TrendingUp, Users } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Helmet } from "react-helmet-async";

import partnershipImage from "../../assets/images/Partnership.jpg";

export default function Partnership() {
  const navigate = useNavigate();

  return (
    <>
    <Helmet>
  <title>
    Partnerships | Dynasty Spaces
  </title>

  <meta
    name="description"
    content="Partner with Dynasty Spaces to explore real estate opportunities, property developments, and strategic partnerships in Kenya."
  />

  <link
    rel="canonical"
    href="https://dynastyspace.com/partnership"
  />

  <meta
    property="og:title"
    content="Partnerships | Dynasty Spaces"
  />

  <meta
    property="og:description"
    content="Partner with Dynasty Spaces to explore real estate opportunities, property developments, and strategic partnerships in Kenya."
  />

  <meta
    property="og:url"
    content="https://dynastyspace.com/partnership"
  />

  <meta
    property="og:type"
    content="website"
  />

  <meta
    property="og:image"
    content="https://dynastyspace.com/dynasty_meta_logo.jpeg"
  />
 </Helmet>
    <main className="min-h-screen bg-[#050505] text-white">

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="px-6 pt-24 md:pt-28">

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            h-[340px]
            md:h-[390px]
            overflow-hidden
            rounded-3xl
          "
        >

          {/* Background Image */}

          <img
            src={partnershipImage}
            alt="Dynasty Spaces Partnership"
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
              bg-black/70
            "
          />

          {/* Navy + Gold Gradient */}

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-[#050505]/95
              via-[#101F34]/70
              to-[#C9A758]/20
            "
          />

          {/* Hero Content */}

          <div
            className="
              relative
              z-10
              h-full
              max-w-3xl
              flex
              flex-col
              justify-center
              px-8
              md:px-14
            "
          >

            <p
              className="
                text-sm
                uppercase
                tracking-[0.35em]
                text-[#C9A758]
              "
            >
              Partnership
            </p>

            <h1
              className="
                mt-4
                text-4xl
                md:text-5xl
                font-bold
                leading-tight
              "
            >
              Partner With
              <span className="text-[#C9A758]">
                {" "}Dynasty Spaces
              </span>
            </h1>

            <p
              className="
                mt-5
                max-w-2xl
                text-gray-300
                text-base
                md:text-lg
                leading-relaxed
              "
            >
              Building meaningful relationships and creating
              stronger opportunities through real estate.
            </p>

          </div>

        </div>

      </section>


      {/* =====================================================
          INTRODUCTION
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="max-w-3xl">

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C9A758]
            "
          >
            Work With Us
          </p>

          <h2
            className="
              mt-3
              text-3xl
              md:text-4xl
              font-bold
            "
          >
            Let's create opportunities together.
          </h2>

          <p
            className="
              mt-6
              text-gray-400
              leading-relaxed
              text-lg
            "
          >
            Dynasty Spaces works with individuals, businesses
            and professionals who share our vision for better
            real estate experiences. Whether you represent
            property, capital, expertise or new opportunities,
            we are open to building meaningful partnerships.
          </p>

        </div>

      </section>


      {/* =====================================================
          PARTNERSHIP OPPORTUNITIES
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 pb-20">

        <div className="mb-10">

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C9A758]
            "
          >
            Opportunities
          </p>

          <h2
            className="
              mt-3
              text-3xl
              md:text-4xl
              font-bold
            "
          >
            Who We Partner With
          </h2>

        </div>


        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">

          <PartnershipCard
            icon={<Building2 size={25} />}
            title="Property Developers"
            description="Collaborate with us to showcase and connect your developments with prospective buyers and tenants."
          />

          <PartnershipCard
            icon={<Users size={25} />}
            title="Property Owners"
            description="Work with us to professionally present your properties and connect them with the right audience."
          />

          <PartnershipCard
            icon={<TrendingUp size={25} />}
            title="Investors"
            description="Explore opportunities and strategic relationships within the real estate ecosystem."
          />

          <PartnershipCard
            icon={<Handshake size={25} />}
            title="Strategic Partners"
            description="Bring your expertise, services or ideas and explore opportunities for long-term collaboration."
          />

        </div>

      </section>


      {/* =====================================================
          WHY PARTNER
      ===================================================== */}

      <section
        className="
          border-y
          border-white/10
          bg-[#0A0A0A]
        "
      >

        <div
          className="
            max-w-7xl
            mx-auto
            px-6
            py-20
          "
        >

          <div className="grid lg:grid-cols-2 gap-14 items-center">

            <div>

              <p
                className="
                  text-sm
                  uppercase
                  tracking-[0.3em]
                  text-[#C9A758]
                "
              >
                Why Dynasty Spaces
              </p>

              <h2
                className="
                  mt-3
                  text-3xl
                  md:text-4xl
                  font-bold
                "
              >
                A partnership built around value.
              </h2>

              <p
                className="
                  mt-6
                  text-gray-400
                  leading-relaxed
                "
              >
                We believe strong partnerships are built on
                trust, professionalism and shared value. Our
                approach is focused on creating relationships
                that can grow beyond a single transaction.
              </p>

            </div>


            <div className="grid sm:grid-cols-2 gap-5">

              <Benefit
                title="Professional Presentation"
                text="Present your property or service through a polished digital experience."
              />

              <Benefit
                title="Greater Visibility"
                text="Reach people actively exploring real estate opportunities."
              />

              <Benefit
                title="Trusted Relationships"
                text="Build long-term relationships through professional collaboration."
              />

              <Benefit
                title="Shared Growth"
                text="Explore opportunities that create value for both sides."
              />

            </div>

          </div>

        </div>

      </section>


      {/* =====================================================
          HOW IT WORKS
      ===================================================== */}

      <section className="max-w-7xl mx-auto px-6 py-20">

        <div className="text-center max-w-2xl mx-auto">

          <p
            className="
              text-sm
              uppercase
              tracking-[0.3em]
              text-[#C9A758]
            "
          >
            Simple Process
          </p>

          <h2
            className="
              mt-3
              text-3xl
              md:text-4xl
              font-bold
            "
          >
            How Partnership Works
          </h2>

        </div>


        <div className="grid md:grid-cols-4 gap-6 mt-14">

          <Step
            number="01"
            title="Connect"
            text="Tell us about yourself, your business or your partnership idea."
          />

          <Step
            number="02"
            title="Discuss"
            text="We discuss your goals and explore how we can work together."
          />

          <Step
            number="03"
            title="Collaborate"
            text="We agree on a suitable partnership structure and begin working together."
          />

          <Step
            number="04"
            title="Grow"
            text="We build the relationship and explore opportunities for long-term value."
          />

        </div>

      </section>


      {/* =====================================================
          FINAL CTA
      ===================================================== */}

      <section className="px-6 pb-24">

        <div
          className="
            relative
            max-w-7xl
            mx-auto
            overflow-hidden
            rounded-3xl
            border
            border-[#C9A758]/30
            bg-[#101F34]
            px-8
            py-16
            md:px-14
          "
        >

          <div
            className="
              absolute
              -right-20
              -top-20
              w-72
              h-72
              rounded-full
              bg-[#C9A758]/10
              blur-3xl
            "
          />

          <div className="relative z-10 max-w-3xl">

            <p
              className="
                text-sm
                uppercase
                tracking-[0.3em]
                text-[#C9A758]
              "
            >
              Let's Talk
            </p>

            <h2
              className="
                mt-3
                text-3xl
                md:text-4xl
                font-bold
              "
            >
              Have a partnership idea?
            </h2>

            <p
              className="
                mt-5
                text-gray-300
                leading-relaxed
              "
            >
              We'd love to hear from you. Let's explore how
              Dynasty Spaces and your business can create
              something valuable together.
            </p>

            <button
              onClick={() => navigate("/contact")}
              className="
                mt-8
                inline-flex
                items-center
                gap-3
                rounded-xl
                bg-[#C9A758]
                px-6
                py-3
                font-semibold
                text-black
                transition
                hover:opacity-90
              "
            >
              Start a Conversation
              <ArrowRight size={18} />
            </button>

          </div>

        </div>

      </section>

    </main>
    </>
  );
 }


 /* =========================================================
   PARTNERSHIP CARD
 ========================================================= */

function PartnershipCard({
  icon,
  title,
  description,
}) {
  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-[#0F0F0F]
        p-7
        transition
        duration-300
        hover:border-[#C9A758]/40
        hover:-translate-y-1
      "
    >

      <div
        className="
          w-12
          h-12
          rounded-xl
          flex
          items-center
          justify-center
          bg-[#C9A758]/10
          text-[#C9A758]
          transition
          group-hover:bg-[#C9A758]
          group-hover:text-black
        "
      >
        {icon}
      </div>

      <h3 className="mt-6 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-gray-400 leading-relaxed text-sm">
        {description}
      </p>

    </div>
  );
}


/* =========================================================
   BENEFIT
========================================================= */

function Benefit({ title, text }) {
  return (
    <div
      className="
        rounded-2xl
        border
        border-white/10
        bg-[#111111]
        p-6
      "
    >

      <div className="w-2 h-2 rounded-full bg-[#C9A758]" />

      <h3 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h3>

      <p className="mt-2 text-sm text-gray-400 leading-relaxed">
        {text}
      </p>

    </div>
  );
}


/* =========================================================
   PROCESS STEP
========================================================= */

function Step({
  number,
  title,
  text,
}) {
  return (
    <div className="relative">

      <span
        className="
          text-5xl
          font-bold
          text-[#C9A758]/20
        "
      >
        {number}
      </span>

      <h3 className="mt-2 text-xl font-semibold text-white">
        {title}
      </h3>

      <p className="mt-3 text-sm text-gray-400 leading-relaxed">
        {text}
      </p>

    </div>
  );
}