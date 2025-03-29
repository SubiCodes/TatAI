/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  darkMode: 'class',
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./components/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors:{
        'background': "#FAF9F6",
        'background-dark': '#212121',
        'text': '#000000',
        'text-dark': '#FFF',
        'primary': "#0818A8",
        'secondary': 	"#006FFD",
        'btnWhite': '#F8F8FF',
      }
    },
  },
  plugins: [],
}