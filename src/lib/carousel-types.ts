import worship1 from "@/assets/worship-1.jpg";
import worship2 from "@/assets/worship-2.jpg";
import bible from "@/assets/bible.jpg";
import cross from "@/assets/cross.jpg";
import family1 from "@/assets/family-1.jpg";
import family2 from "@/assets/family-2.jpg";
import preacher from "@/assets/preacher.png";

export type SlideTemplate =
  | "cover"
  | "verse"
  | "photo-quote"
  | "list"
  | "split"
  | "cta"
  | "collage"
  | "bold-quote"
  | "stat"
  | "scripture-card"
  | "polaroid"
  | "magazine"
  | "frame"
  | "big-number"
  | "gradient-quote";

export interface Slide {
  id: string;
  template: SlideTemplate;
  eyebrow?: string;
  title?: string;
  body?: string;
  reference?: string;
  author?: string;
  image?: string;
  image2?: string;
  image3?: string;
  items?: string[];
  accent?: "gold" | "cream" | "blue";
  stat?: string;
  statLabel?: string;
}

export const STOCK_IMAGES = [
  { name: "Adoração 1", src: worship1 },
  { name: "Mãos levantadas", src: worship2 },
  { name: "Bíblia", src: bible },
  { name: "Cruz", src: cross },
  { name: "Pai e bebê", src: family1 },
  { name: "Abraço", src: family2 },
  { name: "Pregador (recorte)", src: preacher },
];

export const PREACHER_IMG = preacher;

export type SlideFormat = "portrait" | "square" | "story";

export const FORMAT_DIMS: Record<SlideFormat, { w: number; h: number; label: string }> = {
  portrait: { w: 1080, h: 1350, label: "Vertical · 1080×1350" },
  square: { w: 1080, h: 1080, label: "Quadrado · 1080×1080" },
  story: { w: 1080, h: 1920, label: "Stories · 1080×1920" },
};

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