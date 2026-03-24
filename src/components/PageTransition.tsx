import { motion } from "framer-motion";
import { ReactNode } from "react";

interface PageTransitionProps {
  children: ReactNode;
  direction?: "slide" | "fade";
}

const variants = {
  slide: {
    initial: { x: "100%", opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: "-30%", opacity: 0 },
  },
  fade: {
    initial: { opacity: 0, y: 10 },
    animate: { opacity: 1, y: 0 },
    exit: { opacity: 0, y: -10 },
  },
};

const PageTransition = ({ children, direction = "fade" }: PageTransitionProps) => {
  const v = variants[direction];
  return (
    <motion.div
      initial={v.initial}
      animate={v.animate}
      exit={v.exit}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="flex-1"
    >
      {children}
    </motion.div>
  );
};

export default PageTransition;
