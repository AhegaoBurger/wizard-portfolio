import { motion } from "framer-motion";

export default function DialogBox({
  onCloseAction,
}: {
  onCloseAction: () => void;
}) {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 pointer-events-none">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-72 window-chrome glow-strong pointer-events-auto"
      >
        <div className="p-4 flex flex-col items-center">
          <div className="mb-2">
            <div className="w-8 h-8 border border-white flex items-center justify-center mb-2 mx-auto">
              <div className="text-white text-xl">!</div>
            </div>
          </div>

          <p className="text-white text-sm text-center mb-4">
            Are you sure you want to delete &quot;Social Life&quot;?
          </p>

          <motion.button
            className="pixel-button px-4 py-1 text-white text-sm"
            onClick={onCloseAction}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Do I have a choice?
          </motion.button>
        </div>
      </motion.div>
    </div>
  );
}
