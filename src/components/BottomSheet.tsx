import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface BottomSheetProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
}

const BottomSheet = ({ open, onClose, title, children }: BottomSheetProps) => {
  const isMobile = useIsMobile();

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
          {isMobile ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed left-1/2 top-1/2 z-[70] w-[calc(100vw-32px)] max-w-[420px] max-h-[85vh] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-card shadow-xl"
              style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
            >
              <div className="sticky top-0 z-10 rounded-t-3xl bg-card">
                <div className="flex justify-center pt-3 pb-1">
                  <div className="w-10 h-1 rounded-full bg-border" />
                </div>
                {title && (
                  <div className="flex items-center justify-between px-5 pb-3 pt-1">
                    <h3 className="pr-3 text-lg font-bold text-foreground">{title}</h3>
                    <button onClick={onClose} className="tap-feedback p-1">
                      <X size={20} className="text-muted-foreground" />
                    </button>
                  </div>
                )}
              </div>
              <div className="px-5 pb-8 pt-1">{children}</div>
            </motion.div>
          ) : (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="fixed left-1/2 top-1/2 z-[70] max-h-[85vh] w-[calc(100vw-2rem)] max-w-[420px] -translate-x-1/2 -translate-y-1/2 overflow-y-auto rounded-3xl bg-card shadow-xl"
            >
              <div className="flex justify-center pb-1 pt-3 sticky top-0 bg-card z-10 rounded-t-3xl">
                <div className="w-10 h-1 rounded-full bg-border" />
              </div>
              {title && (
                <div className="sticky top-4 z-10 flex items-center justify-between bg-card px-5 pb-3">
                  <h3 className="text-lg font-bold text-foreground">{title}</h3>
                  <button onClick={onClose} className="tap-feedback p-1">
                    <X size={20} className="text-muted-foreground" />
                  </button>
                </div>
              )}
              <div className="px-5 pb-8">{children}</div>
            </motion.div>
          )}
        </>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
