import { useNavigate } from "react-router-dom";
import { supabase } from "../../../config/SupabaseClient";
import {
  Pencil,
  Trash2,
  Archive,
  Loader2,
  RotateCcw,
} from "lucide-react";

export default function DevelopmentTable({
  loading,
  developments,
  onEdit,
  onArchive,
  onDelete,
  showArchive = true,
}) {
  const navigate = useNavigate();


  
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
          Development
        </th>

        <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
          Location
        </th>

        <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
          Status
        </th>

        <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
          Completion
        </th>

        <th className="px-6 py-5 text-left text-sm font-semibold dark:text-white">
          Created
        </th>

        <th className="px-6 py-5 text-center text-sm font-semibold dark:text-white">
          Actions
        </th>

      </tr>

    </thead>

    <tbody>

      {loading && (
  <tr>

    <td
      colSpan={7}
      className="py-16"
    >

      <div className="flex flex-col items-center justify-center gap-4">

        <Loader2
          size={34}
          className="animate-spin text-[#C9A758]"
        />

        <p className="text-gray-500 dark:text-gray-400">
          Loading developments...
        </p>

      </div>

    </td>

  </tr>
)}


{!loading && developments.length === 0 && (

  
  <tr>

    <td
      colSpan={7}
      className="py-20 text-center"
    >

      <div className="space-y-3">

        <h3 className="text-2xl font-bold text-[#101F34] dark:text-white">
          No Developments Found
        </h3>

        <p className="text-gray-500 dark:text-gray-400">
          Create your first development to get started.
        </p>

      </div>

    </td>

  </tr>
)}

{!loading &&
  developments.map((development) => {

       
       

const coverImageUrl = development.cover_image
  ? development.cover_image.startsWith("http")
    ? development.cover_image
    : supabase.storage
        .from("development-media")
        .getPublicUrl(development.cover_image).data.publicUrl
  : "https://placehold.co/400x300?text=No+Image";


      // console.log("development:", development);
      // console.log("Cover Image:", development.cover_image);
      // console.log("Public URL:", coverImageUrl);
  

    return (

   <tr
  key={development.id}
  onClick={() =>
  navigate(`/admin/developments/${development.id}/listings`)}
  className="
    border-t
    border-gray-200
    dark:border-white/10
    hover:bg-gray-50
    dark:hover:bg-[#1A1A1A]
    transition
    cursor-pointer
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
  src={coverImageUrl}
  alt={development.name}
  className="w-full h-full object-cover"
/>
 

        </div>

      </td>

      {/* Development */}

      <td className="px-6 py-5">

        <div>

          <h3 className="font-semibold text-[#101F34] dark:text-white">
            {development.name}
          </h3>

          <p className="text-sm text-gray-500 dark:text-gray-400">
            {development.slug}
          </p>

        </div>

      </td>

      {/* Location */}

<td className="px-6 py-5">

  <p className="text-gray-700 dark:text-gray-300">
    {development.location || "-"}
  </p>

</td>

{/* Status */}

<td className="px-6 py-5">

  <span
    className={`
      inline-flex
      px-3
      py-1
      rounded-full
      text-xs
      font-semibold

      ${
        showArchive && development.status === "published"
          ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
          : development.status === "draft"
          ? "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400"
          : "bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300"
      }
    `}
  >
    {development.status}
  </span>

</td>

{/* Completion */}

<td className="px-6 py-5 text-gray-700 dark:text-gray-300">

  {development.completion_date || "-"}

</td>

{/* Created */}

<td className="px-6 py-5 text-gray-700 dark:text-gray-300">

  {development.created_at
    ? new Date(development.created_at).toLocaleDateString()
    : "-"}

</td>

{/* Actions */}

<td className="px-6 py-5">

  <div className="flex justify-center gap-3">

    <button
      onClick={(e) => {
  e.stopPropagation();
  onEdit(development);
}}
      className="
        p-2
        rounded-lg
        bg-blue-100
        text-blue-700
        hover:bg-blue-200
        transition
      "
    >
      <Pencil size={18} />
    </button>

  {showArchive ? (
  development.status === "published" && (
    <button
      onClick={(e) => {
  e.stopPropagation();
  onArchive(development);
}}
      className="
        p-2
        rounded-lg
        bg-yellow-100
        text-yellow-700
        hover:bg-yellow-200
        transition
      "
    >
      <Archive size={18} />
    </button>
  )
) : (
  <button
  onClick={(e) => {
  e.stopPropagation();
  onArchive(development);
}}
  className="
    p-2
    rounded-lg
    bg-green-100
    text-green-700
    hover:bg-green-200
    transition
  "
  title="Restore Development"
>
  <RotateCcw size={18} />
</button>
)}


    <button
      onClick={(e) => {
  e.stopPropagation();
  onDelete(development);
}}
      className="
        p-2
        rounded-lg
        bg-red-100
        text-red-600
        hover:bg-red-200
        transition
      "
    >
      <Trash2 size={18} />
    </button>

  </div>

</td>

</tr>

    );
  })
}



    </tbody>

  </table>

</div>


  );
}