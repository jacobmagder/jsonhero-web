/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}", // Adjust if your source files are elsewhere
    // Add paths to any other template files using Tailwind classes
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Source Sans Pro"', 'sans-serif'],
        mono: ['"Roboto Mono"', 'monospace'],
      },
      colors: {
        // Add custom colors from JSON Hero if any, or use default Tailwind palette
        // Example:
        // slate: {
        //   ...require('tailwindcss/colors').slate,
        //   850: '#1e293b', // Example custom shade
        // },
      }
    },
  },
  plugins: [],
};
