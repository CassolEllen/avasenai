export const student = {
  name: "Ellen Cristina Cassol",
  firstName: "Ellen",
  matricula: "2024SI0042",
  course: "Análise e Desenvolvimento de Sistemas",
  semester: "4º Semestre",
  avatar: "",
  xp: 1240,
  xpNext: 1500,
  level: 4,
  levelTitle: "Destaque",
  ira: 7.8,
  completionPercent: 62,
};

export const quickStats = [
  { label: "Cursos Ativos", value: "2", icon: "BookOpen" as const },
  { label: "Atividades Pendentes", value: "3", icon: "ClipboardList" as const },
  { label: "Média Geral", value: "8.4", icon: "TrendingUp" as const },
];

export interface Subject {
  id: string;
  name: string;
  professor: string;
  progress: number;
  status: "green" | "yellow" | "red";
  grades: { name: string; grade: number; weight: number }[];
  files: { name: string; type: string; date: string }[];
  ementa: string;
  cargaHoraria: string;
}

export const subjects: Subject[] = [
  {
    id: "ed",
    name: "Estrutura de Dados",
    professor: "Carlos Souza",
    progress: 78,
    status: "green",
    grades: [
      { name: "Prova 1", grade: 7.5, weight: 30 },
      { name: "Trabalho", grade: 8.0, weight: 30 },
      { name: "Prova 2", grade: 8.2, weight: 40 },
    ],
    files: [
      { name: "Aula 01 - Introdução.pdf", type: "pdf", date: "12/03/2024" },
      { name: "Aula 02 - Listas.pdf", type: "pdf", date: "19/03/2024" },
      { name: "Exercícios - Pilhas.pdf", type: "pdf", date: "26/03/2024" },
    ],
    ementa: "Listas, pilhas, filas, árvores, grafos, algoritmos de ordenação e busca.",
    cargaHoraria: "80h",
  },
  {
    id: "bd",
    name: "Banco de Dados",
    professor: "Ana Lima",
    progress: 92,
    status: "green",
    grades: [
      { name: "Prova 1", grade: 9.0, weight: 30 },
      { name: "Trabalho", grade: 9.5, weight: 30 },
      { name: "Prova 2", grade: 9.2, weight: 40 },
    ],
    files: [
      { name: "Modelagem ER.pdf", type: "pdf", date: "10/03/2024" },
      { name: "SQL Avançado.pptx", type: "pptx", date: "17/03/2024" },
    ],
    ementa: "Modelagem de dados, SQL, normalização, transações, NoSQL.",
    cargaHoraria: "60h",
  },
  {
    id: "es",
    name: "Engenharia de Software",
    professor: "Roberto Dias",
    progress: 45,
    status: "red",
    grades: [
      { name: "Prova 1", grade: 5.0, weight: 30 },
      { name: "Trabalho", grade: 6.0, weight: 30 },
    ],
    files: [
      { name: "Metodologias Ágeis.pdf", type: "pdf", date: "14/03/2024" },
    ],
    ementa: "Processos de software, UML, testes, metodologias ágeis, DevOps.",
    cargaHoraria: "80h",
  },
  {
    id: "rc",
    name: "Redes de Computadores",
    professor: "Fernanda Costa",
    progress: 61,
    status: "yellow",
    grades: [
      { name: "Prova 1", grade: 6.5, weight: 30 },
      { name: "Trabalho", grade: 7.0, weight: 30 },
    ],
    files: [
      { name: "Modelo OSI.pdf", type: "pdf", date: "11/03/2024" },
      { name: "Protocolos TCP-IP.pdf", type: "pdf", date: "18/03/2024" },
    ],
    ementa: "Modelo OSI, TCP/IP, roteamento, segurança de redes, wireless.",
    cargaHoraria: "60h",
  },
];

export const profSubject: Subject = {
  id: "ux",
  name: "UX Design Avançado",
  professor: "Mariana Alves",
  progress: 60,
  status: "yellow",
  grades: [
    { name: "Projeto 1", grade: 8.5, weight: 50 },
  ],
  files: [
    { name: "Design Thinking.pdf", type: "pdf", date: "15/03/2024" },
  ],
  ementa: "Pesquisa com usuários, prototipagem, testes de usabilidade, design systems.",
  cargaHoraria: "40h",
};

export interface ClassItem {
  id: string;
  subject: string;
  professor: string;
  day: string;
  time: string;
  type: "presencial" | "online";
  location: string;
  status: "agendada" | "em_andamento" | "concluida";
  topic: string;
  materials: string[];
}

export const classes: ClassItem[] = [
  {
    id: "c1",
    subject: "Estrutura de Dados",
    professor: "Carlos Souza",
    day: "Segunda",
    time: "08:00 - 09:40",
    type: "presencial",
    location: "Sala 204 – Bloco B",
    status: "agendada",
    topic: "Árvores Binárias de Busca",
    materials: ["Slides Aula 08.pdf", "Exercícios Árvores.pdf"],
  },
  {
    id: "c2",
    subject: "Banco de Dados",
    professor: "Ana Lima",
    day: "Segunda",
    time: "10:00 - 11:40",
    type: "online",
    location: "Google Meet",
    status: "agendada",
    topic: "Transações e Controle de Concorrência",
    materials: ["Aula 10 - Transações.pdf"],
  },
  {
    id: "c3",
    subject: "Engenharia de Software",
    professor: "Roberto Dias",
    day: "Terça",
    time: "08:00 - 09:40",
    type: "presencial",
    location: "Sala 105 – Bloco A",
    status: "em_andamento",
    topic: "Testes Automatizados",
    materials: ["Slides Testes.pdf", "Código Exemplo.zip"],
  },
  {
    id: "c4",
    subject: "Redes de Computadores",
    professor: "Fernanda Costa",
    day: "Quarta",
    time: "14:00 - 15:40",
    type: "online",
    location: "Google Meet",
    status: "agendada",
    topic: "Segurança de Redes",
    materials: ["Aula Segurança.pdf"],
  },
  {
    id: "c5",
    subject: "Estrutura de Dados",
    professor: "Carlos Souza",
    day: "Quinta",
    time: "08:00 - 09:40",
    type: "presencial",
    location: "Sala 204 – Bloco B",
    status: "concluida",
    topic: "Revisão - Listas e Pilhas",
    materials: ["Revisão.pdf"],
  },
];

export interface Message {
  id: string;
  professor: string;
  subject: string;
  preview: string;
  body: string;
  timestamp: string;
  unread: boolean;
  type: "inicio" | "encerramento" | "aviso";
}

export const messages: Message[] = [
  {
    id: "m1",
    professor: "Ana Lima",
    subject: "Banco de Dados",
    preview: "Olá turma! Informo que a prova 2 foi reagendada para...",
    body: "Olá turma!\n\nInformo que a Prova 2 foi reagendada para o dia 28/03 devido ao feriado da próxima semana. O conteúdo permanece o mesmo: Normalização, Transações e SQL Avançado.\n\nQualquer dúvida, estou à disposição.\n\nAtt,\nProf. Ana Lima",
    timestamp: "Há 2h",
    unread: true,
    type: "aviso",
  },
  {
    id: "m2",
    professor: "Roberto Dias",
    subject: "Engenharia de Software",
    preview: "A entrega do trabalho de Metodologias Ágeis foi prorrogada...",
    body: "Prezados alunos,\n\nA entrega do trabalho sobre Metodologias Ágeis foi prorrogada até 01/04. Lembrem-se de seguir o template disponibilizado na plataforma.\n\nBons estudos!\nProf. Roberto Dias",
    timestamp: "Há 5h",
    unread: true,
    type: "aviso",
  },
  {
    id: "m3",
    professor: "Carlos Souza",
    subject: "Estrutura de Dados",
    preview: "Bem-vindos à disciplina de Estrutura de Dados! Neste semestre...",
    body: "Bem-vindos à disciplina de Estrutura de Dados!\n\nNeste semestre vamos abordar as principais estruturas e algoritmos fundamentais para a formação de um bom programador.\n\nO material estará sempre disponível na plataforma.\n\nVamos juntos!\nProf. Carlos Souza",
    timestamp: "15/02",
    unread: false,
    type: "inicio",
  },
  {
    id: "m4",
    professor: "Fernanda Costa",
    subject: "Redes de Computadores",
    preview: "Informo que a disciplina de Redes I foi encerrada...",
    body: "Informo que a disciplina de Redes de Computadores I foi oficialmente encerrada. As notas finais já estão disponíveis no sistema.\n\nParabéns a todos!\nProf. Fernanda Costa",
    timestamp: "10/02",
    unread: false,
    type: "encerramento",
  },
];

export interface Notification {
  id: string;
  type: "grade" | "message" | "class" | "event";
  title: string;
  subtitle: string;
  timeAgo: string;
  read: boolean;
  group: "hoje" | "semana" | "anteriores";
}

export const notifications: Notification[] = [
  { id: "n1", type: "grade", title: "Nova nota disponível", subtitle: "Prova 1 – Banco de Dados: 9.0", timeAgo: "Há 30min", read: false, group: "hoje" },
  { id: "n2", type: "message", title: "Mensagem de Ana Lima", subtitle: "Prova 2 reagendada", timeAgo: "Há 2h", read: false, group: "hoje" },
  { id: "n3", type: "class", title: "Aula em 1 hora", subtitle: "Engenharia de Software – Sala 105", timeAgo: "Há 3h", read: false, group: "hoje" },
  { id: "n4", type: "event", title: "Prazo de entrega amanhã", subtitle: "Trabalho de Metodologias Ágeis", timeAgo: "Ontem", read: true, group: "semana" },
  { id: "n5", type: "grade", title: "Nova nota disponível", subtitle: "Trabalho – Estrutura de Dados: 8.0", timeAgo: "3 dias atrás", read: true, group: "semana" },
  { id: "n6", type: "class", title: "Aula cancelada", subtitle: "Redes de Computadores – 20/03", timeAgo: "1 semana", read: true, group: "anteriores" },
];

export const calendarEvents = [
  { date: "2024-03-25", title: "Estrutura de Dados", type: "presencial" as const, time: "08:00" },
  { date: "2024-03-25", title: "Banco de Dados", type: "online" as const, time: "10:00" },
  { date: "2024-03-26", title: "Engenharia de Software", type: "presencial" as const, time: "08:00" },
  { date: "2024-03-27", title: "Redes de Computadores", type: "online" as const, time: "14:00" },
  { date: "2024-03-28", title: "Prova 2 – Banco de Dados", type: "prova" as const, time: "10:00" },
  { date: "2024-03-29", title: "Entrega Trabalho Eng. Software", type: "trabalho" as const, time: "23:59" },
];

export interface Badge {
  name: string;
  icon: string;
  earned: boolean;
  description: string;
  tooltip: string;
  dateEarned?: string;
  requirement?: string;
  progressCurrent?: number;
  progressTotal?: number;
}

export const badges: Badge[] = [
  { name: "Primeira Entrega", icon: "🎯", earned: true, description: "Enviou o primeiro trabalho", tooltip: "Faça a entrega do seu primeiro trabalho", dateEarned: "18/03/2024" },
  { name: "Sem Faltas", icon: "✅", earned: true, description: "Frequência 100% em uma matéria", tooltip: "Não falte nenhum dia no semestre", dateEarned: "22/02/2024" },
  { name: "Nota 10", icon: "🏆", earned: true, description: "Tirou nota máxima em uma avaliação", tooltip: "Tire nota máxima em qualquer avaliação", dateEarned: "10/03/2024" },
  { name: "Maratonista", icon: "🏃", earned: true, description: "Acessou o app 7 dias seguidos", tooltip: "Acesse o app por 7 dias consecutivos", dateEarned: "15/03/2024" },
  { name: "Mentor", icon: "🧑‍🏫", earned: false, description: "Respondeu 5 dúvidas no fórum", tooltip: "Ajude seus colegas respondendo dúvidas no fórum", requirement: "Responda dúvidas no fórum", progressCurrent: 3, progressTotal: 5 },
  { name: "Explorador", icon: "👾", earned: false, description: "Acessou todas as abas do app", tooltip: "Explore todas as seções disponíveis no app", requirement: "Visite todas as seções", progressCurrent: 4, progressTotal: 5 },
  { name: "Entrega Antecipada", icon: "⚡", earned: false, description: "Enviou um trabalho antes do prazo", tooltip: "Envie um trabalho antes da data limite", requirement: "Envie um trabalho antes da data limite" },
  { name: "Em Chamas", icon: "🔥", earned: false, description: "3 notas acima de 9 consecutivas", tooltip: "Mantenha 3 notas acima de 9 seguidas", requirement: "Continue tirando notas altas", progressCurrent: 1, progressTotal: 3 },
  { name: "Matéria Concluída", icon: "🎓", earned: false, description: "Finalizou uma matéria completa", tooltip: "Complete 100% de uma disciplina", requirement: "Conclua todas as atividades de uma disciplina", progressCurrent: 78, progressTotal: 100 },
  { name: "Elite", icon: "💎", earned: false, description: "Atingiu o Nível 6", tooltip: "Chegue ao Nível 6 acumulando XP", requirement: "Acumule XP para subir de nível", progressCurrent: 4, progressTotal: 6 },
];

export const submittedFiles = [
  { subject: "Estrutura de Dados", name: "Trabalho Listas.pdf", date: "20/03/2024", status: "entregue" as const },
  { subject: "Banco de Dados", name: "Projeto ER.pdf", date: "18/03/2024", status: "entregue" as const },
  { subject: "Engenharia de Software", name: "Metodologias Ágeis.docx", date: "25/03/2024", status: "pendente" as const },
  { subject: "Redes de Computadores", name: "Relatório Segurança.pdf", date: "15/03/2024", status: "atrasado" as const },
];
