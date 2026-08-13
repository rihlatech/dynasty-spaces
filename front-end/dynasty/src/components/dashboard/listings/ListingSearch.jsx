import { Search } from "lucide-react";

export default function ListingSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative">

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
        "
      />

      <input
        type="text"
        placeholder="Search listings..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="
          w-full
          pl-11
          pr-4
          py-3
          rounded-xl
          border
          border-gray-200
          dark:border-white/10
          bg-white
          dark:bg-[#1A1A1A]
          text-[#101F34]
          dark:text-white
          outline-none
          focus:ring-2
          focus:ring-[#C9A758]
        "
      />

    </div>
  );
}