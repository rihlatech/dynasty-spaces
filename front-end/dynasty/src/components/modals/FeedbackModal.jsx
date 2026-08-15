import { CheckCircle, XCircle, AlertTriangle, Info, X } from "lucide-react";

export default function FeedbackModal({
  isOpen,
  onClose,
  title,
  message,
  type = "success",
  buttonText = "Continue",
}) {

  if (!isOpen) return null;

  const icons = {
    success: <CheckCircle size={28} />,
    error: <XCircle size={28} />,
    warning: <AlertTriangle size={28} />,
    info: <Info size={28} />,
  };

  const iconColors = {
    success: "text-green-500 bg-green-500/10",
    error: "text-red-500 bg-red-500/10",
    warning: "text-yellow-500 bg-yellow-500/10",
    info: "text-blue-500 bg-blue-500/10",
  };

  return (
    <div
      className="
        fixed
        inset-0
        z-[100]
        flex
        items-center
        justify-center
        bg-black/60
        backdrop-blur-sm
        p-6
      "
      onClick={onClose}
    >

      <div
        className="
          relative
          w-full
          max-w-md
          rounded-3xl
          bg-white
          dark:bg-[#121212]
          border
          border-gray-200
          dark:border-white/10
          p-8
          shadow-2xl
        "
        onClick={(e) => e.stopPropagation()}
      >

        {/* CLOSE */}

        <button
          type="button"
          onClick={onClose}
          className="
            absolute
            top-5
            right-5
            w-9
            h-9
            rounded-full
            flex
            items-center
            justify-center
            text-gray-400
            hover:bg-gray-100
            dark:hover:bg-white/10
            transition
          "
        >
          <X size={18} />
        </button>


        {/* ICON */}

        <div
          className={`
            w-16
            h-16
            rounded-2xl
            flex
            items-center
            justify-center
            mb-6
            ${iconColors[type]}
          `}
        >
          {icons[type]}
        </div>


        {/* TITLE */}

        <h2
          className="
            text-2xl
            font-bold
            text-[#101F34]
            dark:text-white
          "
        >
          {title}
        </h2>


        {/* MESSAGE */}

        <p
          className="
            mt-3
            text-gray-500
            dark:text-gray-400
            leading-7
          "
        >
          {message}
        </p>


        {/* ACTION */}

        <button
          type="button"
          onClick={onClose}
          className="
            mt-8
            w-full
            rounded-xl
            bg-[#101F34]
            text-white
            py-3
            font-semibold
            hover:opacity-90
            transition
          "
        >
          {buttonText}
        </button>

      </div>

    </div>
  );
}