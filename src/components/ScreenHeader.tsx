import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { ReactNode } from "react";

interface ScreenHeaderProps {
  title: string;
  showBack?: boolean;
  rightAction?: ReactNode;
}

const ScreenHeader = ({ title, showBack = false, rightAction }: ScreenHeaderProps) => {
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 bg-card/80 backdrop-blur-xl border-b border-border">
      <div className="flex items-center justify-between px-4 h-14">
        <div className="flex items-center gap-3">
          {showBack && (
            <button onClick={() => navigate(-1)} className="tap-feedback p-1 -ml-1">
              <ArrowLeft size={22} className="text-foreground" />
            </button>
          )}
          <h1 className="text-lg font-bold text-foreground">{title}</h1>
        </div>
        {rightAction && <div>{rightAction}</div>}
      </div>
    </header>
  );
};

export default ScreenHeader;
