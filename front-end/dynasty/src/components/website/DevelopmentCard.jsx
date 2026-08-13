import { useNavigate } from "react-router-dom";
import { ArrowRight, MapPin, CalendarDays } from "lucide-react";
import { supabase } from "../../config/SupabaseClient";

export default function DevelopmentCard({ development }) {
  const navigate = useNavigate();

  const coverImage = development.cover_image
    ? supabase.storage
        .from("development-media")
        .getPublicUrl(development.cover_image).data.publicUrl
    : "https://placehold.co/1200x700?text=Dynasty+Spaces";

  return (
    <div
      className="
        group
        relative
        rounded-[34px]
        border
        border-[#2B2B2B]
        bg-[#0A0A0A]
        overflow-hidden
        transition-all
        duration-500
        hover:border-[#C9A758]
      "
    >
      {/* GOLD INNER BORDER */}

      <div
        className="
          absolute
          inset-3
          rounded-[26px]
          border
          border-[#C9A758]/50
          pointer-events-none
          group-hover:border-[#C9A758]
          transition
        "
      />

      <div className="grid lg:grid-cols-2">

        {/* IMAGE */}

        <div className="relative h-[340px] lg:h-[420px] overflow-hidden">

          <img
            src={coverImage}
            alt={development.name}
            className="
              w-full
              h-full
              object-cover
              transition
              duration-700
              group-hover:scale-110
            "
          />

          <div
            className="
              absolute
              inset-0
              bg-gradient-to-r
              from-transparent
              to-[#0A0A0A]/30
            "
          />

        </div>

        {/* CONTENT */}

        <div
          className="
            flex
            flex-col
            justify-between
            p-10
            lg:p-14
          "
        >

          <div>

            <h2
              className="
                text-4xl
                font-bold
                text-white
                leading-tight
              "
            >
              {development.name}
            </h2>

            <div
              className="
                flex
                items-center
                gap-2
                mt-6
                text-[#C9A758]
              "
            >
              <MapPin size={18} />

              <span>{development.location}</span>

            </div>

            {development.completion_date && (

              <div
                className="
                  flex
                  items-center
                  gap-2
                  mt-4
                  text-gray-400
                "
              >

                <CalendarDays size={18} />

                <span>
                  Completion • {development.completion_date}
                </span>

              </div>

            )}

            <p
              className="
                mt-8
                leading-8
                text-gray-300
                line-clamp-5
              "
            >
              {development.description}
            </p>

          </div>

          {/* BUTTON */}

          <button
            onClick={()=> navigate(`/developments/${development.id}`)}
            className="
              mt-12
              inline-flex
              items-center
              gap-3
              text-[#C9A758]
              font-semibold
              text-lg
              hover:gap-5
              transition-all
            "
          >

            View Properties

            <ArrowRight size={22} />

          </button>

        </div>

      </div>

    </div>
  );
}