import {
  Search,
  SlidersHorizontal,
  X,
} from "lucide-react";

export default function PropertyFilters({
  filters,
  onChange,
  onClear,
  propertyTypes = [],
  locations = [],
}) {
  const updateFilter = (name, value) => {
    onChange({
      ...filters,
      [name]: value,
    });
  };

  return (
   <div
  className="
    w-full
    max-w-full
    overflow-hidden

    rounded-3xl
    border
    border-white/10
    bg-white/[0.03]

    p-4
    sm:p-5
    md:p-6
  "
>

      {/* Header */}

      <div
        className="
          flex
          items-center
          justify-between
          gap-4
          mb-6
        "
      >

        <div className="flex items-center gap-3">

          <SlidersHorizontal
            size={20}
            className="text-[#C9A758]"
          />

          <div>

            <h3 className="text-lg font-semibold text-white">
              Find Your Property
            </h3>

            <p className="text-sm text-gray-500">
              Refine your search
            </p>

          </div>

        </div>


        <button
          type="button"
          onClick={onClear}
          className="
            flex
            items-center
            gap-2
            text-sm
            text-gray-400
            hover:text-[#C9A758]
            transition
          "
        >
          <X size={16} />
          Clear
        </button>

      </div>


      {/* Filters */}

   <div
  className="
    grid
    w-full
    min-w-0

    grid-cols-1
    md:grid-cols-2
    lg:grid-cols-3
    xl:grid-cols-5

    gap-3
    sm:gap-4
  "
>

        {/* Search */}

        <div className="relative min-w-0">

          <Search
            size={18}
            className="
              absolute
              left-4
              top-1/2
              -translate-y-1/2
              text-gray-500
            "
          />

          <input
  type="text"
  value={filters.search}
  onChange={(e) =>
    updateFilter("search", e.target.value)
  }
  placeholder="Search property or location..."
  className="
    w-full
    min-w-0

    rounded-xl

    border
    border-white/10

    bg-[#101010]

    px-11
    py-3.5

    text-white
    placeholder:text-gray-600

    outline-none

    focus:border-[#C9A758]

    transition
  "
/>

        </div>

        {/* Location */}

<select
  value={filters.location}
  onChange={(e) =>
    updateFilter("location", e.target.value)
  }
  className="
    w-full
    min-w-0
    rounded-xl
    border
    border-white/10
    bg-[#101010]
    px-4
    py-3.5
    text-white
    outline-none
    focus:border-[#C9A758]
  "
>
  <option value="">
    All Locations
  </option>

  {locations.map((location) => (
    <option
      key={location}
      value={location}
    >
      {location}
    </option>
  ))}
</select>


        {/* Property Type */}

        <select
  value={filters.propertyType}
  onChange={(e) =>
    updateFilter("propertyType", e.target.value)
  }
  className="
    w-full
    min-w-0

    rounded-xl
    border
    border-white/10

    bg-[#101010]

    px-4
    py-3.5

    text-white

    outline-none

    focus:border-[#C9A758]
  "
>
  <option value="">
    All Property Types
  </option>

  {propertyTypes.map((type) => (
    <option
      key={type}
      value={type}
    >
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </option>
  ))}
</select>


        {/* Listing Type */}

        <select
          value={filters.listingType}
          onChange={(e) =>
            updateFilter(
              "listingType",
              e.target.value
            )
          }
          className="
          w-full
          min-w-0
            rounded-xl
            border
            border-white/10
            bg-[#101010]
            px-4
            py-3.5
            text-white
            outline-none
            focus:border-[#C9A758]
          "
        >

          <option value="">
            Sale or Rent
          </option>

          <option value="sale">
            For Sale
          </option>

          <option value="rent">
            For Rent
          </option>

          <option value="both">
            For Sale & Rent
          </option>

        </select>


        {/* Bedrooms */}

        <select
          value={filters.bedrooms}
          onChange={(e) =>
            updateFilter(
              "bedrooms",
              e.target.value
            )
          }
          className="
          w-full
          min-w-0
            rounded-xl
            border
            border-white/10
            bg-[#101010]
            px-4
            py-3.5
            text-white
            outline-none
            focus:border-[#C9A758]
          "
        >

          <option value="">
            Any Bedrooms
          </option>

          <option value="1">
            1+ Bedroom
          </option>

          <option value="2">
            2+ Bedrooms
          </option>

          <option value="3">
            3+ Bedrooms
          </option>

          <option value="4">
            4+ Bedrooms
          </option>

        </select>

      </div>


      {/* Second Row */}

      <div
  className="
    mt-3
    sm:mt-4

    grid
    w-full
    min-w-0

    grid-cols-1
    md:grid-cols-3

    gap-3
    sm:gap-4
  "
>

        {/* Minimum Price */}

        <input
          type="number"
          value={filters.minPrice}
          onChange={(e) =>
            updateFilter(
              "minPrice",
              e.target.value
            )
          }
          placeholder="Minimum price"
          className="
          min-w-0
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#101010]
            px-4
            py-3.5
            text-white
            placeholder:text-gray-600
            outline-none
            focus:border-[#C9A758]
          "
        />


        {/* Maximum Price */}

        <input
          type="number"
          value={filters.maxPrice}
          onChange={(e) =>
            updateFilter(
              "maxPrice",
              e.target.value
            )
          }
          placeholder="Maximum price"
          className="
          min-w-0
            w-full
            rounded-xl
            border
            border-white/10
            bg-[#101010]
            px-4
            py-3.5
            text-white
            placeholder:text-gray-600
            outline-none
            focus:border-[#C9A758]
          "
        />


        {/* Sort */}

        <select
          value={filters.sort}
          onChange={(e) =>
            updateFilter(
              "sort",
              e.target.value
            )
          }
          className="
          w-full
          min-w-0
            rounded-xl
            border
            border-white/10
            bg-[#101010]
            px-4
            py-3.5
            text-white
            outline-none
            focus:border-[#C9A758]
          "
        >

          <option value="newest">
            Newest First
          </option>

          <option value="price-low">
            Price: Low to High
          </option>

          <option value="price-high">
            Price: High to Low
          </option>

        </select>

      </div>

    </div>
  );
}