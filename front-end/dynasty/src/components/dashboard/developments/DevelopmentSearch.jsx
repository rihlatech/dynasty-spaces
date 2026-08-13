import { Search } from "lucide-react";

export default function DevelopmentSearch({
  value,
  onChange,
}) {
  return (
    <div className="relative w-full">

      <Search
        size={18}
        className="
          absolute
          left-4
          top-1/2
          -translate-y-1/2
          text-gray-400
          pointer-events-none
        "
      />

      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Search developments..."
        className="
          w-full
          h-12
          pl-12
          pr-4
          rounded-xl
          border
          border-gray-200
          dark:border-white/10
          bg-white
          dark:bg-[#1A1A1A]
          text-black
          dark:text-white
          placeholder:text-gray-500
          dark:placeholder:text-gray-400
          focus:outline-none
          focus:ring-2
          focus:ring-[#C9A758]
        "
      />

    </div>
  );
}