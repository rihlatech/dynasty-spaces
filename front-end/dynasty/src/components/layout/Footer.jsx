import { Link } from "react-router-dom";

export default function Footer() {

  const socialLinks = {
    instagram: "#",
    tiktok: "#",
    facebook: "#",
    linkedin: "#",
  };

  return (
  <footer
    className="
      bg-[#050505]
      border-t
      border-white/10
      text-white
    "
  >

    {/* =========================================================
        MAIN FOOTER
    ========================================================= */}

    <div
      className="
        max-w-7xl
        mx-auto
        px-6
        py-16
      "
    >

      <div
        className="
          grid
          grid-cols-1
          md:grid-cols-3
          gap-12
        "
      >

        {/* =====================================================
            COLUMN 1 — BRAND
        ===================================================== */}

        <div>

          <Link
            to="/"
            className="
              inline-block
              text-2xl
              font-semibold
              tracking-wide
            "
          >
            Dynasty
            <span className="text-[#C9A758]">
              Spaces
            </span>
          </Link>

          <p
            className="
              mt-5
              max-w-sm
              text-gray-400
              leading-relaxed
            "
          >
            Discover exceptional properties and meaningful
            opportunities with Dynasty Spaces.
          </p>

          <div
            className="
              mt-6
              h-px
              w-16
              bg-[#C9A758]
            "
          />

        </div>


        {/* =====================================================
            COLUMN 2 — QUICK LINKS
        ===================================================== */}

        <div>

          <h3
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-[#C9A758]
              font-medium
            "
          >
            Quick Links
          </h3>

          <nav
            className="
              mt-6
              flex
              flex-col
              gap-4
            "
          >

            <Link
              to="/"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Home
            </Link>

            <Link
              to="/properties"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Properties
            </Link>

            <Link
              to="/about"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              About
            </Link>

            <Link
              to="/partnership"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Partnership
            </Link>

            <Link
              to="/contact"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Contact
            </Link>

          </nav>

        </div>


        {/* =====================================================
            COLUMN 3 — SOCIAL MEDIA
        ===================================================== */}

        <div>

          <h3
            className="
              text-sm
              uppercase
              tracking-[0.25em]
              text-[#C9A758]
              font-medium
            "
          >
            Connect With Us
          </h3>

          <p
            className="
              mt-6
              text-gray-400
              leading-relaxed
              max-w-sm
            "
          >
            Follow Dynasty Spaces and stay connected with
            our latest properties, developments and updates.
          </p>

          <div
            className="
              mt-6
              flex
              flex-col
              gap-4
            "
          >

            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Instagram
            </a>

            <a
              href={socialLinks.tiktok}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              TikTok
            </a>

            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              Facebook
            </a>

            <a
              href={socialLinks.linkedin}
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              LinkedIn
            </a>

            <a
              href="https://wa.me/254797983216"
              target="_blank"
              rel="noopener noreferrer"
              className="
                w-fit
                text-gray-400
                hover:text-[#C9A758]
                transition
              "
            >
              WhatsApp
            </a>

          </div>

        </div>

      </div>

    </div>


    {/* =========================================================
        FOOTER BOTTOM
    ========================================================= */}

    <div
      className="
        border-t
        border-white/10
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-6
          flex
          flex-col
          md:flex-row
          items-center
          justify-between
          gap-5
          text-sm
        "
      >

        {/* Copyright + Disclaimer */}

        <div className="text-center md:text-left">

          <p className="text-gray-500">
            © {new Date().getFullYear()} Dynasty Spaces.
            All rights reserved.
          </p>

          <p
            className="
              mt-2
              text-xs
              text-gray-600
              max-w-xl
            "
          >
            Prices, layouts, images and availability are
            subject to change without notice.
          </p>

        </div>


        {/* RihlaTech Watermark */}

        <a
          href="https://rihlatechdigitalagency.vercel.ap"
          target="_blank"
          rel="noopener noreferrer"
          className="
            text-gray-600
            hover:text-[#C9A758]
            transition
          "
        >
          Designed and developed by
          <span className="ml-1 text-[#C9A758]">
            RihlaTech Company
          </span>
        </a>

      </div>

    </div>

  </footer>
);
}