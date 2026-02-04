/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#13ec5b", // Keeping accent
                "secondary": "#64748b", // Slate-500 for secondary text
                "background-light": "#f8fafc", // Slate-50
                "background-dark": "#0f172a", // Slate-900
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "sans": ["Manrope", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "1rem", "2xl": "1.5rem", "full": "9999px" },
        },
    },
    plugins: [],
}
