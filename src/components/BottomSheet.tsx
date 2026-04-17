import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-foreground/30 backdrop-blur-sm z-[60]"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ type: "spring", damping: 25, stiffness: 350 }}
            className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[calc(100vw-2rem)] max-w-[420px] max-h-[calc(85vh-5rem)] md:max-h-[85vh] bg-card rounded-3xl z-[70] overflow-y-auto shadow-xl"
          >
            <div className="flex justify-center pt-3 pb-1 sticky top-0 bg-card z-10 rounded-t-3xl">
              <div className="w-10 h-1 rounded-full bg-border" />
            </div>
            {title && (
              <div className="flex items-center justify-between px-5 pb-3 sticky top-4 bg-card z-10">
                <h3 className="text-lg font-bold text-foreground">{title}</h3>
                <button onClick={onClose} className="tap-feedback p-1">
                  <X size={20} className="text-muted-foreground" />
                </button>
              </div>
            )}
            <div className="px-5 pb-8">{children}</div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
