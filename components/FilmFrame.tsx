// A single "frame" cut from a strip of film — sprocket holes down both sides,
// holding either your photo or, until you add one, an unexposed-frame placeholder
// that fits the theme instead of a generic broken-image icon.
import SmartImage from "@/components/SmartImage";

export default function FilmFrame({ photoUrl, name }: { photoUrl?: string; name: string }) {
  return (
    // Width now comes from the hero grid column in app/page.tsx (was capped at 240px).
    <div className="w-full max-w-[300px] md:max-w-none mx-auto md:mx-0">
      <div className="group flex border border-line bg-surface">
        <div className="sprocket-strip-vertical" />
        <div className="flex-1 aspect-[3/4] overflow-hidden relative">
          {photoUrl ? (
            <>
              {/* Muted, warm grade so a bright photo sits in the dark film palette;
                  hovering "develops" it back to full colour. */}
              <SmartImage
                src={photoUrl}
                alt={name}
                priority
                sizes="(min-width: 768px) 360px, 300px"
                className="w-full h-full object-cover grayscale-[40%] sepia-[.2] brightness-[.85] contrast-[1.05] transition duration-700 group-hover:grayscale-0 group-hover:sepia-0 group-hover:brightness-100"
              />
              {/* Soft vignette that blends the photo edges into the frame. */}
              <div
                aria-hidden
                className="absolute inset-0 pointer-events-none shadow-[inset_0_0_60px_rgb(var(--c-ink)/0.7)] transition-opacity duration-700 group-hover:opacity-40"
              />
            </>
          ) : (
            <div
              className="w-full h-full flex flex-col items-center justify-center gap-2 text-center px-4"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(45deg, #1D1B17, #1D1B17 10px, #201E1A 10px, #201E1A 20px)",
              }}
            >
              <span className="font-mono text-[10px] text-cream/40 tracking-wide leading-relaxed">
                FRAME NOT
                <br />
                YET DEVELOPED
              </span>
            </div>
          )}
        </div>
        <div className="sprocket-strip-vertical" />
      </div>
      <p className="eyebrow text-cream/40 text-center mt-2"></p>
    </div>
  );
}
