import { motion } from "framer-motion";
import { Search } from "lucide-react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

import logo from "../../assets/logo/dynasty-logo.png";
import heroVideo from "../../assets/videos/hero-video.mp4";

export default function Hero() {
  const navigate = useNavigate();

  const [search, setSearch] = useState("");

  const handleSearch = (e) => {
    e.preventDefault();

    const query = search.trim();

    if (!query) {
      navigate("/properties");
      return;
    }

    navigate(
      `/properties?search=${encodeURIComponent(query)}`
    );
  };

  return (
    <section className="relative h-screen overflow-hidden">

      {/* Background Video */}
      <video
        autoPlay
        loop
        muted
        playsInline
        className="
          absolute
          inset-0
          w-full
          h-full
          object-cover
        "
      >
        <source src={heroVideo} type="video/mp4" />
      </video>

      {/* Overlay */}
      <div
        className="
          absolute
          inset-0
          bg-black/40
          dark:bg-black/60
        "
      />

      {/* Content */}
      <div
        className="
          relative
          z-10
          h-full
          flex
          flex-col
          items-center
          justify-center
          text-center
          px-6
        "
      >

        <motion.img
          src={logo}
          alt="Dynasty Spaces"
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="
            w-48
            md:w-80
            lg:w-[420px]
            drop-shadow-[0_15px_25px_rgba(16,31,52,0.8)]
          "
        />

        {/* SEARCH */}
        <motion.form
          onSubmit={handleSearch}
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="
            mt-4
            w-full
            max-w-4xl
          "
        >

          <div
            className="
              flex
              items-center
              bg-white/10
              backdrop-blur-md
              border
              border-white/40
              rounded-2xl
              px-3
              py-3
            "
          >

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search your next home..."
              className="
                flex-1
                min-w-0
                bg-transparent
                outline-none
                px-5
                text-white
                placeholder:text-white/70
              "
            />

            <button
              type="submit"
              aria-label="Search properties"
              className="
                w-12
                h-12
                shrink-0
                flex
                items-center
                justify-center
                rounded-xl
                bg-white
                text-black
                hover:scale-105
                transition
              "
            >
              <Search size={20} />
            </button>

          </div>

        </motion.form>

      </div>

    </section>
  );
}