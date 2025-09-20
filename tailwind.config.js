/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#FE8C00",
        bgPrimary: "#FFE8CC",
      },
      fontSize: {
        h1: ["32px", { lineHeight: "40px" }],
        h2: ["24px", { lineHeight: "32px" }],
        body: ["16px", { lineHeight: "24px" }],
        caption: ["12px", { lineHeight: "16px" }],
      },
    },
  },
  plugins: [],
};
