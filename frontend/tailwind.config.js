/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brutal: {
          bg:      '#FFFDF7',
          fg:      '#111111',
          border:  '#111111',
          primary: '#FF3366',
          'primary-hover': '#E61A4D',
          secondary: '#FFD700',
          'secondary-hover': '#E6C200',
          danger:  '#FF4444',
          'danger-hover': '#E62E2E',
          blue:    '#0066FF',
          green:   '#00CC66',
          purple:  '#8833FF',
          orange:  '#FF6600',
          muted:   '#888888',
          overlay: 'rgba(17,17,17,0.75)',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      fontSize: {
        'display': ['56px', { lineHeight: '1.05', fontWeight: '800', letterSpacing: '-0.03em' }],
        'headline': ['36px', { lineHeight: '1.15', fontWeight: '800' }],
        'title':    ['24px', { lineHeight: '1.2', fontWeight: '700' }],
        'body':     ['16px', { lineHeight: '1.5', fontWeight: '500' }],
        'label':    ['12px', { lineHeight: '1.2', fontWeight: '700', letterSpacing: '0.06em' }],
        'mono-sm':  ['13px', { lineHeight: '1.5', fontWeight: '500' }],
      },
      borderRadius: {
        none: '0',
      },
      borderWidth: {
        '3': '3px',
        '4': '4px',
      },
      boxShadow: {
        'brutal':    '4px 4px 0 #111111',
        'brutal-sm': '2px 2px 0 #111111',
        'brutal-lg': '6px 6px 0 #111111',
        'brutal-primary':   '4px 4px 0 #FF3366',
        'brutal-secondary': '4px 4px 0 #FFD700',
        'brutal-danger':    '4px 4px 0 #FF4444',
      },
      keyframes: {
        slideUp:  { '0%': { transform: 'translateY(32px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        popIn:    { '0%': { transform: 'scale(0.85)', opacity: '0' }, '60%': { transform: 'scale(1.03)' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        shake:    { '0%,100%': { transform: 'translateX(0)' }, '25%': { transform: 'translateX(-4px)' }, '75%': { transform: 'translateX(4px)' } },
        typewriter:{ '0%': { width: '0' }, '100%': { width: '100%' } },
      },
      animation: {
        'slide-up': 'slideUp 0.3s cubic-bezier(0,0,0,1)',
        'pop-in':   'popIn 0.3s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'shake':    'shake 0.4s ease',
      },
    },
  },
  plugins: [],
};
