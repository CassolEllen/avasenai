import { ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalLayerProps {
  children: ReactNode;
}

const PortalLayer = ({ children }: PortalLayerProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!mounted) return null;

  return createPortal(children, document.body);
};

export default PortalLayer;