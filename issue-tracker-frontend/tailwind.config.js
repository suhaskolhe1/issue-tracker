/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            fontFamily: {
                // Strict system font stack for maximum readability and zero layout shift
                sans: [
                    'system-ui',
                    '-apple-system',
                    'BlinkMacSystemFont',
                    '"Segoe UI"',
                    'Roboto',
                    '"Helvetica Neue"',
                    'Arial',
                    'sans-serif',
                ],
            },
            colors: {
                // Our warm neutral background
                surface: {
                    DEFAULT: '#FAFAF9', // stone-50
                    muted: '#F5F5F4',   // stone-100
                },
                // Restrained accent (deep slate blue)
                accent: {
                    DEFAULT: '#334155', // slate-700
                    hover: '#1e293b',   // slate-800
                }
            }
        },
    },
    plugins: [],
}
