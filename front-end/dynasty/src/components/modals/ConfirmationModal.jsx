import { AlertTriangle } from "lucide-react";

export default function ConfirmationModal({
  open,
  title = "Confirm Action",
  message,
  confirmText = "Confirm",
  confirmColor = "red",
  onClose,
  onConfirm,
}) {

  if (!open) return null;


  const buttonColors = {
    red: "bg-red-500 hover:bg-red-600",
    yellow: "bg-yellow-500 hover:bg-yellow-600",
    green: "bg-green-600 hover:bg-green-700",
    blue: "bg-blue-600 hover:bg-blue-700",
  };


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

      <div
        onClick={(e)=> e.stopPropagation()}
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


        {/* ICON */}

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



        {/* TITLE */}

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
          {title}
        </h2>



        {/* MESSAGE */}

        <p
          className="
            mt-4
            text-center
            text-gray-500
            dark:text-gray-400
            leading-relaxed
          "
        >
          {message}
        </p>



        {/* BUTTONS */}

        <div
          className="
            flex
            justify-end
            gap-4
            mt-8
          "
        >

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
            onClick={onConfirm}
            className={`
              px-5
              py-3
              rounded-xl
              text-white
              transition
              ${buttonColors[confirmColor]}
            `}
          >
            {confirmText}
          </button>


        </div>


      </div>

    </div>

  );
}