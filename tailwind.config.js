export default {
  plugins: [],
  theme: {
    extend: {
      keyframes: {
        scale: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(2)" },
          "100%": { transform: "scale(1)" },
        },
        zoom: {
          "0%": { transform: "scale(0.8)", opacity: "75%" },
          "100%": { transform: "scale(1)", opacity: "100%" },
        },
      },
      animation: {
        scale: "0.75s scale forwards",
        zoom: "0.20s zoom forwards ease",
      },
    },
  },
  content: ["./src/**/*.{html,js,svelte,ts}"],
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
};
