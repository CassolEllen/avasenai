import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { student, subjects } from "@/data/mockData";

const SENAI_BLUE = [0, 61, 165] as const;
const HEADER_GRAY = [245, 245, 245] as const;

function addHeader(doc: jsPDF, title: string) {
  doc.setFillColor(...SENAI_BLUE);
  doc.rect(0, 0, 210, 35, "F");
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("UniSENAI", 15, 18);
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text("Ambiente Virtual de Aprendizagem", 15, 26);

  doc.setTextColor(0, 0, 0);
  doc.setFontSize(14);
  doc.setFont("helvetica", "bold");
  doc.text(title, 105, 50, { align: "center" });

  doc.setFontSize(9);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(120, 120, 120);
  doc.text(`Gerado em: ${new Date().toLocaleDateString("pt-BR")}`, 105, 57, { align: "center" });
}

function addStudentInfo(doc: jsPDF, y: number): number {
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.setFont("helvetica", "bold");
  doc.text("Dados do Aluno", 15, y);
  y += 7;
  doc.setFont("helvetica", "normal");
  doc.text(`Nome: ${student.name}`, 15, y);
  doc.text(`Matrícula: ${student.matricula}`, 120, y);
  y += 6;
  doc.text(`Curso: ${student.course}`, 15, y);
  doc.text(`Período: ${student.semester}`, 120, y);
  y += 10;
  return y;
}

function addFooter(doc: jsPDF) {
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `UniSENAI - Documento gerado eletronicamente | Página ${i} de ${pageCount}`,
      105,
      290,
      { align: "center" }
    );
  }
}

export function generateBoletim(): Blob {
  const doc = new jsPDF();
  addHeader(doc, "Boletim Escolar");
  let y = addStudentInfo(doc, 65);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(11);
  doc.setTextColor(0, 0, 0);
  doc.text("Notas por Disciplina", 15, y);
  y += 5;

  const allSubjects = subjects;
  const tableData = allSubjects.map((s) => {
    const avg = s.grades.reduce((sum, g) => sum + g.grade * (g.weight / 100), 0);
    return [
      s.name,
      s.professor,
      s.cargaHoraria,
      ...s.grades.map((g) => g.grade.toFixed(1)),
      ...Array(3 - s.grades.length).fill("-"),
      avg.toFixed(1),
      avg >= 7 ? "Aprovado" : avg >= 5 ? "Recuperação" : "Reprovado",
    ];
  });

  autoTable(doc, {
    startY: y,
    head: [["Disciplina", "Professor", "CH", "Nota 1", "Nota 2", "Nota 3", "Média", "Situação"]],
    body: tableData,
    theme: "grid",
    headStyles: { fillColor: [...SENAI_BLUE] as [number, number, number], fontSize: 8, halign: "center" },
    bodyStyles: { fontSize: 8, halign: "center" },
    columnStyles: { 0: { halign: "left" }, 1: { halign: "left" } },
    margin: { left: 15, right: 15 },
  });

  y = (doc as any).lastAutoTable.finalY + 12;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`IRA (Índice de Rendimento Acadêmico): ${student.ira}`, 15, y);
  y += 6;
  doc.text(`Conclusão do Curso: ${student.completionPercent}%`, 15, y);

  addFooter(doc);
  return doc.output("blob");
}

export function generateHistorico(): Blob {
  const doc = new jsPDF();
  addHeader(doc, "Histórico de Aulas");
  let y = addStudentInfo(doc, 65);

  const aulas = [
    { data: "11/03/2024", disciplina: "Estrutura de Dados", tema: "Introdução a Listas", presenca: "Presente" },
    { data: "12/03/2024", disciplina: "Banco de Dados", tema: "Modelagem ER", presenca: "Presente" },
    { data: "13/03/2024", disciplina: "Engenharia de Software", tema: "Metodologias Ágeis", presenca: "Ausente" },
    { data: "14/03/2024", disciplina: "Redes de Computadores", tema: "Modelo OSI", presenca: "Presente" },
    { data: "18/03/2024", disciplina: "Estrutura de Dados", tema: "Pilhas e Filas", presenca: "Presente" },
    { data: "19/03/2024", disciplina: "Banco de Dados", tema: "SQL Básico", presenca: "Presente" },
    { data: "20/03/2024", disciplina: "Engenharia de Software", tema: "UML - Diagramas", presenca: "Presente" },
    { data: "21/03/2024", disciplina: "Redes de Computadores", tema: "TCP/IP", presenca: "Presente" },
    { data: "25/03/2024", disciplina: "Estrutura de Dados", tema: "Árvores Binárias", presenca: "Presente" },
    { data: "26/03/2024", disciplina: "Banco de Dados", tema: "Normalização", presenca: "Presente" },
    { data: "27/03/2024", disciplina: "Engenharia de Software", tema: "Testes de Software", presenca: "Ausente" },
    { data: "28/03/2024", disciplina: "Redes de Computadores", tema: "Roteamento", presenca: "Presente" },
  ];

  autoTable(doc, {
    startY: y,
    head: [["Data", "Disciplina", "Tema da Aula", "Presença"]],
    body: aulas.map((a) => [a.data, a.disciplina, a.tema, a.presenca]),
    theme: "grid",
    headStyles: { fillColor: [...SENAI_BLUE] as [number, number, number], fontSize: 8, halign: "center" },
    bodyStyles: { fontSize: 8 },
    columnStyles: { 0: { halign: "center" }, 3: { halign: "center" } },
    margin: { left: 15, right: 15 },
    didParseCell: (data) => {
      if (data.section === "body" && data.column.index === 3) {
        if (data.cell.raw === "Ausente") {
          data.cell.styles.textColor = [220, 50, 50];
          data.cell.styles.fontStyle = "bold";
        } else {
          data.cell.styles.textColor = [0, 150, 50];
        }
      }
    },
  });

  y = (doc as any).lastAutoTable.finalY + 10;
  const total = aulas.length;
  const presentes = aulas.filter((a) => a.presenca === "Presente").length;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text(`Total de Aulas: ${total}`, 15, y);
  y += 6;
  doc.text(`Presenças: ${presentes} (${Math.round((presentes / total) * 100)}%)`, 15, y);
  y += 6;
  doc.text(`Faltas: ${total - presentes}`, 15, y);

  addFooter(doc);
  return doc.output("blob");
}

export function generateDeclaracao(): Blob {
  const doc = new jsPDF();
  addHeader(doc, "Declaração de Matrícula");
  let y = 70;

  doc.setFontSize(11);
  doc.setFont("helvetica", "normal");
  doc.setTextColor(0, 0, 0);

  const text = `Declaramos, para os devidos fins, que ${student.name}, portador(a) da matrícula nº ${student.matricula}, encontra-se regularmente matriculado(a) no curso de ${student.course}, cursando o ${student.semester}, no período letivo de 2024/1, na modalidade presencial, junto à Faculdade de Tecnologia SENAI.`;

  const lines = doc.splitTextToSize(text, 170);
  doc.text(lines, 20, y);
  y += lines.length * 6 + 15;

  doc.text("A presente declaração é válida por 30 (trinta) dias a partir da data de emissão.", 20, y);
  y += 25;

  const dataAtual = new Date().toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
  doc.text(`Florianópolis, ${dataAtual}.`, 105, y, { align: "center" });
  y += 30;

  doc.setDrawColor(0, 0, 0);
  doc.line(50, y, 160, y);
  y += 6;
  doc.setFontSize(10);
  doc.setFont("helvetica", "bold");
  doc.text("Coordenação Acadêmica", 105, y, { align: "center" });
  y += 5;
  doc.setFont("helvetica", "normal");
  doc.text("Faculdade de Tecnologia SENAI", 105, y, { align: "center" });

  addFooter(doc);
  return doc.output("blob");
}

export function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
