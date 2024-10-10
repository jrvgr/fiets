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
      },
      animation: {
        scale: "0.75s scale forwards",
      },
    },
  },
  content: ["./src/**/*.{html,js,svelte,ts}"],
  variants: {
    extend: {},
  },
  darkMode: false, // or 'media' or 'class'
};
