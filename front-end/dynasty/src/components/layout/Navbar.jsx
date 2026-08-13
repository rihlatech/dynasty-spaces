import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { NavLink } from "react-router-dom";
import { useState } from "react";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  const navLinks = [
    {
      name: "Home",
      path: "/",
    },
    {
      name: "Properties",
      path: "/properties",
    },

    {
  name: "Partnership",
  path: "/partnership",
},

    {
      name: "About",
      path: "/about",
    },
    {
      name: "Contact",
      path: "/contact",
    },
  ];

  return (
    <motion.nav
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="
        fixed
        top-0
        left-0
        w-full
        z-50
        bg-black/40
        backdrop-blur-xl
        border-b
        border-white/10
      "
    >
      <div
        className="
          max-w-7xl
          mx-auto
          px-6
          py-4
          flex
          items-center
          justify-between
        "
      >
        {/* Logo */}

        <NavLink
          to="/"
          onClick={() => setOpen(false)}
        >
          <h1
            className="
              text-2xl
              font-semibold
              tracking-wide
              text-white
              select-none
            "
          >
            Dynasty
            <span className="text-[#C9A758]">
              Spaces
            </span>
          </h1>
        </NavLink>

        {/* Desktop Navigation */}

        <div
          className="
            hidden
            md:flex
            items-center
            gap-8
          "
        >
          {navLinks.map((link) => (
            <NavLink
              key={link.path}
              to={link.path}
              className={({ isActive }) =>
                isActive
                  ? "text-[#C9A758] font-medium"
                  : "text-white hover:text-[#C9A758] transition"
              }
            >
              {link.name}
            </NavLink>
          ))}

          {/* Login */}

          {/* <NavLink
            to="/login"
            className="
              ml-4
              bg-[#C9A758]
              text-black
              px-5
              py-2
              rounded-xl
              font-medium
              hover:scale-105
              transition-all
              duration-300
            "
          >
            Login
          </NavLink> */}
        </div>

        {/* Mobile Menu Button */}

        <button
          onClick={() => setOpen(!open)}
          className="
            md:hidden
            text-white
            transition
            hover:text-[#C9A758]
          "
          aria-label={
            open
              ? "Close navigation menu"
              : "Open navigation menu"
          }
        >
          {open ? (
            <X size={28} />
          ) : (
            <Menu size={28} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}

      {open && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          transition={{ duration: 0.25 }}
          className="
            md:hidden
            bg-[#0A0A0A]
            border-t
            border-white/10
            px-6
            py-6
          "
        >
          <div className="flex flex-col gap-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={() => setOpen(false)}
                className={({ isActive }) =>
                  isActive
                    ? "text-[#C9A758] font-medium"
                    : "text-white hover:text-[#C9A758] transition"
                }
              >
                {link.name}
              </NavLink>
            ))}

            {/* Mobile Login */}

            {/* <NavLink
              to="/login"
              onClick={() => setOpen(false)}
              className="
                mt-2
                bg-[#C9A758]
                text-black
                text-center
                py-3
                rounded-xl
                font-semibold
                hover:bg-[#D8B968]
                transition
              "
            >
              Login
            </NavLink> */}
          </div>
        </motion.div>
      )}
    </motion.nav>
  );
}