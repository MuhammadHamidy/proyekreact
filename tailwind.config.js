/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            animation: {
                'fadeIn': 'fadeIn 1s ease-out forwards',
                'bounceIn': 'bounceIn 0.8s cubic-bezier(0.8, 0, 1, 1)',
                'pulse': 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'spin': 'spin 3s linear infinite',
                'flicker': 'flicker 3s infinite',
                'smoke': 'smoke 1s forwards',
                'float': 'float 6s ease-in-out infinite',
                'cloudFloat': 'cloudFloat 20s linear infinite',
            },
            keyframes: {
                fadeIn: {
                    '0%': { opacity: '0', transform: 'translateY(-20px)' },
                    '100%': { opacity: '1', transform: 'translateY(0)' },
                },
                bounceIn: {
                    '0%': { transform: 'scale(0)', opacity: '0' },
                    '50%': { transform: 'scale(1.1)' },
                    '100%': { transform: 'scale(1)', opacity: '1' },
                },
                flicker: {
                    '0%, 100%': { transform: 'scale(1) translateY(0)', opacity: '1' },
                    '50%': { transform: 'scale(1.1) translateY(-2px)', opacity: '0.8' },
                },
                smoke: {
                    '0%': { transform: 'translateY(0) scale(1)', opacity: '0.5' },
                    '100%': { transform: 'translateY(-20px) scale(1.5)', opacity: '0' },
                },
                float: {
                    '0%, 100%': { transform: 'translateY(0) rotate(-5deg)' },
                    '50%': { transform: 'translateY(-20px) rotate(5deg)' },
                },
                cloudFloat: {
                    '0%': { transform: 'translateX(0)' },
                    '100%': { transform: 'translateX(120vw)' },
                }
            }
        },
    },
    plugins: [],
}
