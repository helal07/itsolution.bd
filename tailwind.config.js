import defaultTheme from 'tailwindcss/defaultTheme';
import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        './vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
        './storage/framework/views/*.php',
        './resources/views/**/*.blade.php',
        './resources/js/**/*.jsx',
    ],

    theme: {
        extend: {
            screens: {
                '3xl': '1920px',
                '4xl': '2560px',
            },
            colors: {
                primary: {
                    DEFAULT: '#1E88E5',
                    light: '#42A5F5',
                    dark: '#0D3B66',
                    hover: '#1976D2',
                },
                surface: '#FFFFFF',
                neutral: {
                    50: '#F9FAFB',
                    100: '#F3F4F6',
                    200: '#E5E7EB',
                    300: '#D1D5DB',
                    400: '#9CA3AF',
                    500: '#6B7280',
                    600: '#4B5563',
                    700: '#374151',
                    800: '#1F2937',
                    900: '#111827',
                },
                success: '#22C55E',
                danger: '#EF4444',
            },
            fontFamily: {
                sans: ['Inter', 'Poppins', ...defaultTheme.fontFamily.sans],
                heading: ['Poppins', 'Inter', ...defaultTheme.fontFamily.sans],
                display: ['Syne', 'Outfit', 'Poppins', ...defaultTheme.fontFamily.sans],
                outfit: ['Outfit', 'Inter', ...defaultTheme.fontFamily.sans],
            },
            boxShadow: {
                card: '0 2px 8px rgba(0,0,0,0.08)',
                'card-hover': '0 6px 16px rgba(0,0,0,0.12)',
                glass: '0 8px 32px 0 rgba(31, 38, 135, 0.15)',
            },
            borderRadius: {
                card: '8px',
                pill: '9999px',
            },
        },
    },

    plugins: [forms],
};
