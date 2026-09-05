import { amenityIcons } from "../../config/amenityIcons";

const AmenityCard = ({
  name,
  description,
  iconKey = "default",
}) => {
  const Icon = amenityIcons[iconKey] || amenityIcons.default;

  return (
    <div
      className="
        group
        rounded-2xl
        border
        border-white/10
        bg-white/[0.03]
        p-5
        sm:p-6
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-[#C9A758]/40
        hover:bg-white/[0.05]
      "
    >
      <div
        className="
          flex
          h-12
          w-12
          items-center
          justify-center
          rounded-xl
          border
          border-[#C9A758]/20
          bg-[#C9A758]/10
          text-[#C9A758]
          transition-all
          duration-300
          group-hover:border-[#C9A758]/40
          group-hover:bg-[#C9A758]/15
        "
      >
        <Icon size={24} strokeWidth={1.7} />
      </div>

      <h3
        className="
          mt-5
          text-base
          sm:text-lg
          font-semibold
          text-white
        "
      >
        {name}
      </h3>

      {description && (
        <p
          className="
            mt-2
            text-sm
            leading-6
            text-gray-400
          "
        >
          {description}
        </p>
      )}
    </div>
  );
};

export default AmenityCard;