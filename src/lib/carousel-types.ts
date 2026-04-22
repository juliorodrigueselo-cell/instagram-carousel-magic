import worship1 from "@/assets/worship-1.jpg";
import worship2 from "@/assets/worship-2.jpg";
import bible from "@/assets/bible.jpg";
import cross from "@/assets/cross.jpg";

export type SlideTemplate =
  | "cover"
  | "verse"
  | "photo-quote"
  | "list"
  | "split"
  | "cta";

export interface Slide {
  id: string;
  template: SlideTemplate;
  eyebrow?: string;
  title?: string;
  body?: string;
  reference?: string;
  author?: string;
  image?: string;
  items?: string[];
  accent?: "gold" | "cream" | "blue";
}

export const STOCK_IMAGES = [
  { name: "Adoração 1", src: worship1 },
  { name: "Mãos levantadas", src: worship2 },
  { name: "Bíblia", src: bible },
  { name: "Cruz", src: cross },
];

export const DEFAULT_SLIDES: Slide[] = [
  {
    id: "s1",
    template: "cover",
    eyebrow: "Devocional",
    title: "Você só encontrará descanso em Jesus Cristo",
    author: "Pr. Carlos Damasceno",
    image: worship1,
  },
  {
    id: "s2",
    template: "verse",
    eyebrow: "Mateus 11:28",
    title: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.",
    reference: "— Jesus Cristo",
    accent: "gold",
  },
  {
    id: "s3",
    template: "photo-quote",
    eyebrow: "Reflexão",
    title: "Jesus é a única chave para a intimidade com Deus.",
    body: "Não existe atalho. Não existe outro caminho. Só Ele rompe o véu.",
    image: worship2,
  },
  {
    id: "s4",
    template: "list",
    eyebrow: "3 verdades",
    title: "O que muda quando descansamos em Cristo",
    items: [
      "A ansiedade perde o trono do coração.",
      "A pressa cede lugar à direção.",
      "A alma reaprende a confiar.",
    ],
  },
  {
    id: "s5",
    template: "split",
    eyebrow: "Salmos 23:1",
    title: "O Senhor é o meu pastor; nada me faltará.",
    body: "Quando Ele guia, o vale deixa de ser um lugar de medo e se torna um lugar de fé.",
    image: bible,
  },
  {
    id: "s6",
    template: "cta",
    eyebrow: "Compartilhe",
    title: "Marque alguém que precisa ouvir isso hoje.",
    body: "Salve este post para revisitar nos dias difíceis.",
    image: cross,
  },
];