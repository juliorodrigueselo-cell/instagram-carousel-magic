import { Slide, PREACHER_IMG } from "@/lib/carousel-types";

interface Props {
  slide: Slide;
  index: number;
  total: number;
}

/**
 * Slides are always rendered at fixed 1080x1350 (Instagram portrait carousel).
 * The parent scales them via CSS transform.
 */
export const SLIDE_W = 1080;
export const SLIDE_H = 1350;

const PageNumber = ({ index, total }: { index: number; total: number }) => (
  <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-cream/70">
    {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
  </div>
);

const Eyebrow = ({ children, dark = false }: { children?: string; dark?: boolean }) => {
  if (!children) return null;
  return (
    <div
      className={`font-sans-ui text-[20px] uppercase tracking-[0.42em] ${
        dark ? "text-brand-ink/60" : "text-brand-gold"
      }`}
    >
      {children}
    </div>
  );
};

function Cover({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 bg-stage overflow-hidden">
      {slide.image && (
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-55 mix-blend-screen"
        />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/30 via-transparent to-brand-deep/90" />
      {/* Giant decorative letter */}
      <div className="absolute -left-10 top-[-60px] font-serif-display italic text-[680px] leading-none text-brand-gold/25 select-none">
        Fé
      </div>
      <div className="relative z-10 flex h-full flex-col justify-end p-16">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <h1 className="mt-6 font-serif-display italic text-brand-cream text-[96px] leading-[0.95] text-balance max-w-[900px]">
          {slide.title}
        </h1>
        {slide.author && (
          <div className="mt-10 flex items-center gap-4">
            <div className="h-px w-16 bg-brand-gold" />
            <span className="font-sans-ui text-[24px] uppercase tracking-[0.32em] text-brand-cream/80">
              {slide.author}
            </span>
          </div>
        )}
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

function Verse({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 bg-brand-cream overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,hsl(42_95%_85%/0.6),transparent_60%)]" />
      <div className="absolute right-[-80px] top-[-80px] font-serif-display text-[520px] leading-none text-brand-gold/30 select-none">
        ”
      </div>
      <div className="relative z-10 flex h-full flex-col justify-center px-20">
        <Eyebrow dark>{slide.eyebrow}</Eyebrow>
        <p className="mt-10 font-serif-display italic text-brand-ink text-[78px] leading-[1.05] text-balance max-w-[900px]">
          {slide.title}
        </p>
        {slide.reference && (
          <div className="mt-12 font-sans-ui text-[26px] tracking-[0.18em] text-brand-blue uppercase">
            {slide.reference}
          </div>
        )}
      </div>
      <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

function PhotoQuote({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep">
      {slide.image && (
        <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
      )}
      <div className="absolute inset-0 bg-gradient-to-t from-brand-deep via-brand-deep/70 to-transparent" />
      <div className="relative z-10 flex h-full flex-col justify-end p-16">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-serif-display italic text-brand-cream text-[78px] leading-[1.05] text-balance max-w-[880px]">
          {slide.title}
        </h2>
        {slide.body && (
          <p className="mt-8 font-sans-ui text-[28px] leading-[1.4] text-brand-cream/80 max-w-[760px]">
            {slide.body}
          </p>
        )}
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

function ListSlide({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 bg-brand-deep overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,hsl(210_85%_28%/0.6),transparent_60%)]" />
      <div className="relative z-10 flex h-full flex-col p-16">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-serif-display italic text-brand-cream text-[72px] leading-[1.05] text-balance max-w-[860px]">
          {slide.title}
        </h2>
        <ol className="mt-14 space-y-10 max-w-[820px]">
          {slide.items?.map((it, i) => (
            <li key={i} className="flex gap-8">
              <span className="font-serif-display italic text-brand-gold text-[68px] leading-none w-[80px]">
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans-ui text-brand-cream text-[30px] leading-[1.4] pt-3">
                {it}
              </span>
            </li>
          ))}
        </ol>
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

function Split({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 grid grid-cols-2 bg-brand-cream overflow-hidden">
      <div className="relative">
        {slide.image && (
          <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent to-brand-cream/20" />
      </div>
      <div className="flex flex-col justify-center p-14 bg-brand-cream">
        <Eyebrow dark>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-6 font-serif-display italic text-brand-ink text-[60px] leading-[1.05] text-balance">
          {slide.title}
        </h2>
        {slide.body && (
          <p className="mt-8 font-sans-ui text-[24px] leading-[1.5] text-brand-ink/75">
            {slide.body}
          </p>
        )}
        <div className="mt-12 h-px w-24 bg-brand-blue" />
      </div>
      <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

function CTA({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep">
      {slide.image && (
        <img
          src={slide.image}
          alt=""
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
      )}
      <div className="absolute inset-0 bg-brand-deep/70" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center p-20 text-center">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-8 font-serif-display italic text-brand-cream text-[88px] leading-[1] text-balance max-w-[900px]">
          {slide.title}
        </h2>
        {slide.body && (
          <p className="mt-10 font-sans-ui text-[26px] leading-[1.5] text-brand-cream/80 max-w-[720px]">
            {slide.body}
          </p>
        )}
        <div className="mt-16 inline-flex items-center gap-5">
          <div className="h-px w-16 bg-brand-gold" />
          <span className="font-sans-ui uppercase tracking-[0.4em] text-brand-gold text-[22px]">
            @sua.conta
          </span>
          <div className="h-px w-16 bg-brand-gold" />
        </div>
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

/**
 * Collage template — 2 background photos in duotone (deep blue + warm orange),
 * a torn diagonal divider, big stencil-style title overlapping, plus an optional
 * cut-out third image (e.g. a preacher) emerging from the bottom.
 * Inspired by the "Culto da Família" reference.
 */
function Collage({ slide, index, total }: Props) {
  const img1 = slide.image;
  const img2 = slide.image2;
  const cutout = slide.image3 ?? PREACHER_IMG;
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep">
      {/* Two-pane diagonal collage */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(0 0, 60% 0, 52% 100%, 0 100%)" }}
        >
          {img1 && (
            <img src={img1} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
          )}
          {/* Blue duotone overlay */}
          <div className="absolute inset-0 bg-[hsl(215_85%_18%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[hsl(205_90%_45%)] mix-blend-screen opacity-60" />
        </div>
        <div
          className="absolute inset-0"
          style={{ clipPath: "polygon(60% 0, 100% 0, 100% 100%, 52% 100%)" }}
        >
          {img2 && (
            <img src={img2} alt="" className="absolute inset-0 h-full w-full object-cover grayscale" />
          )}
          {/* Orange duotone overlay */}
          <div className="absolute inset-0 bg-[hsl(20_80%_30%)] mix-blend-multiply" />
          <div className="absolute inset-0 bg-[hsl(28_95%_55%)] mix-blend-screen opacity-70" />
        </div>
        {/* Light leak / divider glow */}
        <div
          className="absolute inset-y-0"
          style={{
            left: "55%",
            width: 6,
            transform: "skewX(-6deg)",
            background: "linear-gradient(180deg, transparent, hsl(35 95% 70% / 0.7), transparent)",
            filter: "blur(6px)",
          }}
        />
      </div>

      {/* Vertical eyebrow on the left edge */}
      {slide.eyebrow && (
        <div
          className="absolute left-10 top-1/2 -translate-y-1/2 font-sans-ui text-[20px] uppercase tracking-[0.5em] text-brand-cream/85"
          style={{ writingMode: "vertical-rl", transform: "translateY(-50%) rotate(180deg)" }}
        >
          {slide.eyebrow}
        </div>
      )}

      {/* Cutout subject (preacher) — bottom right, overflowing */}
      {cutout && (
        <img
          src={cutout}
          alt=""
          className="absolute z-10 select-none pointer-events-none"
          style={{
            right: "-40px",
            bottom: "-20px",
            height: "78%",
            width: "auto",
            objectFit: "contain",
            filter: "drop-shadow(-20px 20px 30px hsl(215 60% 8% / 0.5))",
          }}
        />
      )}

      {/* Stencil title — bottom-left, gigantic, slight rotation per line */}
      <div className="absolute bottom-16 left-12 z-20 max-w-[68%]">
        <StencilTitle text={slide.title ?? ""} />
        {slide.body && (
          <p className="mt-6 max-w-[460px] font-sans-ui text-[22px] leading-[1.4] text-brand-cream/90">
            {slide.body}
          </p>
        )}
      </div>

      {/* Page number — light cream */}
      <div className="absolute bottom-10 right-12 z-20 font-sans-ui text-[22px] tracking-[0.3em] text-brand-cream/70">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

function StencilTitle({ text }: { text: string }) {
  // Split into words; render each on its own line with a slight rotation.
  const words = text.split(/\s+/).filter(Boolean);
  const rotations = [-3, 4, -2, 3, -1, 2];
  return (
    <div className="space-y-[-8px]">
      {words.map((w, i) => (
        <div
          key={i}
          className="font-serif-display italic font-extrabold uppercase text-brand-cream"
          style={{
            fontSize: words.length > 4 ? 110 : 150,
            lineHeight: 0.92,
            letterSpacing: "-0.02em",
            transform: `rotate(${rotations[i % rotations.length]}deg)`,
            transformOrigin: "left center",
            textShadow: "0 6px 24px hsl(215 60% 8% / 0.6)",
            WebkitTextStroke: "1px hsl(40 45% 94% / 0.3)",
          }}
        >
          {w}
        </div>
      ))}
    </div>
  );
}

/**
 * Bold Quote — typographic-only slide. Massive italic quote on cream background
 * with a giant decorative quotation mark and signature line.
 */
function BoldQuote({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-ink">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,hsl(210_85%_22%/0.7),transparent_60%)]" />
      <div className="absolute -left-8 top-[60px] font-serif-display text-[640px] leading-none text-brand-gold/20 select-none">
        “
      </div>
      <div className="relative z-10 flex h-full flex-col justify-center px-20">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <p className="mt-10 font-serif-display italic text-brand-cream text-[88px] leading-[1.02] text-balance max-w-[920px]">
          {slide.title}
        </p>
        {slide.reference && (
          <div className="mt-14 flex items-center gap-4">
            <div className="h-px w-20 bg-brand-gold" />
            <span className="font-sans-ui uppercase tracking-[0.32em] text-brand-gold text-[24px]">
              {slide.reference}
            </span>
          </div>
        )}
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

/**
 * Stat — huge number/statistic with a short caption underneath. Editorial style.
 */
function Stat({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_85%,hsl(42_95%_75%/0.5),transparent_55%)]" />
      {/* Vertical accent bar */}
      <div className="absolute left-12 top-16 bottom-16 w-[3px] bg-brand-gold/70" />
      <div className="relative z-10 flex h-full flex-col justify-center px-20 pl-24">
        <Eyebrow dark>{slide.eyebrow}</Eyebrow>
        <div
          className="mt-6 font-serif-display italic text-brand-blue leading-[0.85] text-balance"
          style={{
            fontSize: (slide.stat ?? "").length > 4 ? 320 : 420,
            letterSpacing: "-0.04em",
          }}
        >
          {slide.stat || "0%"}
        </div>
        {slide.statLabel && (
          <p className="mt-8 font-serif-display italic text-brand-ink text-[44px] leading-[1.1] max-w-[760px] text-balance">
            {slide.statLabel}
          </p>
        )}
        {slide.body && (
          <p className="mt-6 font-sans-ui text-[24px] leading-[1.5] text-brand-ink/70 max-w-[700px]">
            {slide.body}
          </p>
        )}
      </div>
      <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

/**
 * Scripture Card — elegant framed card on a dark background, like a printed
 * memory verse. Reference at the top in small caps, verse in italic serif.
 */
function ScriptureCard({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,hsl(210_85%_28%/0.7),transparent_70%)]" />
      {/* Inner card */}
      <div className="absolute inset-[80px] rounded-[8px] bg-brand-cream flex flex-col">
        {/* Top double-line frame */}
        <div className="mx-12 mt-12 border-t-2 border-b border-brand-blue/40 py-4 text-center">
          <div className="font-sans-ui uppercase tracking-[0.42em] text-brand-blue text-[22px]">
            {slide.reference || slide.eyebrow || "Versículo"}
          </div>
        </div>
        <div className="flex-1 flex flex-col justify-center px-14 text-center">
          <p className="font-serif-display italic text-brand-ink text-[64px] leading-[1.05] text-balance">
            “{slide.title}”
          </p>
          {slide.body && (
            <p className="mt-10 font-sans-ui text-[22px] leading-[1.5] text-brand-ink/65 max-w-[640px] mx-auto">
              {slide.body}
            </p>
          )}
        </div>
        {/* Bottom ornament */}
        <div className="mx-auto mb-12 flex items-center gap-4">
          <div className="h-px w-12 bg-brand-gold" />
          <span className="font-serif-display italic text-brand-gold text-[28px]">✦</span>
          <div className="h-px w-12 bg-brand-gold" />
        </div>
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

/**
 * Polaroid — single photo styled as a polaroid, slightly rotated, taped to a
 * textured paper background. Caption underneath in handwritten-style italic.
 */
function Polaroid({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,hsl(42_60%_80%/0.45),transparent_60%)]" />
      {/* Subtle paper grain via repeating gradient */}
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(45deg, hsl(30 40% 30%) 0 1px, transparent 1px 6px)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-12">
        <Eyebrow dark>{slide.eyebrow}</Eyebrow>

        <div
          className="mt-10 bg-white p-6 pb-20 shadow-[0_30px_60px_-20px_hsl(215_60%_15%/0.35)]"
          style={{ transform: "rotate(-3deg)" }}
        >
          {/* Tape */}
          <div
            className="absolute -top-4 left-1/2 h-10 w-32 bg-brand-gold/60"
            style={{ transform: "translateX(-50%) rotate(-4deg)", filter: "blur(0.3px)" }}
          />
          <div className="h-[640px] w-[640px] overflow-hidden bg-brand-ink/10">
            {slide.image && (
              <img src={slide.image} alt="" className="h-full w-full object-cover" />
            )}
          </div>
          <p className="mt-8 text-center font-serif-display italic text-brand-ink text-[40px] leading-[1.1] text-balance px-4">
            {slide.title}
          </p>
        </div>

        {slide.body && (
          <p className="mt-8 max-w-[680px] text-center font-sans-ui text-[22px] leading-[1.5] text-brand-ink/70">
            {slide.body}
          </p>
        )}
      </div>
      <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

export function SlideRenderer(props: Props) {
  const { slide } = props;
  switch (slide.template) {
    case "cover":
      return <Cover {...props} />;
    case "verse":
      return <Verse {...props} />;
    case "photo-quote":
      return <PhotoQuote {...props} />;
    case "list":
      return <ListSlide {...props} />;
    case "split":
      return <Split {...props} />;
    case "cta":
      return <CTA {...props} />;
    case "collage":
      return <Collage {...props} />;
    case "bold-quote":
      return <BoldQuote {...props} />;
    case "stat":
      return <Stat {...props} />;
    case "scripture-card":
      return <ScriptureCard {...props} />;
    case "polaroid":
      return <Polaroid {...props} />;
    case "magazine":
      return <Magazine {...props} />;
    case "frame":
      return <Frame {...props} />;
    case "big-number":
      return <BigNumber {...props} />;
    case "gradient-quote":
      return <GradientQuote {...props} />;
  }
}

/**
 * Magazine — large editorial cover. Photo on top 60%, masthead label on top,
 * big italic title at bottom over a cream block.
 */
function Magazine({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-cream">
      {/* Top photo block */}
      <div className="absolute inset-x-0 top-0 h-[62%] overflow-hidden bg-brand-deep">
        {slide.image && (
          <img src={slide.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-brand-deep/40 via-transparent to-brand-cream" />
        {/* Masthead */}
        <div className="absolute top-10 left-12 right-12 flex items-center justify-between">
          <div className="font-serif-display italic text-brand-cream text-[42px] leading-none">
            Fé<span className="text-brand-gold">.</span>
          </div>
          {slide.eyebrow && (
            <div className="font-sans-ui uppercase tracking-[0.42em] text-brand-cream/85 text-[20px] border border-brand-cream/40 px-4 py-2">
              {slide.eyebrow}
            </div>
          )}
        </div>
      </div>
      {/* Bottom cream block with title */}
      <div className="absolute inset-x-0 bottom-0 h-[42%] flex flex-col justify-end px-12 pb-16">
        <h1 className="font-serif-display italic text-brand-ink text-[88px] leading-[0.95] text-balance max-w-[920px]">
          {slide.title}
        </h1>
        {slide.body && (
          <p className="mt-6 font-sans-ui text-[26px] leading-[1.4] text-brand-ink/70 max-w-[760px]">
            {slide.body}
          </p>
        )}
        {slide.author && (
          <div className="mt-6 flex items-center gap-4">
            <div className="h-px w-12 bg-brand-blue" />
            <span className="font-sans-ui uppercase tracking-[0.32em] text-brand-blue text-[20px]">
              {slide.author}
            </span>
          </div>
        )}
      </div>
      <div className="absolute bottom-10 right-12 z-10 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

/**
 * Frame — photo centered inside a thin gold border with editorial caption below.
 */
function Frame({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-deep">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,hsl(210_85%_28%/0.7),transparent_70%)]" />
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-16">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        {/* Framed photo */}
        <div className="mt-8 p-3 border border-brand-gold/60">
          <div className="p-1 border border-brand-gold/40">
            <div className="h-[700px] w-[820px] overflow-hidden bg-brand-ink/40">
              {slide.image && (
                <img src={slide.image} alt="" className="h-full w-full object-cover" />
              )}
            </div>
          </div>
        </div>
        <p className="mt-10 font-serif-display italic text-brand-cream text-[48px] leading-[1.1] text-balance text-center max-w-[860px]">
          {slide.title}
        </p>
        {slide.reference && (
          <div className="mt-6 font-sans-ui uppercase tracking-[0.32em] text-brand-gold text-[20px]">
            {slide.reference}
          </div>
        )}
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}

/**
 * BigNumber — list with massive outlined numerals in a dense editorial layout.
 */
function BigNumber({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden bg-brand-cream">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_85%_15%,hsl(42_95%_75%/0.4),transparent_55%)]" />
      <div className="relative z-10 flex h-full flex-col p-16">
        <Eyebrow dark>{slide.eyebrow}</Eyebrow>
        <h2 className="mt-4 font-serif-display italic text-brand-ink text-[58px] leading-[1.05] text-balance max-w-[820px]">
          {slide.title}
        </h2>
        <ul className="mt-10 flex-1 flex flex-col justify-around">
          {slide.items?.slice(0, 5).map((it, i) => (
            <li key={i} className="flex items-center gap-8 border-b border-brand-ink/15 pb-3">
              <span
                className="font-serif-display italic text-brand-blue leading-none"
                style={{
                  fontSize: 140,
                  WebkitTextStroke: "2px hsl(var(--brand-blue))",
                  WebkitTextFillColor: "transparent",
                  width: 160,
                  letterSpacing: "-0.04em",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </span>
              <span className="font-sans-ui text-brand-ink text-[28px] leading-[1.35] flex-1">
                {it}
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="absolute bottom-10 right-12 font-sans-ui text-[22px] tracking-[0.3em] text-brand-ink/40">
        {String(index + 1).padStart(2, "0")} / {String(total).padStart(2, "0")}
      </div>
    </div>
  );
}

/**
 * GradientQuote — quote on a vibrant blue→gold gradient with subtle grain.
 */
function GradientQuote({ slide, index, total }: Props) {
  return (
    <div className="absolute inset-0 overflow-hidden">
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(135deg, hsl(215 80% 22%) 0%, hsl(210 70% 38%) 45%, hsl(35 90% 60%) 100%)",
        }}
      />
      {/* Soft glow */}
      <div className="absolute -top-40 -right-40 h-[700px] w-[700px] rounded-full bg-brand-gold/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-40 h-[600px] w-[600px] rounded-full bg-brand-blue/40 blur-3xl" />
      {/* Grain */}
      <div
        className="absolute inset-0 opacity-[0.08] mix-blend-overlay"
        style={{
          backgroundImage:
            "repeating-radial-gradient(circle at 0 0, hsl(0 0% 100%) 0 1px, transparent 1px 3px)",
        }}
      />
      <div className="relative z-10 flex h-full flex-col justify-center px-20">
        <Eyebrow>{slide.eyebrow}</Eyebrow>
        <p className="mt-10 font-serif-display italic text-brand-cream text-[82px] leading-[1.05] text-balance max-w-[900px]" style={{ textShadow: "0 4px 20px hsl(215 60% 8% / 0.4)" }}>
          {slide.title}
        </p>
        {slide.reference && (
          <div className="mt-12 flex items-center gap-4">
            <div className="h-px w-16 bg-brand-cream" />
            <span className="font-sans-ui uppercase tracking-[0.32em] text-brand-cream text-[22px]">
              {slide.reference}
            </span>
          </div>
        )}
      </div>
      <PageNumber index={index} total={total} />
    </div>
  );
}