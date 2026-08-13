import { motion } from "framer-motion";

export default function QuickActionCard({
  icon,
  title,
  description,
  onClick,
}) {
  return (
    <motion.button
      whileHover={{ y: -5 }}
      whileTap={{ scale: 0.98 }}
      onClick={onClick}
      className="
        w-full
        text-left
        bg-white
        dark:bg-[#121212]
        border
        border-gray-200
        dark:border-white/10
        rounded-2xl
        p-6
        transition
        hover:border-[#C9A758]
        hover:shadow-xl
      "
    >
      <div className="w-12 h-12 rounded-xl bg-[#C9A758] flex items-center justify-center mb-5">
        {icon}
      </div>

      <h3 className="text-lg font-semibold text-black dark:text-white">
        {title}
      </h3>

      <p className="mt-2 text-gray-500 dark:text-gray-400">
        {description}
      </p>
    </motion.button>
  );
}