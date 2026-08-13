import { AlertTriangle } from "lucide-react";

export default function DeleteDevelopmentModal({
  open,
  development,
  onClose,
  onDelete,
}) {
  if (!open) return null;

  return (
  <div
  onClick={onClose}
  className="
    fixed
    inset-0
    z-50
    flex
    items-center
    justify-center
    bg-black/60
    p-6
  "
>
{/* ===========================================(1) */}
  <div
    className="
      w-full
      max-w-md
      rounded-3xl
      bg-white
      dark:bg-[#121212]
      border
      border-gray-200
      dark:border-white/10
      p-8
    "
  >
    {/* =========================================(2) */}
    <div className="flex justify-center">

  <div
    className="
      w-20
      h-20
      rounded-full
      bg-red-100
      dark:bg-red-900/20
      flex
      items-center
      justify-center
    "
  >

    <AlertTriangle
      size={40}
      className="text-red-500"
    />

  </div>

</div>

<h2
  className="
    mt-6
    text-2xl
    font-bold
    text-center
    text-[#101F34]
    dark:text-white
  "
>
  Delete Development
</h2>

<p
  className="
    mt-4
    text-center
    text-gray-500
    dark:text-gray-400
    leading-relaxed
  "
>
  Are you sure you want to delete{" "}
  <span className="font-semibold text-black dark:text-white">
    {development?.name}
  </span>
  ? This action cannot be undone.
</p>

<div className="flex justify-end gap-4 mt-8">

  <button
    type="button"
    onClick={onClose}
    className="
      px-5
      py-3
      rounded-xl
      border
      border-gray-300
      dark:border-white/10
      text-gray-700
      dark:text-white
      hover:bg-gray-100
      dark:hover:bg-[#1A1A1A]
      transition
    "
  >
    Cancel
  </button>

  <button
    type="button"
    onClick={onDelete}
    className="
      px-5
      py-3
      rounded-xl
      bg-red-500
      text-white
      hover:bg-red-600
      transition
    "
  >
    Delete
  </button>

</div>


  </div>
  {/* ============================================(3) */}
</div>


// ==========================(4)





  );
}