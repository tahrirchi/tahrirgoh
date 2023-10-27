/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        'tahrirchi-gradient-start': '#8CE56B',
        'tahrirchi-gradient-end': '#2CC162',
        'tahrirchi-green': '#3BB467',
        'tahrirchi-primary': '#40D275',

        'tahrirchi-gray': {
          50: '#F9FBFC',
          100: '#F3F7F9',
          200: '#EEF5F9',
          300: '#ECF5FA',
          400: '#C2C7D4',
          500: '#A1A7B7',
        },

        'tahrirchi-purple': '#7965F6',

        'tahrirchi-yellow': {
          100: '#FBEBD2',
          500: '#E5B435',
        },
        'tahrirchi-secondary-text': '#647481',
        'tahrirchi-main-text': '#17171A',
        'tahrirchi-error': '#F95A5A',
        'tahrirchi-error-card': '#FEE5E5',
        'tahrirchi-primary-card': '#ECFBF2', // tahrirchi-pale
        'tahrirchi-info': '#1D92F1',
        'tahrirchi-info-card': '#DDEFFD',
        'tahrirchi-warn': '#FFD12C',
        'tahrirchi-warn-card': '#FFF8E0',
        'tahrirchi-line': '#E9EBF0',
      },
      borderRadius: {
        20: '1.25rem',
      },
      maxWidth: {
        30: '30rem',
      },
    },
  },
  plugins: [],
}
