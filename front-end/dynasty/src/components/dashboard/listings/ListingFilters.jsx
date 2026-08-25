export default function ListingFilters({
  value,
  onChange,
}) {
  const filters = [
    "all",
    "published",
    "draft",
    "archived",
  ];

  return (
    <div className="flex flex-wrap gap-3">
      {filters.map((filter) => (
        <FilterButton
          key={filter}
         title={
  filter === "all"
    ? "All"
    : filter === "published"
    ? "Published"
    : filter === "draft"
    ? "Drafts"
    : "Archived"
}
          active={value === filter}
          onClick={() => onChange(filter)}
        />
      ))}
    </div>
  );
}

function FilterButton({
  title,
  active,
  onClick,
}) {
  return (
    <button
      onClick={onClick}
      className={`
        px-5
        py-2.5
        rounded-xl
        font-medium
        transition-all

        ${
          active
            ? "bg-[#101F34] text-white dark:bg-[#C9A758] dark:text-black shadow-md"
            : "bg-white dark:bg-[#1A1A1A] text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-white/10 hover:bg-gray-100 dark:hover:bg-white/10"
        }
      `}
    >
      {title}
    </button>
    
    
  );
   
}