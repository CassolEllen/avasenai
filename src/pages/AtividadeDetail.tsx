import { useState, useRef, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft, Clock, CheckCircle2, AlertTriangle, FileText, Download,
  Upload, X, File, Loader2, Trash2, Paperclip
} from "lucide-react";
import PageTransition from "@/components/PageTransition";
import { assignments } from "@/data/mockData";
import { toast } from "sonner";

const statusConfig = {
  pendente: { label: "Pendente", color: "bg-warning/10 text-warning border-warning/20", icon: Clock },
  enviado: { label: "Enviado", color: "bg-success/10 text-success border-success/20", icon: CheckCircle2 },
  atrasado: { label: "Atrasado", color: "bg-destructive/10 text-destructive border-destructive/20", icon: AlertTriangle },
};

const ACCEPTED_TYPES = ".pdf,.doc,.docx,.txt,.rtf,.odt,.xls,.xlsx,.csv,.ppt,.pptx,.zip,.rar,.7z";

const AtividadeDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const assignment = assignments.find(a => a.id === id);

  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [submitted, setSubmitted] = useState(assignment?.status === "enviado");
  const [dragOver, setDragOver] = useState(false);

  if (!assignment) {
    return (
      <PageTransition>
        <div className="text-center py-20">
          <p className="text-muted-foreground">Atividade não encontrada</p>
          <button onClick={() => navigate("/atividades")} className="text-primary mt-4 text-sm font-medium">
            Voltar às atividades
          </button>
        </div>
      </PageTransition>
    );
  }

  const status = statusConfig[submitted ? "enviado" : assignment.status];
  const StatusIcon = status.icon;

  const handleFileSelect = (file: File) => {
    const maxSizeMB = parseInt(assignment.maxFileSize);
    if (file.size > maxSizeMB * 1024 * 1024) {
      toast.error(`Arquivo excede o limite de ${assignment.maxFileSize}`);
      return;
    }
    setSelectedFile(file);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileSelect(file);
  }, []);

  const handleSubmit = async () => {
    if (!selectedFile) {
      toast.error("Selecione um arquivo para enviar");
      return;
    }
    setUploading(true);
    // Simulate upload
    await new Promise(r => setTimeout(r, 2000));
    setUploading(false);
    setSubmitted(true);
    toast.success("Trabalho enviado com sucesso! 🎉");
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <PageTransition>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Back button */}
        <button
          onClick={() => navigate("/atividades")}
          className="tap-feedback flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft size={16} />
          Voltar às atividades
        </button>

        {/* Header */}
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className={`inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-1 rounded-full border ${status.color}`}>
              <StatusIcon size={12} />
              {status.label}
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold text-foreground">{assignment.title}</h1>
          <p className="text-sm text-muted-foreground mt-1">
            {assignment.subject} · Prof. {assignment.professor}
          </p>
        </div>

        {/* Due date */}
        <div className="bg-card rounded-2xl p-4 shadow-senai flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <Clock size={18} className="text-primary" />
          </div>
          <div>
            <p className="text-xs text-muted-foreground">Prazo de entrega</p>
            <p className="text-sm font-semibold text-foreground">{assignment.dueDateFull}</p>
          </div>
        </div>

        {/* Description & Instructions */}
        <div className="bg-card rounded-2xl p-5 shadow-senai space-y-4">
          <div>
            <h2 className="text-sm font-bold text-foreground mb-2">Descrição</h2>
            <p className="text-sm text-muted-foreground leading-relaxed">{assignment.description}</p>
          </div>
          <div className="border-t border-border pt-4">
            <h2 className="text-sm font-bold text-foreground mb-2">Instruções do Professor</h2>
            <div className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line">
              {assignment.instructions}
            </div>
          </div>
        </div>

        {/* Professor attachments */}
        {assignment.attachments.length > 0 && (
          <div className="bg-card rounded-2xl p-5 shadow-senai">
            <h2 className="text-sm font-bold text-foreground mb-3 flex items-center gap-2">
              <Paperclip size={14} />
              Arquivos do Professor
            </h2>
            <div className="space-y-2">
              {assignment.attachments.map((file, i) => (
                <div
                  key={i}
                  className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 hover:bg-muted transition-colors cursor-pointer"
                >
                  <FileText size={18} className="text-primary flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{file.name}</p>
                    <p className="text-xs text-muted-foreground">{file.size}</p>
                  </div>
                  <Download size={16} className="text-muted-foreground" />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Submission section */}
        <div className="bg-card rounded-2xl p-5 shadow-senai space-y-4">
          <h2 className="text-sm font-bold text-foreground">Enviar Trabalho</h2>

          {/* Already submitted */}
          {submitted && assignment.submittedFile && !selectedFile && (
            <div className="flex items-center gap-3 p-4 rounded-xl bg-success/5 border border-success/20">
              <CheckCircle2 size={20} className="text-success flex-shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground">{assignment.submittedFile.name}</p>
                <p className="text-xs text-muted-foreground">
                  Enviado em {assignment.submittedFile.date} · {assignment.submittedFile.size}
                </p>
              </div>
            </div>
          )}

          {submitted && !selectedFile && (
            <p className="text-xs text-muted-foreground">
              Você já enviou este trabalho. Selecione um novo arquivo para reenviar.
            </p>
          )}

          {/* Upload area */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
            onDragLeave={() => setDragOver(false)}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className={`relative border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
              dragOver
                ? "border-primary bg-primary/5 scale-[1.01]"
                : "border-border hover:border-primary/50 hover:bg-muted/30"
            }`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept={ACCEPTED_TYPES}
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFileSelect(file);
              }}
            />
            <Upload size={32} className={`mx-auto mb-3 ${dragOver ? "text-primary" : "text-muted-foreground"}`} />
            <p className="text-sm font-medium text-foreground mb-1">
              Clique para selecionar ou arraste o arquivo
            </p>
            <p className="text-xs text-muted-foreground">
              PDF, DOC, DOCX, PPT, PPTX, XLS, XLSX, ZIP · Máx. {assignment.maxFileSize}
            </p>
          </div>

          {/* Selected file preview */}
          <AnimatePresence>
            {selectedFile && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="flex items-center gap-3 p-4 rounded-xl bg-primary/5 border border-primary/20"
              >
                <File size={20} className="text-primary flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{selectedFile.name}</p>
                  <p className="text-xs text-muted-foreground">{formatFileSize(selectedFile.size)}</p>
                </div>
                <button
                  onClick={(e) => { e.stopPropagation(); setSelectedFile(null); }}
                  className="tap-feedback p-1.5 rounded-lg hover:bg-destructive/10 transition-colors"
                >
                  <Trash2 size={16} className="text-destructive" />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={!selectedFile || uploading}
            className={`tap-feedback w-full py-3 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
              selectedFile && !uploading
                ? "bg-primary text-primary-foreground hover:opacity-90 shadow-senai"
                : "bg-muted text-muted-foreground cursor-not-allowed"
            }`}
          >
            {uploading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Enviando...
              </>
            ) : (
              <>
                <Upload size={16} />
                Enviar Trabalho
              </>
            )}
          </button>
        </div>
      </div>
    </PageTransition>
  );
};

export default AtividadeDetail;
