import daisyui from 'daisyui'

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [daisyui],
  daisyui: {
    themes: true,
    extends: {
      colors: {
        primary: 'var(--tw-color-primary)',
        secondary: 'var(--tw-color-secondary)',
        accent: 'var(--tw-color-accent)',
        neutral: 'var(--tw-color-neutral)',
        warning: 'var(--tw-color-warning)',
        'base-100': 'var(--tw-color-base-100)',
        'base-200': 'var(--tw-color-base-200)',
        'base-300': 'var(--tw-color-base-300)',
        'base-content': 'var(--tw-color-base-content)',
      },
    },
  },
}
