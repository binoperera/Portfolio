// A single "frame" cut from a strip of film — sprocket holes down both sides,
// holding either your photo or, until you add one, an unexposed-frame placeholder
// that fits the theme instead of a generic broken-image icon.
export default function FilmFrame({ photoUrl, name }: { photoUrl?: string; name: string }) {
  return (
    <div className="w-full max-w-[240px] mx-auto md:mx-0">
      <div className="flex border border-line bg-surface">
        <div className="sprocket-strip-vertical" />
        <div className="flex-1 aspect-[3/4] overflow-hidden relative">
          {photoUrl ? (
            <img
              src={photoUrl}
              alt={name}
              className="w-full h-full object-cover"
              style={{ filter: "grayscale(10%) contrast(1.05)" }}
            />
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
