/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Theme-aware colours — values live in app/globals.css (--c-*)
        ink:       "rgb(var(--c-ink) / <alpha-value>)",
        surface:   "rgb(var(--c-surface) / <alpha-value>)",
        line:      "rgb(var(--c-line) / <alpha-value>)",
        cream:     "rgb(var(--c-cream) / <alpha-value>)",
        safelight: "rgb(var(--c-safelight) / <alpha-value>)",
        "on-safelight": "rgb(var(--c-on-safelight) / <alpha-value>)",
        aperture:  "rgb(var(--c-aperture) / <alpha-value>)",
        "line-paper": "#D8D0BE",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        body: ["var(--font-body)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
      },
      backgroundImage: {
        sprocket:
          "repeating-linear-gradient(90deg, transparent 0px, transparent 18px, var(--tw-gradient-stops) 18px, var(--tw-gradient-stops) 30px)",
      },
    },
  },
  plugins: [],
};
