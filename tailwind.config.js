import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.tsx',
        './src/**/*.{js,jsx,ts,tsx}', // Configuração para projetos React
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ['Figtree', ...defaultTheme.fontFamily.sans],
            },
            keyframes: {
                'slide-down': {
                    '0%': { height: '0', opacity: '0' },
                    '100%': { height: 'auto', opacity: '1' },
                  },
                  'slide-up': {
                    '0%': { height: 'auto', opacity: '1' },
                    '100%': { height: '0', opacity: '0' },
                  },
            },
            animation: {
                'slide-down': 'slide-down 0.5s ease-out',
                'slide-up': 'slide-up 0.5s ease-out',
            },
        },
    },

    plugins: [forms],
};
