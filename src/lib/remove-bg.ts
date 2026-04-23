import { pipeline, env } from "@huggingface/transformers";

// Always download from HF Hub (don't try to fetch local /models)
env.allowLocalModels = false;
env.useBrowserCache = true;

const MAX_DIM = 1024;

let segmenterPromise: Promise<any> | null = null;

function getSegmenter() {
  if (!segmenterPromise) {
    segmenterPromise = pipeline("image-segmentation", "Xenova/segformer-b0-finetuned-ade-512-512", {
      // Try webgpu, fall back to wasm automatically if unsupported
      device: "webgpu",
    }).catch(() =>
      pipeline("image-segmentation", "Xenova/segformer-b0-finetuned-ade-512-512")
    );
  }
  return segmenterPromise;
}

/** Pre-warm the model (call once on app start so first upload is faster). */
export function warmupBackgroundRemoval() {
  void getSegmenter();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function drawResized(img: HTMLImageElement) {
  const canvas = document.createElement("canvas");
  let { naturalWidth: w, naturalHeight: h } = img;
  if (w > MAX_DIM || h > MAX_DIM) {
    const r = Math.min(MAX_DIM / w, MAX_DIM / h);
    w = Math.round(w * r);
    h = Math.round(h * r);
  }
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  ctx.drawImage(img, 0, 0, w, h);
  return { canvas, ctx, w, h };
}

/**
 * Remove the background from a data URL / object URL image and return a PNG data URL
 * with transparent background. Uses semantic segmentation in the browser (no backend).
 *
 * Strategy: run ADE20K segmentation, then keep ONLY pixels labeled as "person" if any
 * are found, otherwise fall back to the inverse of the dominant background label.
 */
export async function removeBackground(srcDataUrl: string): Promise<string> {
  const segmenter = await getSegmenter();
  const img = await loadImage(srcDataUrl);
  const { canvas, ctx, w, h } = drawResized(img);

  // Run segmentation on the resized canvas data URL
  const inputUrl = canvas.toDataURL("image/png");
  const result = await segmenter(inputUrl);
  if (!result || !Array.isArray(result) || result.length === 0) {
    throw new Error("Segmentation returned no results");
  }

  // Prefer 'person'; otherwise pick the largest non-background-ish foreground class.
  const personSeg = result.find((r: any) => /person|human/i.test(r.label));
  const chosen =
    personSeg ??
    result
      .filter((r: any) => !/wall|floor|ceiling|sky|ground|earth|grass|road|building|tree|water|sea|mountain/i.test(r.label))
      .sort((a: any, b: any) => countMask(b.mask) - countMask(a.mask))[0] ??
    result[0];

  const mask = chosen.mask; // { data: Uint8ClampedArray|number[], width, height }
  const imageData = ctx.getImageData(0, 0, w, h);
  const pixels = imageData.data;

  for (let i = 0; i < mask.data.length; i++) {
    const inside = mask.data[i] > 128; // 1 = foreground in this class
    // alpha channel is index*4 + 3
    pixels[i * 4 + 3] = inside ? 255 : 0;
  }
  ctx.putImageData(imageData, 0, 0);
  return canvas.toDataURL("image/png");
}

function countMask(mask: any): number {
  let n = 0;
  for (let i = 0; i < mask.data.length; i++) if (mask.data[i] > 128) n++;
  return n;
}