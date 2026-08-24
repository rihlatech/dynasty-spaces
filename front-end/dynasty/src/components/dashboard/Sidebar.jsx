// import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../../assets/logo/dynasty-logo.png";
import { supabase } from "../../config/SupabaseClient";

import {
  LayoutDashboard,
  Building2,
  Building,
  Users,
  BarChart3,
  Settings,
  LogOut,
} from "lucide-react";


export default function Sidebar() {

  const navigate = useNavigate();
  const location = useLocation();

  // =========================================================
  // MOBILE SIDEBAR STATE
  // =========================================================

  // const [isOpen, setIsOpen] = useState(false);


  // =========================================================
  // LOGOUT
  // =========================================================

  const handleLogout = async () => {

    const { error } =
      await supabase.auth.signOut();

    if (error) {

      console.error(
        "Logout error:",
        error
      );

      return;
    }

    navigate("/login", {
      replace: true,
    });

  };


  // =========================================================
  // NAVIGATION
  // =========================================================

  const handleNavigate = (path) => {

    navigate(path);

  };


  return (
    <>
      


      {/* =====================================================
          SIDEBAR
      ===================================================== */}

      <aside
  className="
    w-full
    h-full

    bg-[#101F34]
    text-white

    flex
    flex-col

    border-r
    border-white/10

    shadow-2xl
  "
>

        {/* ===================================================
            LOGO / BRAND
        =================================================== */}

        <div
          className="
            px-6
            py-6

            border-b
            border-white/10

            shrink-0
          "
        >

          <div className="flex items-center gap-4">

            {/* LOGO */}

            <div
              className="
                w-16
                h-16

                flex
                items-center
                justify-center

                shrink-0
              "
            >

              <img
                src={logo}
                alt="Dynasty Spaces"
                className="
                  w-full
                  h-full
                  object-contain
                "
              />

            </div>


            {/* BRAND TEXT */}

            <div className="min-w-0">

              <h1
                className="
                  text-xl
                  font-bold
                  whitespace-nowrap
                "
              >
                Dynasty
                <span className="text-[#C9A758]">
                  {" "}Admin
                </span>
              </h1>

              <p
                className="
                  text-xs
                  text-gray-300
                  mt-0.5
                "
              >
                Management Portal
              </p>

            </div>

          </div>

        </div>


        {/* ===================================================
            NAVIGATION
        =================================================== */}

        <nav
          className="
            flex-1

            px-5
            py-8

            space-y-2

            overflow-y-auto
          "
        >

          <SidebarItem
            icon={<LayoutDashboard size={20} />}
            title="Dashboard"
            active={
              location.pathname === "/admin"
            }
            onClick={() =>
              handleNavigate("/admin")
            }
          />




          <SidebarItem
            icon={<Building size={20} />}
            title="Listings"
            active={
              location.pathname.startsWith(
                "/admin/listings"
              )
            }
            onClick={() =>
              handleNavigate(
                "/admin/listings"
              )
            }
          />


          <SidebarItem
            icon={<Users size={20} />}
            title="Editors"
            active={
              location.pathname ===
              "/admin/editors"
            }
            onClick={() =>
              handleNavigate(
                "/admin/editors"
              )
            }
          />


          <SidebarItem
            icon={<BarChart3 size={20} />}
            title="Analytics"
            active={
              location.pathname ===
              "/admin/analytics"
            }
            onClick={() =>
              handleNavigate(
                "/admin/analytics"
              )
            }
          />


          <SidebarItem
            icon={<Settings size={20} />}
            title="Settings"
            active={
              location.pathname ===
              "/admin/settings"
            }
            onClick={() =>
              handleNavigate(
                "/admin/settings"
              )
            }
          />

        </nav>


        {/* ===================================================
            LOGOUT
        =================================================== */}

        <div
          className="
            p-5

            border-t
            border-white/10

            shrink-0
          "
        >

          <SidebarItem
            icon={<LogOut size={20} />}
            title="Logout"
            onClick={handleLogout}
          />

        </div>

      </aside>
    </>
  );
}


// =============================================================
// SIDEBAR ITEM
// =============================================================

function SidebarItem({
  icon,
  title,
  active = false,
  onClick,
}) {

  return (

    <button
      type="button"
      onClick={onClick}
      className={`
        w-full

        flex
        items-center
        gap-4

        px-4
        py-3

        rounded-xl

        text-left

        transition-all
        duration-300

        ${
          active
            ? `
              bg-[#C9A758]
              text-black
              font-semibold
              shadow-lg
            `
            : `
              text-white

              hover:bg-white/10
              hover:text-[#C9A758]
            `
        }
      `}
    >

      <span className="shrink-0">
        {icon}
      </span>

      <span className="truncate">
        {title}
      </span>

    </button>

  );
}