import { useEffect, useRef, useState } from "react";
import { Slide } from "@/lib/carousel-types";
import { SLIDE_H, SLIDE_W, SlideRenderer } from "./SlideRenderer";

interface Props {
  slide: Slide;
  index: number;
  total: number;
  /** When true, render at full 1080x1350 with no scale (used by exporter). */
  exportMode?: boolean;
  /** Wrapper className for sizing context. */
  className?: string;
  innerRef?: (el: HTMLDivElement | null) => void;
}

export function SlideCanvas({ slide, index, total, exportMode, className, innerRef }: Props) {
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
  }, [exportMode]);

  if (exportMode) {
    return (
      <div
        ref={innerRef}
        style={{ width: SLIDE_W, height: SLIDE_H, position: "relative", overflow: "hidden" }}
        className="slide-content"
      >
        <SlideRenderer slide={slide} index={index} total={total} />
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
        <SlideRenderer slide={slide} index={index} total={total} />
      </div>
    </div>
  );
}