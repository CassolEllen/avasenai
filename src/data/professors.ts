import { subjects, profSubject } from "./mockData";

export interface Professor {
  id: string;
  name: string;
  email: string;
  phone: string;
  title: string;
  bio: string;
  avatar: string;
  disciplines: string[];
}

export const professors: Professor[] = [
  {
    id: "prof-carlos",
    name: "Carlos Souza",
    email: "carlos.souza@senai.edu.br",
    phone: "(47) 99812-3456",
    title: "Professor de Computação",
    bio: "Mestre em Ciência da Computação com foco em algoritmos e estruturas de dados. 12 anos de experiência acadêmica.",
    avatar: "",
    disciplines: ["Estrutura de Dados"],
  },
  {
    id: "prof-ana",
    name: "Ana Lima",
    email: "ana.lima@senai.edu.br",
    phone: "(47) 99734-5678",
    title: "Professora de Banco de Dados",
    bio: "Doutora em Engenharia de Software, especialista em modelagem de dados e sistemas distribuídos.",
    avatar: "",
    disciplines: ["Banco de Dados"],
  },
  {
    id: "prof-roberto",
    name: "Roberto Dias",
    email: "roberto.dias@senai.edu.br",
    phone: "(47) 99656-7890",
    title: "Professor de Engenharia de Software",
    bio: "Especialista em metodologias ágeis e DevOps, com experiência em empresas de tecnologia.",
    avatar: "",
    disciplines: ["Engenharia de Software"],
  },
  {
    id: "prof-fernanda",
    name: "Fernanda Costa",
    email: "fernanda.costa@senai.edu.br",
    phone: "(47) 99578-9012",
    title: "Professora de Redes",
    bio: "Mestre em Redes de Computadores, certificada CCNA e CCNP. Atua com segurança de redes.",
    avatar: "",
    disciplines: ["Redes de Computadores"],
  },
  {
    id: "prof-mariana",
    name: "Mariana Alves",
    email: "mariana.alves@senai.edu.br",
    phone: "(47) 99490-1234",
    title: "Professora de Design",
    bio: "Designer UX/UI com 8 anos de experiência no mercado. Especialista em pesquisa com usuários.",
    avatar: "",
    disciplines: ["UX Design Avançado"],
  },
];

export function getProfessorByName(name: string): Professor | undefined {
  return professors.find(p => p.name === name);
}
