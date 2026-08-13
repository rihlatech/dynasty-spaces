import { useState } from "react";
import { Menu, X, Bell, User } from "lucide-react";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

import ThemeToggle from "../ui/ThemeToggle";
import AdminProfileModal from "../modals/AdminProfileModal";

export default function DashboardLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);

  return (
    <div className="flex h-screen bg-gray-100 dark:bg-[#0B1120] overflow-hidden">

      {/* =====================================================
          DESKTOP SIDEBAR
      ===================================================== */}

      <div className="hidden lg:block w-72 shrink-0 h-screen">
        <Sidebar />
      </div>


      {/* =====================================================
          MOBILE SIDEBAR BACKDROP
      ===================================================== */}

      {sidebarOpen && (
        <div
          className="
            fixed
            inset-0
            z-[90]

            bg-black/50
            backdrop-blur-sm

            lg:hidden
          "
          onClick={() => setSidebarOpen(false)}
        />
      )}


      {/* =====================================================
          MOBILE SIDEBAR DRAWER
      ===================================================== */}

      <div
        className={`
          fixed
          top-0
          left-0
          z-[100]

          h-screen
          w-72

          transform
          transition-transform
          duration-300
          ease-in-out

          lg:hidden

          ${
            sidebarOpen
              ? "translate-x-0"
              : "-translate-x-full"
          }
        `}
      >

        <div className="relative h-full">

          <Sidebar />

          {/* CLOSE BUTTON */}

          <button
            type="button"
            onClick={() => setSidebarOpen(false)}
            className="
              absolute
              top-4
              right-4

              w-9
              h-9

              rounded-lg

              flex
              items-center
              justify-center

              bg-white/10
              text-white

              hover:bg-white/20

              transition
            "
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>

        </div>

      </div>


      {/* =====================================================
          MAIN AREA
      ===================================================== */}

      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">


        {/* ===================================================
            MOBILE HEADER
        =================================================== */}

        <div
          className="
            lg:hidden

            h-16
            shrink-0

            flex
            items-center
            justify-between

            px-4

            bg-white
            dark:bg-[#101F34]

            border-b
            border-gray-200
            dark:border-white/10
          "
        >

          {/* LEFT SIDE */}

          <div className="flex items-center gap-3 min-w-0">

            {/* HAMBURGER */}

            <button
              type="button"
              onClick={() => setSidebarOpen(true)}
              className="
                w-10
                h-10
                shrink-0

                rounded-xl

                flex
                items-center
                justify-center

                text-gray-700
                dark:text-white

                hover:bg-gray-100
                dark:hover:bg-white/10

                transition
              "
              aria-label="Open sidebar"
            >
              <Menu size={22} />
            </button>


            {/* BRAND */}

            <div className="min-w-0">

              <h1
                className="
                  text-sm
                  font-bold

                  text-gray-900
                  dark:text-white
                "
              >
                Dynasty
                <span className="text-[#C9A758]">
                  {" "}Admin
                </span>
              </h1>

              <p
                className="
                  text-[9px]
                  text-gray-500
                  dark:text-gray-400
                "
              >
                Management Portal
              </p>

            </div>

          </div>


          {/* RIGHT SIDE */}

          <div className="flex items-center gap-1">

            {/* NOTIFICATIONS */}

            <button
              type="button"
              className="
                relative

                w-9
                h-9

                rounded-xl

                flex
                items-center
                justify-center

                text-gray-700
                dark:text-white

                hover:bg-gray-100
                dark:hover:bg-white/10

                transition
              "
              aria-label="Notifications"
            >
              <Bell size={19} />
            </button>


            {/* THEME */}

            <ThemeToggle />


            {/* PROFILE */}

            <button
              type="button"
              onClick={() => setShowProfile(true)}
              className="
                w-9
                h-9

                rounded-xl

                flex
                items-center
                justify-center

                bg-[#C9A758]/10

                border
                border-[#C9A758]/30

                text-[#C9A758]

                hover:bg-[#C9A758]/20

                transition
              "
              aria-label="Open profile"
            >
              <User size={18} />
            </button>

          </div>

        </div>


        {/* ===================================================
            DESKTOP TOPBAR
        =================================================== */}

        <div className="hidden lg:block shrink-0">
          <Topbar />
        </div>


        {/* ===================================================
            CONTENT
        =================================================== */}

        <main
          className="
            flex-1
            overflow-y-auto

            px-4
            sm:px-5
            md:px-6
            lg:px-8

            py-5
            md:py-6
          "
        >

          <div className="max-w-7xl mx-auto">

            {children}

          </div>

        </main>

      </div>


      {/* =====================================================
          ADMIN PROFILE MODAL
      ===================================================== */}

      <AdminProfileModal
        isOpen={showProfile}
        onClose={() => setShowProfile(false)}
      />

    </div>
  );
}