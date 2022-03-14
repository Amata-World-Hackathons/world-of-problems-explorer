module.exports = {
  important: true,
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./utils/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      sans: ["Roboto", "sans-serif"],
      mono: ["Inconsolata", "monospace"],
    },
  },
  plugins: [],
};
