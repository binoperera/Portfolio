/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#141310",       // near-black warm background
        surface: "#1D1B17",   // raised panels on dark
        paper: "#F1ECE0",     // light-table paper for contact-sheet cards
        "paper-ink": "#1B1812", // text on paper
        cream: "#EDE8DC",     // body text on dark
        safelight: "#E13A2E", // darkroom safelight red accent
        aperture: "#4C9A6A",  // focus-confirm green accent
        line: "#3A362E",      // hairline rules on dark
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
