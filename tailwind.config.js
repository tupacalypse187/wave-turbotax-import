import { importCSS } from 'tailwindcss'

export default importCSS({
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
})
