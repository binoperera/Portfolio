/** @type {import('next').NextConfig} */

// Sent with every response. Kept to headers that can't break the page:
// the CSP below only restricts framing, <base>, form targets and plugins —
// it doesn't limit scripts or styles, so Next.js and the inline theme script
// keep working.
const securityHeaders = [
  // Nobody can load this site (including /admin) inside an iframe, which
  // blocks clickjacking. frame-ancestors is the modern rule, X-Frame-Options
  // covers older browsers.
  {
    key: "Content-Security-Policy",
    value: "frame-ancestors 'none'; base-uri 'self'; form-action 'self'; object-src 'none'",
  },
  { key: "X-Frame-Options", value: "DENY" },
  // Browsers must trust the declared file type instead of guessing.
  { key: "X-Content-Type-Options", value: "nosniff" },
  // Other sites see only "nimsaraperera.vercel.app", never full page URLs.
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  // The site never needs these browser features, so switch them off.
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
];

const nextConfig = {
  // Don't advertise the framework in an X-Powered-By header.
  poweredByHeader: false,
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "**.public.blob.vercel-storage.com" },
    ],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

module.exports = nextConfig;
