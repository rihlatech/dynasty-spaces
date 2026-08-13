import { Sun, Moon } from "lucide-react";
import { useTheme } from "../../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();

  return (
    <button
      onClick={toggleTheme}
      className="
        w-11
        h-11
        flex
        items-center
        justify-center
        rounded-xl
        border
        border-gray-300
        dark:border-white/10
        bg-white
        dark:bg-[#1A1A1A]
        hover:border-[#C9A758]
        hover:shadow-lg
        transition-all
        duration-300
      "
      aria-label="Toggle Theme"
    >
      {theme === "light" ? (
        <Moon
          size={20}
          className="
            text-[#101F34]
            hover:text-[#C9A758]
            transition
          "
        />
      ) : (
        <Sun
          size={20}
          className="
            text-yellow-400
            hover:text-[#C9A758]
            transition
          "
        />
      )}
    </button>
  );
}