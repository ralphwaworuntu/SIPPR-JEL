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
                "primary": "rgba(var(--accent-color-rgb), <alpha-value>)", // Dynamic accent color
                "secondary": "#64748b", // Slate-500 for secondary text
                "background-light": "#f8fafc", // Slate-50
                "background-dark": "#0f172a", // Slate-900
            },
            fontFamily: {
                "display": ["Manrope", "sans-serif"],
                "sans": ["Manrope", "sans-serif"],
            },
            borderRadius: { "DEFAULT": "0.25rem", "lg": "0.5rem", "xl": "1rem", "2xl": "1.5rem", "full": "9999px" },
            animation: {
                marquee: 'marquee 25s linear infinite',
                scroll: 'scroll 2s ease-in-out infinite',
                shake: 'shake 0.4s cubic-bezier(.36,.07,.19,.97) both',
                scaleIn: 'scaleIn 0.3s ease-out forwards',
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(0%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                scroll: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(10px)' },
                },
                shake: {
                    '10%, 90%': { transform: 'translate3d(-2px, 0, 0)' },
                    '20%, 80%': { transform: 'translate3d(3px, 0, 0)' },
                    '30%, 50%, 70%': { transform: 'translate3d(-5px, 0, 0)' },
                    '40%, 60%': { transform: 'translate3d(5px, 0, 0)' }
                },
                scaleIn: {
                    'from': { opacity: 0, transform: 'scale(0.8)' },
                    'to': { opacity: 1, transform: 'scale(1)' },
                }
            },
        },
    },
    plugins: [],
}
