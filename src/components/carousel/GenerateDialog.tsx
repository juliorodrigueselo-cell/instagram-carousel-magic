import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slide, STOCK_IMAGES } from "@/lib/carousel-types";
import { PRESET_CAROUSELS } from "@/data/preset-carousels";
import { SlideCanvas } from "./SlideCanvas";
import { Sparkles, Loader2, BookOpenText } from "lucide-react";
import { toast } from "sonner";

interface Props {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onApply: (slides: Slide[]) => void;
}

const SUGGESTIONS = [
  "Confiar em Deus quando o futuro é incerto",
  "Como vencer o medo com a Palavra",
  "Perdoar quem te machucou",
  "A graça de Deus na sua história",
  "Vida de oração para iniciantes",
];

export function GenerateDialog({ open, onOpenChange, onApply }: Props) {
  const [topic, setTopic] = useState("");
  const [count, setCount] = useState(6);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!topic.trim()) {
      toast.error("Escreva um tema para gerar.");
      return;
    }
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("generate-carousel", {
        body: { topic, count },
      });
      if (error) throw error;
      if (!data?.slides?.length) throw new Error("Resposta vazia");

      // Map to Slide[] adding ids and default images
      const stockByTemplate: Record<string, string> = {
        cover: STOCK_IMAGES[0].src,
        "photo-quote": STOCK_IMAGES[1].src,
        split: STOCK_IMAGES[2].src,
        cta: STOCK_IMAGES[3].src,
      };
      const slides: Slide[] = data.slides.map((s: Omit<Slide, "id">) => ({
        ...s,
        id: crypto.randomUUID(),
        image: s.image ?? stockByTemplate[s.template],
      }));
      onApply(slides);
      onOpenChange(false);
      toast.success(`Carrossel de ${slides.length} slides gerado!`);
    } catch (e: unknown) {
      console.error(e);
      const ctx = e as { context?: { status?: number } };
      const msg = e instanceof Error ? e.message : "Erro ao gerar";
      if (ctx?.context?.status === 402) {
        toast.error("Créditos de IA esgotados", {
          description: "Adicione créditos em Settings → Workspace → Usage.",
        });
      } else if (ctx?.context?.status === 429) {
        toast.error("Muitas requisições", { description: "Aguarde alguns segundos." });
      } else {
        toast.error("Falha ao gerar", { description: msg });
      }
    } finally {
      setLoading(false);
    }
  };

  const usePreset = (presetId: string) => {
    const preset = PRESET_CAROUSELS.find((p) => p.id === presetId);
    if (!preset) return;
    const slides: Slide[] = preset.slides.map((s) => ({ ...s, id: crypto.randomUUID() }));
    onApply(slides);
    onOpenChange(false);
    toast.success(`Template "${preset.name}" carregado!`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="font-serif-display italic text-3xl">
            Gerar carrossel completo
          </DialogTitle>
          <DialogDescription>
            Comece com IA a partir de um tema, ou escolha um template pronto.
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ai" className="mt-2">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ai">
              <Sparkles className="mr-2 h-4 w-4" /> Gerar com IA
            </TabsTrigger>
            <TabsTrigger value="presets">
              <BookOpenText className="mr-2 h-4 w-4" /> Templates prontos
            </TabsTrigger>
          </TabsList>

          <TabsContent value="ai" className="space-y-4 pt-4">
            <div>
              <Label htmlFor="topic">Tema do carrossel</Label>
              <Input
                id="topic"
                placeholder="Ex: Descansar em Cristo na ansiedade"
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                disabled={loading}
              />
            </div>

            <div>
              <p className="text-xs text-muted-foreground mb-2">Sugestões:</p>
              <div className="flex flex-wrap gap-2">
                {SUGGESTIONS.map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setTopic(s)}
                    disabled={loading}
                    className="rounded-full border border-border bg-secondary px-3 py-1 text-xs hover:bg-accent hover:text-accent-foreground transition"
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <Label>Quantidade de slides: {count}</Label>
              <input
                type="range"
                min={5}
                max={8}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                disabled={loading}
                className="w-full accent-primary"
              />
            </div>

            <div className="rounded-md bg-muted/60 p-3 text-xs text-muted-foreground">
              A IA escreve título, versículos reais, reflexão e chamada final no tom pastoral.
              Você pode editar cada slide depois.
            </div>

            <Button onClick={generate} disabled={loading} className="w-full" size="lg">
              {loading ? (
                <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Gerando seu carrossel…</>
              ) : (
                <><Sparkles className="mr-2 h-4 w-4" /> Gerar carrossel</>
              )}
            </Button>
          </TabsContent>

          <TabsContent value="presets" className="space-y-4 pt-4">
            <div className="grid grid-cols-2 gap-4">
              {PRESET_CAROUSELS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => usePreset(preset.id)}
                  className="group text-left rounded-lg border border-border bg-card p-3 hover:border-primary hover:shadow-md transition"
                >
                  <div className="overflow-hidden rounded-md mb-3 bg-muted">
                    <SlideCanvas
                      slide={{ ...preset.slides[0], id: preset.id } as Slide}
                      index={0}
                      total={preset.slides.length}
                    />
                  </div>
                  <h4 className="font-serif-display italic text-lg leading-tight">{preset.name}</h4>
                  <p className="text-xs text-muted-foreground mt-1">{preset.description}</p>
                  <p className="text-xs text-primary mt-2 group-hover:underline">
                    {preset.slides.length} slides · usar template →
                  </p>
                </button>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}