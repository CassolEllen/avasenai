import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import PageTransition from "@/components/PageTransition";
import { messages } from "@/data/mockData";

const MessageDetail = () => {
  const { id } = useParams();
  const msg = messages.find(m => m.id === id);
  if (!msg) return <div className="p-8 text-center text-muted-foreground">Mensagem não encontrada</div>;

  return (
    <PageTransition direction="slide">
      <div className="max-w-2xl">
        <motion.div initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold text-sm">
              {msg.professor.split(" ").map(n => n[0]).join("")}
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">{msg.professor}</p>
              <span className="text-[10px] font-medium text-primary bg-primary/10 px-2 py-0.5 rounded-pill">{msg.subject}</span>
            </div>
            <span className="ml-auto text-[10px] text-muted-foreground">{msg.timestamp}</span>
          </div>
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">{msg.body}</p>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  );
};

export default MessageDetail;
