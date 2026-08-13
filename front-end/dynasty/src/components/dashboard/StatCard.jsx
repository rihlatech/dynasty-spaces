import { motion } from "framer-motion";

export default function StatCard({
  title,
  value,
  icon,
  color = "#C9A758",
}) {
  return (
    <motion.div
      whileHover={{ y: -6 }}
      transition={{ duration: 0.25 }}
      className="
        bg-white
        dark:bg-[#121212]
        rounded-2xl
        p-6
        shadow-sm
        border
        border-gray-200
        dark:border-white/10
      "
    >
      <div className="flex items-center justify-between">

        <div>

          <p className="text-gray-500 dark:text-gray-400 text-sm">
            {title}
          </p>

          <h2 className="mt-3 text-3xl font-bold text-black dark:text-white">
            {value}
          </h2>

        </div>

        <div
          className="w-14 h-14 rounded-2xl flex items-center justify-center"
          style={{ backgroundColor: color }}
        >
          {icon}
        </div>

      </div>
    </motion.div>
  );
}