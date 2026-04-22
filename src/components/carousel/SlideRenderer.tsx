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
  }
}