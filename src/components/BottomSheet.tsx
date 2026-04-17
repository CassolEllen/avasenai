import { motion, AnimatePresence } from "framer-motion";
import { ReactNode } from "react";
import { X } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";
import PortalLayer from "@/components/ui/portal-layer";

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
        <PortalLayer>
          <div className="fixed inset-0 z-[90] flex items-center justify-center p-4 sm:p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-foreground/30 backdrop-blur-sm"
              onClick={onClose}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: isMobile ? 12 : 0 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: isMobile ? 12 : 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative z-10 max-h-[85vh] w-[min(480px,calc(100vw-32px))] max-w-[90vw] overflow-y-auto rounded-3xl bg-card shadow-xl"
              style={isMobile ? { paddingBottom: "env(safe-area-inset-bottom, 0px)" } : undefined}
            >
              <div className="sticky top-0 z-10 rounded-t-3xl bg-card">
                <div className="flex justify-center pb-1 pt-3">
                  <div className="h-1 w-10 rounded-full bg-border" />
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
          </div>
        </PortalLayer>
      )}
    </AnimatePresence>
  );
};

export default BottomSheet;
