/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        // For Inter option
        inter: ["var(--font-inter)", "system-ui", "sans-serif"],

        // For DM Sans + Playfair option
        "dm-sans": ["var(--font-dm-sans)", "system-ui", "sans-serif"],
        playfair: ["var(--font-playfair)", "serif"],
      },
    },
  },
  plugins: [],
};
