import { Slide, STOCK_IMAGES } from "@/lib/carousel-types";

const [worship1, worship2, bible, cross, family1, family2, preacher] = STOCK_IMAGES.map(
  (i) => i.src,
);

export interface PresetCarousel {
  id: string;
  name: string;
  description: string;
  slides: Omit<Slide, "id">[];
}

export const PRESET_CAROUSELS: PresetCarousel[] = [
  {
    id: "descanso",
    name: "Descanso em Cristo",
    description: "Sobre encontrar paz em Jesus em meio à ansiedade.",
    slides: [
      { template: "cover", eyebrow: "Devocional", title: "Você só encontrará descanso em Jesus Cristo", author: "Pr. Carlos Damasceno", image: worship1 },
      { template: "verse", eyebrow: "Mateus 11:28", title: "Vinde a mim, todos os que estais cansados e sobrecarregados, e eu vos aliviarei.", reference: "— Jesus Cristo" },
      { template: "photo-quote", eyebrow: "Reflexão", title: "Jesus é a única chave para a intimidade com Deus.", body: "Não existe atalho. Não existe outro caminho.", image: worship2 },
      { template: "list", eyebrow: "3 verdades", title: "O que muda quando descansamos em Cristo", items: ["A ansiedade perde o trono do coração.", "A pressa cede lugar à direção.", "A alma reaprende a confiar."] },
      { template: "split", eyebrow: "Salmos 23:1", title: "O Senhor é o meu pastor; nada me faltará.", body: "Quando Ele guia, o vale deixa de ser medo.", image: bible },
      { template: "cta", eyebrow: "Compartilhe", title: "Marque alguém que precisa ouvir isso hoje.", body: "Salve para revisitar nos dias difíceis.", image: cross },
    ],
  },
  {
    id: "oracao",
    name: "O poder da oração",
    description: "Por que e como orar todos os dias.",
    slides: [
      { template: "cover", eyebrow: "Vida Cristã", title: "A oração move o coração de Deus", author: "Pr. André Lima", image: worship2 },
      { template: "verse", eyebrow: "1 Tessalonicenses 5:17", title: "Orai sem cessar.", reference: "— Apóstolo Paulo" },
      { template: "photo-quote", eyebrow: "Reflexão", title: "Orar é respirar a presença de Deus.", body: "Não é técnica. É intimidade construída no silêncio.", image: bible },
      { template: "list", eyebrow: "4 passos", title: "Como começar a orar hoje", items: ["Reserve 10 minutos no início do dia.", "Abra a Bíblia antes de falar.", "Adore, agradeça, confesse, peça.", "Termine ouvindo em silêncio."] },
      { template: "split", eyebrow: "Filipenses 4:6", title: "Não andeis ansiosos por coisa alguma.", body: "Em tudo, com oração, apresente seu coração a Deus.", image: cross },
      { template: "cta", eyebrow: "Compartilhe", title: "Quem você vai colocar em oração hoje?", body: "Marque essa pessoa nos comentários.", image: worship1 },
    ],
  },
  {
    id: "ansiedade",
    name: "Vencendo a ansiedade",
    description: "A Palavra para os dias de aperto no peito.",
    slides: [
      { template: "cover", eyebrow: "Saúde da Alma", title: "Quando o medo bate, a fé responde", author: "Pra. Mariana Souza", image: cross },
      { template: "verse", eyebrow: "Isaías 41:10", title: "Não temas, porque eu sou contigo; não te assombres, porque eu sou o teu Deus.", reference: "— Isaías" },
      { template: "photo-quote", eyebrow: "Verdade", title: "A ansiedade mente. A Palavra de Deus revela.", body: "Troque o ruído da mente pela voz das Escrituras.", image: worship2 },
      { template: "list", eyebrow: "3 hábitos", title: "Para acalmar o coração ansioso", items: ["Memorize 1 versículo por semana.", "Ore antes de pegar o celular.", "Conte a Deus o que você sente."] },
      { template: "split", eyebrow: "Salmos 46:10", title: "Aquietai-vos e sabei que eu sou Deus.", body: "Pare. Respire. Lembre quem está no controle.", image: bible },
      { template: "cta", eyebrow: "Salve", title: "Volte aqui no próximo dia difícil.", body: "Compartilhe com quem precisa ouvir.", image: worship1 },
    ],
  },
  {
    id: "gratidao",
    name: "Coração grato",
    description: "A gratidão como estilo de vida cristã.",
    slides: [
      { template: "cover", eyebrow: "Devocional", title: "Gratidão é a língua do céu", author: "Pr. Tiago Ferreira", image: worship1 },
      { template: "verse", eyebrow: "1 Tessalonicenses 5:18", title: "Em tudo dai graças, porque esta é a vontade de Deus em Cristo Jesus para convosco.", reference: "— Apóstolo Paulo" },
      { template: "photo-quote", eyebrow: "Reflexão", title: "Quem agradece enxerga o que reclamava antes.", body: "A gratidão reescreve a forma como vemos o dia.", image: bible },
      { template: "list", eyebrow: "Pratique", title: "3 jeitos de cultivar gratidão", items: ["Anote 3 bênçãos antes de dormir.", "Agradeça em voz alta nas refeições.", "Diga obrigado a alguém todo dia."] },
      { template: "split", eyebrow: "Salmos 100:4", title: "Entrai pelas portas dele com louvor; e gratidão, nos seus átrios.", body: "A adoração começa quando o agradecer vira hábito.", image: cross },
      { template: "cta", eyebrow: "Compartilhe", title: "Pelo que você é grato hoje?", body: "Conte nos comentários e inspire alguém.", image: worship2 },
    ],
  },
  {
    id: "culto-familia",
    name: "Culto da Família",
    description: "Convite visual estilo colagem para evento da igreja.",
    slides: [
      {
        template: "collage",
        eyebrow: "AD CONCÓRDIA",
        title: "Culto da Família",
        body: "Domingo · 19h · Auditório principal",
        image: family1,
        image2: family2,
        image3: preacher,
      },
      { template: "verse", eyebrow: "Josué 24:15", title: "Eu e a minha casa serviremos ao Senhor.", reference: "— Josué" },
      { template: "photo-quote", eyebrow: "Reflexão", title: "Família que ora junta, permanece junta.", body: "Cada lar é um altar onde Deus quer habitar.", image: family1 },
      { template: "list", eyebrow: "Você vai viver", title: "O que esperar do culto", items: ["Louvor para todas as idades.", "Palavra prática para o lar.", "Oração pelos casais e filhos."] },
      { template: "cta", eyebrow: "Traga sua família", title: "Te esperamos no domingo.", body: "Marque alguém que você quer levar com você.", image: family2 },
    ],
  },
];