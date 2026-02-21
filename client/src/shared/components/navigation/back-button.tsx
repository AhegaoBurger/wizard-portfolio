import { motion } from "framer-motion";

export default function BackButton({
  onClickAction,
}: {
  onClickAction: () => void;
}) {
  return (
    <motion.button
      className="pixel-button px-4 py-1 text-white text-xs flex items-center gap-2"
      onClick={onClickAction}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <span className="text-sm">&#8592;</span>
      <span>DESKTOP</span>
    </motion.button>
  );
}
