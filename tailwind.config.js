/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FE8C00",
        bgPrimary: "#FFE8CC",
        starsRating: "#fec24b",
        bgBlackTransparent: "rgba(0, 0, 0, 0.5)",
        border: "#f4f4f4",
        textDescription: "#8d8d8d",
        textBody: "#161717",
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px" }],
        h2: ["24px", { lineHeight: "32px" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
      fontFamily: {
        sans: ["Roboto_400Regular"], // 👈 Roboto agora é a fonte padrão (classe `font-sans`)
        medium: ["Roboto_500Medium"],
        bold: ["Roboto_700Bold"],
      },
    },
  },
  plugins: [],
};
