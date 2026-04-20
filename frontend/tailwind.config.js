/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
      extend: {
          "colors": {
              "outline": "#8a8c9a",
              "on-secondary-fixed": "#1a1b26",
              "inverse-primary": "#a5b4fc",
              "error": "#dc2626",
              "tertiary": "#7c3aed",
              "on-secondary-container": "#585a68",
              "surface-variant": "#dcdee4",
              "on-tertiary": "#ffffff",
              "on-primary-container": "#e0e2ff",
              "inverse-surface": "#2e3040",
              "surface-bright": "#edeef4",
              "secondary-fixed-dim": "#b8baca",
              "on-error-container": "#991b1b",
              "tertiary-fixed": "#ede9fe",
              "surface-container-low": "#e5e7ed",
              "surface": "#e8eaf0",
              "on-secondary": "#ffffff",
              "on-tertiary-container": "#3b1f63",
              "surface-dim": "#d4d6dc",
              "secondary-fixed": "#d8dae6",
              "tertiary-fixed-dim": "#c4b5fd",
              "surface-container-high": "#dcdee4",
              "surface-container": "#e2e4ea",
              "primary-fixed-dim": "#a5b4fc",
              "on-surface-variant": "#585a68",
              "on-secondary-fixed-variant": "#404252",
              "outline-variant": "#d0d2dc",
              "on-primary-fixed": "#1e1b4b",
              "surface-container-highest": "#d6d8de",
              "primary": "#6366f1",
              "surface-tint": "#6366f1",
              "on-background": "#2e3040",
              "surface-container-lowest": "#f0f2f8",
              "tertiary-container": "#a78bfa",
              "primary-fixed": "#e0e2ff",
              "on-primary-fixed-variant": "#4338ca",
              "on-error": "#ffffff",
              "error-container": "#fee2e2",
              "inverse-on-surface": "#e8eaf0",
              "on-surface": "#2e3040",
              "on-primary": "#ffffff",
              "on-tertiary-fixed-variant": "#5b21b6",
              "on-tertiary-fixed": "#2e1065",
              "secondary-container": "#d8dae6",
              "secondary": "#6c6e7e",
              "primary-container": "#818cf8",
              "background": "#e8eaf0"
          },
          "borderRadius": {
              "DEFAULT": "0.5rem",
              "lg": "1rem",
              "xl": "1.5rem",
              "full": "9999px"
          },
          "fontFamily": {
              "headline": ["Plus Jakarta Sans"],
              "body": ["Plus Jakarta Sans"],
              "label": ["Plus Jakarta Sans"]
          }
      }
  },
  plugins: [],
}
