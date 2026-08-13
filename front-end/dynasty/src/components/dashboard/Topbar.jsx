import { Bell, User } from "lucide-react";
import { useState } from "react";
import AdminProfileModal from "../modals/AdminProfileModal";

import ThemeToggle from "../ui/ThemeToggle";

export default function Topbar() {

  const [showProfile, setShowProfile] = useState(false);

  return (
    <header
      className="
        h-20
        bg-white
        dark:bg-[#121212]

        border-b
        border-gray-200
        dark:border-white/10

        px-8

        flex
        items-center
        justify-end
      "
    >

      {/* =====================================================
          RIGHT SIDE
      ===================================================== */}

      <div className="flex items-center gap-5">

        {/* Theme Toggle */}

        <ThemeToggle />


        {/* Notification */}

        <button
          type="button"
          className="
            relative

            p-3

            rounded-xl

            text-black
            dark:text-white

            hover:bg-gray-100
            dark:hover:bg-white/10

            transition
          "
        >
          <Bell size={21} />
        </button>


{/* =================================================
    PROFILE
================================================= */}

<button
  type="button"
  onClick={() => setShowProfile(true)}
  className="
    flex
    items-center
    gap-3

    rounded-xl

    px-3
    py-2

    bg-gray-50
    dark:bg-white/[0.05]

    border
    border-gray-200
    dark:border-white/10

    hover:bg-[#C9A758]/10
    dark:hover:bg-[#C9A758]/10

    hover:border-[#C9A758]/30
    dark:hover:border-[#C9A758]/30

    transition-all
    duration-200

    text-left

    cursor-pointer
  "
>

  {/* Profile Avatar */}

  <div
    className="
      w-10
      h-10

      rounded-full

      bg-[#C9A758]/15
      dark:bg-[#C9A758]/15

      border
      border-[#C9A758]/30

      flex
      items-center
      justify-center

      text-[#C9A758]

      shrink-0
    "
  >
    <User size={19} />
  </div>


  {/* Profile Information */}

  <div>

    <p
      className="
        font-semibold
        text-black
        dark:text-white
      "
    >
      Administrator
    </p>

    <p
      className="
        text-xs
        text-gray-500
        dark:text-gray-400
      "
    >
      Dynasty Spaces
    </p>

  </div>

</button>

      </div>
      <AdminProfileModal
  isOpen={showProfile}
  onClose={() => setShowProfile(false)}
/>

    </header>
    
  );
}