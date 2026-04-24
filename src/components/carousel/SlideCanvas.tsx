import { useEffect, useRef, useState } from "react";
import { Slide, SlideFormat, FORMAT_DIMS } from "@/lib/carousel-types";
import { SlideRenderer } from "./SlideRenderer";

interface Props {
  slide: Slide;
  index: number;
  total: number;
  /** When true, render at full size with no scale (used by exporter). */
  exportMode?: boolean;
  /** Wrapper className for sizing context. */
  className?: string;
  innerRef?: (el: HTMLDivElement | null) => void;
  format?: SlideFormat;
}

export function SlideCanvas({
  slide,
  index,
  total,
  exportMode,
  className,
  innerRef,
  format = "portrait",
}: Props) {
  const { w: SLIDE_W, h: SLIDE_H } = FORMAT_DIMS[format];
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    if (exportMode) return;
    const el = wrapperRef.current;
    if (!el) return;
    const update = () => {
      const { width, height } = el.getBoundingClientRect();
      const s = Math.min(width / SLIDE_W, height / SLIDE_H);
      setScale(s || 1);
    };
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, [exportMode, SLIDE_W, SLIDE_H]);

  if (exportMode) {
    return (
      <div
        ref={innerRef}
        style={{ width: SLIDE_W, height: SLIDE_H, position: "relative", overflow: "hidden" }}
        className="slide-content"
      >
        <SlideRenderer slide={slide} index={index} total={total} format={format} />
        <div
          style={{
            position: "absolute",
            top: 24,
            left: 0,
            right: 0,
            textAlign: "center",
            fontSize: 18,
            letterSpacing: "0.2em",
            fontWeight: 600,
            color: "rgba(255,255,255,0.85)",
            textShadow: "0 1px 4px rgba(0,0,0,0.45)",
            pointerEvents: "none",
            zIndex: 10,
          }}
        >
          SLIDE {index + 1} - ESCOLHA
        </div>
      </div>
    );
  }

  return (
    <div
      ref={wrapperRef}
      className={`relative overflow-hidden ${className ?? ""}`}
      style={{ aspectRatio: `${SLIDE_W} / ${SLIDE_H}` }}
    >
      <div
        style={{
          width: SLIDE_W,
          height: SLIDE_H,
          position: "absolute",
          left: "50%",
          top: "50%",
          marginLeft: -SLIDE_W / 2,
          marginTop: -SLIDE_H / 2,
          transform: `scale(${scale})`,
          transformOrigin: "center center",
        }}
        className="slide-content"
      >
        <SlideRenderer slide={slide} index={index} total={total} format={format} />
      </div>
    </div>
  );
}