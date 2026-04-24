import { useRef, useState } from "react";
import { toPng } from "html-to-image";
import JSZip from "jszip";
import {
  DEFAULT_SLIDES,
  Slide,
  SlideTemplate,
  STOCK_IMAGES,
} from "@/lib/carousel-types";
import { SlideCanvas } from "./SlideCanvas";
import { SLIDE_H, SLIDE_W } from "./SlideRenderer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Plus,
  Trash2,
  Copy,
  Download,
  Image as ImageIcon,
  ArrowUp,
  ArrowDown,
  Instagram,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { GenerateDialog } from "./GenerateDialog";
import { removeBackground, warmupBackgroundRemoval } from "@/lib/remove-bg";
import { Switch } from "@/components/ui/switch";
import { useEffect } from "react";

const TEMPLATE_LABELS: Record<SlideTemplate, string> = {
  cover: "Capa",
  verse: "Versículo",
  "photo-quote": "Foto + Citação",
  list: "Lista",
  split: "Foto / Texto",
  cta: "Chamada final",
  collage: "Colagem (2 fotos)",
  "bold-quote": "Citação tipográfica",
  stat: "Número em destaque",
  "scripture-card": "Cartão de versículo",
  polaroid: "Polaroid",
};

const newSlide = (template: SlideTemplate): Slide => {
  const base = { id: crypto.randomUUID(), template } as Slide;
  switch (template) {
    case "cover":
      return { ...base, eyebrow: "Devocional", title: "Novo título inspirador", author: "Autor", image: STOCK_IMAGES[0].src };
    case "verse":
      return { ...base, eyebrow: "João 3:16", title: "Texto do versículo aqui.", reference: "— Bíblia Sagrada" };
    case "photo-quote":
      return { ...base, eyebrow: "Reflexão", title: "Sua citação aqui.", body: "Subtítulo opcional.", image: STOCK_IMAGES[1].src };
    case "list":
      return { ...base, eyebrow: "3 verdades", title: "Título da lista", items: ["Primeiro ponto", "Segundo ponto", "Terceiro ponto"] };
    case "split":
      return { ...base, eyebrow: "Capítulo", title: "Título lateral", body: "Texto de apoio.", image: STOCK_IMAGES[2].src };
    case "cta":
      return { ...base, eyebrow: "Compartilhe", title: "Marque alguém que precisa ver.", body: "Salve este post.", image: STOCK_IMAGES[3].src };
    case "collage":
      return {
        ...base,
        eyebrow: "Sua igreja",
        title: "Culto da Família",
        body: "Domingo · 19h · Auditório principal",
        image: STOCK_IMAGES[4].src,
        image2: STOCK_IMAGES[5].src,
        image3: STOCK_IMAGES[6].src,
      };
    case "bold-quote":
      return { ...base, eyebrow: "Reflexão", title: "A fé não remove a tempestade — ela te leva pra dentro do barco com Cristo.", reference: "— Pr. Carlos" };
    case "stat":
      return { ...base, eyebrow: "Você sabia?", stat: "73%", statLabel: "dos cristãos não leem a Bíblia diariamente.", body: "E se hoje fosse o primeiro dia de uma nova história?" };
    case "scripture-card":
      return { ...base, eyebrow: "Versículo do dia", title: "Tudo posso naquele que me fortalece.", reference: "Filipenses 4:13", body: "Salve este card pra lembrar nos dias difíceis." };
    case "polaroid":
      return { ...base, eyebrow: "Memória", title: "Deus está nos detalhes.", body: "Uma foto, um momento, uma gratidão.", image: STOCK_IMAGES[1].src };
  }
};

export function Editor() {
  const [slides, setSlides] = useState<Slide[]>(DEFAULT_SLIDES);
  const [activeId, setActiveId] = useState(DEFAULT_SLIDES[0].id);
  const [exporting, setExporting] = useState(false);
  const [genOpen, setGenOpen] = useState(false);
  const exportRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  useEffect(() => {
    // Pre-load the segmentation model so the first upload feels fast.
    warmupBackgroundRemoval();
  }, []);

  const active = slides.find((s) => s.id === activeId) ?? slides[0];
  const activeIndex = slides.findIndex((s) => s.id === activeId);

  const update = (patch: Partial<Slide>) => {
    setSlides((prev) => prev.map((s) => (s.id === activeId ? { ...s, ...patch } : s)));
  };

  const addSlide = (template: SlideTemplate) => {
    const s = newSlide(template);
    setSlides((prev) => [...prev, s]);
    setActiveId(s.id);
  };

  const removeSlide = (id: string) => {
    if (slides.length === 1) return;
    const idx = slides.findIndex((s) => s.id === id);
    const next = slides.filter((s) => s.id !== id);
    setSlides(next);
    if (id === activeId) setActiveId(next[Math.max(0, idx - 1)].id);
  };

  const duplicate = (id: string) => {
    const s = slides.find((x) => x.id === id);
    if (!s) return;
    const copy = { ...s, id: crypto.randomUUID() };
    const idx = slides.findIndex((x) => x.id === id);
    const next = [...slides];
    next.splice(idx + 1, 0, copy);
    setSlides(next);
    setActiveId(copy.id);
  };

  const move = (id: string, dir: -1 | 1) => {
    const idx = slides.findIndex((s) => s.id === id);
    const target = idx + dir;
    if (target < 0 || target >= slides.length) return;
    const next = [...slides];
    [next[idx], next[target]] = [next[target], next[idx]];
    setSlides(next);
  };

  const exportAll = async () => {
    setExporting(true);
    try {
      // Wait one tick so off-screen export nodes mount
      await new Promise((r) => setTimeout(r, 50));
      const zip = new JSZip();
      for (let i = 0; i < slides.length; i++) {
        const node = exportRefs.current.get(slides[i].id);
        if (!node) continue;
        const dataUrl = await toPng(node, {
          width: SLIDE_W,
          height: SLIDE_H,
          pixelRatio: 1,
          cacheBust: true,
          backgroundColor: "#0b1530",
        });
        const base64 = dataUrl.split(",")[1];
        zip.file(`carrossel-${String(i + 1).padStart(2, "0")}.png`, base64, { base64: true });
      }
      const blob = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "carrossel-instagram.zip";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("Carrossel exportado!", {
        description: `${slides.length} imagens prontas para postar.`,
      });
    } catch (e) {
      console.error(e);
      toast.error("Erro ao exportar. Tente novamente.");
    } finally {
      setExporting(false);
    }
  };

  return (
    <div className="flex h-screen flex-col bg-background text-foreground">
      {/* Toolbar */}
      <header className="flex items-center justify-between border-b border-border bg-card px-6 py-3">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <Instagram className="h-5 w-5" />
          </div>
          <div>
            <h1 className="font-serif-display text-lg leading-none italic">Carrossel Fé</h1>
            <p className="text-xs text-muted-foreground">Editor de carrosséis para Instagram · 1080×1350</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={() => setGenOpen(true)}
            className="border-brand-gold text-brand-blue hover:bg-brand-gold/10"
          >
            <Sparkles className="mr-2 h-4 w-4 text-brand-gold" />
            Gerar carrossel
          </Button>
          <Select onValueChange={(v) => addSlide(v as SlideTemplate)}>
            <SelectTrigger className="w-[200px]">
              <Plus className="mr-2 h-4 w-4" />
              <SelectValue placeholder="Adicionar slide" />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(TEMPLATE_LABELS) as SlideTemplate[]).map((t) => (
                <SelectItem key={t} value={t}>
                  {TEMPLATE_LABELS[t]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={exportAll} disabled={exporting} className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Download className="mr-2 h-4 w-4" />
            {exporting ? "Exportando…" : "Exportar PNG (.zip)"}
          </Button>
        </div>
      </header>

      <div className="grid flex-1 grid-cols-[260px_1fr_340px] overflow-hidden">
        {/* Sidebar - thumbnails */}
        <aside className="overflow-y-auto border-r border-border bg-card p-4">
          <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Slides ({slides.length})
          </p>
          <div className="space-y-3">
            {slides.map((s, i) => (
              <div key={s.id} className="group relative">
                <button
                  onClick={() => setActiveId(s.id)}
                  className={`block w-full overflow-hidden rounded-md border-2 transition ${
                    s.id === activeId ? "border-primary shadow-md" : "border-transparent hover:border-muted"
                  }`}
                >
                  <SlideCanvas slide={s} index={i} total={slides.length} className="bg-muted" />
                </button>
                <div className="mt-1 flex items-center justify-between text-xs text-muted-foreground">
                  <span>{String(i + 1).padStart(2, "0")} · {TEMPLATE_LABELS[s.template]}</span>
                  <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition">
                    <button onClick={() => move(s.id, -1)} className="p-1 hover:text-foreground" title="Subir">
                      <ArrowUp className="h-3 w-3" />
                    </button>
                    <button onClick={() => move(s.id, 1)} className="p-1 hover:text-foreground" title="Descer">
                      <ArrowDown className="h-3 w-3" />
                    </button>
                    <button onClick={() => duplicate(s.id)} className="p-1 hover:text-foreground" title="Duplicar">
                      <Copy className="h-3 w-3" />
                    </button>
                    <button onClick={() => removeSlide(s.id)} className="p-1 hover:text-destructive" title="Excluir">
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </aside>

        {/* Canvas */}
        <main className="flex items-center justify-center overflow-hidden bg-muted/40 p-8">
          <div
            className="h-full max-h-full w-auto rounded-lg"
            style={{
              aspectRatio: `${SLIDE_W} / ${SLIDE_H}`,
              boxShadow: "var(--shadow-slide)",
            }}
          >
            <SlideCanvas slide={active} index={activeIndex} total={slides.length} className="rounded-lg" />
          </div>
        </main>

        {/* Inspector */}
        <aside className="overflow-y-auto border-l border-border bg-card p-5">
          <p className="mb-1 text-xs font-semibold uppercase tracking-widest text-muted-foreground">
            Slide {activeIndex + 1}
          </p>
          <h2 className="mb-5 font-serif-display text-2xl italic">{TEMPLATE_LABELS[active.template]}</h2>

          <div className="space-y-4">
            <div>
              <Label>Modelo</Label>
              <Select value={active.template} onValueChange={(v) => update({ template: v as SlideTemplate })}>
                <SelectTrigger><SelectValue /></SelectTrigger>
                <SelectContent>
                  {(Object.keys(TEMPLATE_LABELS) as SlideTemplate[]).map((t) => (
                    <SelectItem key={t} value={t}>{TEMPLATE_LABELS[t]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Eyebrow / categoria</Label>
              <Input value={active.eyebrow ?? ""} onChange={(e) => update({ eyebrow: e.target.value })} />
            </div>

            <div>
              <Label>Título</Label>
              <Textarea
                value={active.title ?? ""}
                onChange={(e) => update({ title: e.target.value })}
                rows={3}
                className="resize-none"
              />
            </div>

            {(active.template === "photo-quote" ||
              active.template === "split" ||
              active.template === "cta" ||
              active.template === "stat" ||
              active.template === "scripture-card" ||
              active.template === "polaroid") && (
              <div>
                <Label>Texto de apoio</Label>
                <Textarea
                  value={active.body ?? ""}
                  onChange={(e) => update({ body: e.target.value })}
                  rows={3}
                  className="resize-none"
                />
              </div>
            )}

            {(active.template === "verse" ||
              active.template === "bold-quote" ||
              active.template === "scripture-card") && (
              <div>
                <Label>Referência</Label>
                <Input value={active.reference ?? ""} onChange={(e) => update({ reference: e.target.value })} />
              </div>
            )}

            {active.template === "stat" && (
              <>
                <div>
                  <Label>Número / estatística</Label>
                  <Input
                    value={active.stat ?? ""}
                    onChange={(e) => update({ stat: e.target.value })}
                    placeholder="73%"
                  />
                </div>
                <div>
                  <Label>Legenda do número</Label>
                  <Textarea
                    value={active.statLabel ?? ""}
                    onChange={(e) => update({ statLabel: e.target.value })}
                    rows={2}
                    className="resize-none"
                  />
                </div>
              </>
            )}

            {active.template === "cover" && (
              <div>
                <Label>Autor</Label>
                <Input value={active.author ?? ""} onChange={(e) => update({ author: e.target.value })} />
              </div>
            )}

            {active.template === "list" && (
              <div>
                <Label>Itens (um por linha)</Label>
                <Textarea
                  value={(active.items ?? []).join("\n")}
                  onChange={(e) =>
                    update({ items: e.target.value.split("\n").filter((l) => l.length > 0) })
                  }
                  rows={6}
                  className="resize-none"
                />
              </div>
            )}

            {active.template !== "verse" &&
              active.template !== "list" &&
              active.template !== "bold-quote" &&
              active.template !== "stat" &&
              active.template !== "scripture-card" && (
              <>
                <ImageField
                  label={active.template === "collage" ? "Foto esquerda (azul)" : "Imagem de fundo"}
                  value={active.image}
                  onChange={(v) => update({ image: v })}
                  defaultRemoveBg={false}
                />
                {active.template === "collage" && (
                  <>
                    <ImageField
                      label="Foto direita (laranja)"
                      value={active.image2}
                      onChange={(v) => update({ image2: v })}
                      defaultRemoveBg={false}
                    />
                    <ImageField
                      label="Recorte em destaque (opcional)"
                      value={active.image3}
                      onChange={(v) => update({ image3: v })}
                      hint="Use uma foto com fundo branco/transparente para o efeito de recorte."
                      defaultRemoveBg={true}
                    />
                  </>
                )}
              </>
            )}
          </div>

          <div className="mt-8 rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
            <p className="font-semibold text-foreground mb-1">Dica</p>
            Cada slide é exportado em 1080×1350 px — formato vertical do feed do Instagram. O carrossel inteiro vira um arquivo .zip pronto para postar.
          </div>
        </aside>
      </div>

      {/* Off-screen export nodes — rendered at full 1080x1350 only while exporting */}
      {exporting && (
        <div
          aria-hidden
          style={{
            position: "fixed",
            left: -99999,
            top: 0,
            pointerEvents: "none",
          }}
        >
          {slides.map((s, i) => (
            <SlideCanvas
              key={s.id}
              slide={s}
              index={i}
              total={slides.length}
              exportMode
              innerRef={(el) => {
                if (el) exportRefs.current.set(s.id, el);
                else exportRefs.current.delete(s.id);
              }}
            />
          ))}
        </div>
      )}

      <GenerateDialog
        open={genOpen}
        onOpenChange={setGenOpen}
        onApply={(newSlides) => {
          setSlides(newSlides);
          setActiveId(newSlides[0].id);
        }}
      />
    </div>
  );
}

function ImageField({
  label,
  value,
  onChange,
  hint,
  defaultRemoveBg = true,
}: {
  label: string;
  value?: string;
  onChange: (v: string) => void;
  hint?: string;
  defaultRemoveBg?: boolean;
}) {
  const [autoRemove, setAutoRemove] = useState(defaultRemoveBg);
  const [processing, setProcessing] = useState(false);

  const handleFile = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async () => {
      const dataUrl = reader.result as string;
      if (!autoRemove) {
        onChange(dataUrl);
        return;
      }
      setProcessing(true);
      const t = toast.loading("Removendo fundo da imagem…");
      try {
        const cutout = await removeBackground(dataUrl);
        onChange(cutout);
        toast.success("Fundo removido!", { id: t });
      } catch (err) {
        console.error(err);
        toast.error("Não consegui remover o fundo. Usando a imagem original.", { id: t });
        onChange(dataUrl);
      } finally {
        setProcessing(false);
      }
    };
    reader.readAsDataURL(file);
  };

  return (
    <div>
      <Label className="flex items-center gap-2">
        <ImageIcon className="h-4 w-4" /> {label}
      </Label>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {STOCK_IMAGES.map((img) => (
          <button
            key={img.src}
            onClick={() => onChange(img.src)}
            className={`overflow-hidden rounded border-2 transition ${
              value === img.src ? "border-primary" : "border-transparent hover:border-muted"
            }`}
          >
            <img src={img.src} alt={img.name} className="h-16 w-full object-cover" />
          </button>
        ))}
      </div>
      <div className="mt-3 flex items-center justify-between rounded-md bg-muted/50 px-3 py-2">
        <div>
          <p className="text-xs font-medium text-foreground">Remover fundo automaticamente</p>
          <p className="text-[11px] text-muted-foreground">Aplicado ao enviar uma foto sua</p>
        </div>
        <Switch checked={autoRemove} onCheckedChange={setAutoRemove} />
      </div>
      <label className="mt-2 block">
        <span className="block text-xs text-muted-foreground mb-1">
          {processing ? "Processando…" : "Ou envie sua imagem:"}
        </span>
        <input
          type="file"
          accept="image/*"
          disabled={processing}
          className="block w-full text-xs file:mr-2 file:rounded file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-primary-foreground disabled:opacity-50"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) void handleFile(file);
            e.target.value = "";
          }}
        />
      </label>
      {hint && <p className="mt-1 text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}