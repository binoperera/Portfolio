import Image from "next/image";

// Images uploaded through the admin dashboard live on Vercel Blob, which is
// allowed in next.config.js (images.remotePatterns). Those go through
// next/image so visitors get a resized WebP/AVIF that matches the slot,
// instead of the full 2000px upload. Any other URL falls back to a plain
// <img>, because next/image throws on hosts that aren't allowed.
const OPTIMIZABLE_HOST = /\.public\.blob\.vercel-storage\.com$/;

function canOptimize(src: string) {
  try {
    return OPTIMIZABLE_HOST.test(new URL(src).hostname);
  } catch {
    return false; // relative or malformed URL
  }
}

type Props = {
  src: string;
  alt: string;
  // How wide the image renders at each breakpoint, so the browser picks the
  // right size. The parent must be position: relative with a fixed aspect.
  sizes: string;
  className?: string;
  // Above-the-fold image (the hero photo): load first instead of lazily.
  priority?: boolean;
};

export default function SmartImage({ src, alt, sizes, className, priority }: Props) {
  if (!canOptimize(src)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={src}
        alt={alt}
        loading={priority ? "eager" : "lazy"}
        className={`absolute inset-0 ${className ?? ""}`}
      />
    );
  }
  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      className={className}
    />
  );
}
