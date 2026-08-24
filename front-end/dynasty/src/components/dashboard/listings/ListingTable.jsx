import {
  Pencil,
  Trash2,
  Loader2,
  Archive,
  ArchiveRestore,
} from "lucide-react";


export default function ListingTable({
  loading,
  listings,
  onEdit,
  onDelete,
  onArchive,
  onRestore,
}) {

  return (
    <div
      className="
        w-full
        overflow-x-auto
        rounded-2xl
      "
    >

      <table className="w-full table-auto">

        <thead
          className="
            bg-gray-50
            dark:bg-[#1A1A1A]
          "
        >

          <tr>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Thumbnail
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Title
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Type
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Bedrooms
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Price
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Available Units
            </th>

            <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
              Status
            </th>

            <th className="px-6 py-5 text-center text-sm font-semibold dark:text-white">
              Actions
            </th>

          </tr>

        </thead>


        <tbody>

          {/* =====================================================
              LOADING
          ===================================================== */}

          {loading && (
            <tr>

              <td
                colSpan={8}
                className="py-16"
              >

                <div className="flex flex-col items-center justify-center gap-4">

                  <Loader2
                    size={34}
                    className="animate-spin text-[#C9A758]"
                  />

                  <p className="text-gray-500 dark:text-gray-400">
                    Loading listings...
                  </p>

                </div>

              </td>

            </tr>
          )}


          {/* =====================================================
              LISTINGS
          ===================================================== */}

          {!loading &&
            listings.map((listing) => {

              const cover =
                listing.listing_media?.find(
                  (item) => item.is_primary
                ) ||
                listing.listing_media?.[0];


              return (

                <tr
                  key={listing.id}
                  className="
                    border-t
                    border-gray-200
                    dark:border-white/10
                    hover:bg-gray-50
                    dark:hover:bg-[#1A1A1A]
                    transition
                  "
                >

                  {/* Thumbnail */}

                  <td className="px-6 py-5">

                    <div
                      className="
                        w-24
                        h-16
                        rounded-xl
                        overflow-hidden
                        bg-gray-100
                        dark:bg-[#1A1A1A]
                      "
                    >

                      <img
                        src={
                          cover?.media_url ||
                          "https://placehold.co/400x300?text=No+Image"
                        }
                        alt={listing.title}
                        className="
                          w-full
                          h-full
                          object-cover
                        "
                      />

                    </div>

                  </td>


                  {/* Title */}

                  <td className="px-6 py-5 dark:text-white">
                    {listing.title}
                  </td>


                  {/* Listing Type */}

                  <td className="px-6 py-5 capitalize dark:text-white">
                    {listing.listing_type}
                  </td>


                  {/* Bedrooms */}

                  <td className="px-6 py-5 dark:text-white">
                    {listing.bedrooms ?? "-"}
                  </td>


                  {/* Price */}

                  <td className="px-6 py-5 dark:text-white">

                    {listing.currency}{" "}

                    {Number(
                      listing.price || 0
                    ).toLocaleString()}

                  </td>


                  {/* Available Units */}

                  <td className="px-6 py-5 dark:text-white">
                    {listing.available_units ?? 0}
                  </td>


                  {/* Status */}

                  <td className="px-6 py-5">

                    <span
                      className={`
                        px-3
                        py-1
                        rounded-full
                        text-sm
                        font-medium

                        ${
                          listing.status === "published"
                            ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                            : listing.status === "archived"
                              ? "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                              : "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
                        }
                      `}
                    >
                      {listing.status}

                    </span>

                  </td>


                  {/* Actions */}

                  <td className="px-6 py-5">

                    <div className="flex justify-center gap-3">

                      {/* Edit */}

                      <button
                        onClick={() =>
                          onEdit(listing)
                        }
                        className="
                          p-2
                          rounded-lg
                          bg-gray-100
                          dark:bg-[#1A1A1A]
                          text-[#101F34]
                          dark:text-white
                          hover:bg-gray-200
                          dark:hover:bg-[#2A2A2A]
                          transition
                        "
                      >

                        <Pencil size={18} />

                      </button>


                      {/* Archive */}

                      {listing.status === "published" && (

                        <button
                          onClick={() =>
                            onArchive(listing)
                          }
                          className="
                            p-2
                            rounded-lg
                            bg-gray-100
                            dark:bg-[#1A1A1A]
                            text-gray-700
                            dark:text-gray-300
                            hover:bg-amber-100
                            hover:text-amber-700
                            dark:hover:bg-amber-900/30
                            dark:hover:text-amber-400
                            transition
                          "
                        >

                          <Archive size={18} />

                        </button>

                      )}


                      {/* Restore */}

                      {listing.status === "archived" && (

                        <button
                          onClick={() =>
                            onRestore(listing)
                          }
                          className="
                            p-2
                            rounded-lg
                            bg-gray-100
                            dark:bg-[#1A1A1A]
                            text-gray-700
                            dark:text-gray-300
                            hover:bg-green-100
                            hover:text-green-700
                            dark:hover:bg-green-900/30
                            dark:hover:text-green-400
                            transition
                          "
                        >

                          <ArchiveRestore size={18} />

                        </button>

                      )}


                      {/* Delete */}

                      <button
                        onClick={() =>
                          onDelete(listing)
                        }
                        className="
                          p-2
                          rounded-lg
                          bg-gray-100
                          dark:bg-[#1A1A1A]
                          text-black
                          dark:text-white
                          hover:bg-red-100
                          hover:text-red-600
                          dark:hover:bg-red-900/30
                          dark:hover:text-red-400
                          transition
                        "
                      >

                        <Trash2 size={18} />

                      </button>

                    </div>

                  </td>

                </tr>

              );

            })}


          {/* =====================================================
              EMPTY STATE
          ===================================================== */}

          {!loading &&
            listings.length === 0 && (

              <tr>

                <td
                  colSpan={8}
                  className="py-20 text-center"
                >

                  <div className="space-y-3">

                    <h3
                      className="
                        text-2xl
                        font-bold
                        text-[#101F34]
                        dark:text-white
                      "
                    >
                      No Listings Found
                    </h3>

                    <p
                      className="
                        text-gray-500
                        dark:text-gray-400
                      "
                    >
                      Create your first property
                      listing to get started.
                    </p>

                  </div>

                </td>

              </tr>

            )}

        </tbody>

      </table>

    </div>
  );
}