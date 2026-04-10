import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { getProfessorByName } from "@/data/professors";
import ProfessorProfile from "./ProfessorProfile";

interface Props {
  professorName: string;
  className?: string;
}

const ProfessorLink = ({ professorName, className = "" }: Props) => {
  const [open, setOpen] = useState(false);
  const professor = getProfessorByName(professorName);

  if (!professor) {
    return <span className={className}>Prof. {professorName}</span>;
  }

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`inline-flex items-center gap-1 text-primary hover:text-primary/80 hover:underline underline-offset-2 transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/30 rounded ${className}`}
      >
        <span>Prof. {professorName}</span>
        <MessageCircle size={13} className="opacity-60" />
      </button>
      <ProfessorProfile professor={professor} open={open} onClose={() => setOpen(false)} />
    </>
  );
};

export default ProfessorLink;
