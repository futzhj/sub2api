/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // 主色调 - Teal/Cyan 青色系
        primary: {
          50: 'rgb(var(--primary-50-rgb, 240 253 250) / <alpha-value>)',
          100: 'rgb(var(--primary-100-rgb, 204 251 241) / <alpha-value>)',
          200: 'rgb(var(--primary-200-rgb, 153 246 228) / <alpha-value>)',
          300: 'rgb(var(--primary-300-rgb, 94 234 212) / <alpha-value>)',
          400: 'rgb(var(--primary-400-rgb, 45 212 191) / <alpha-value>)',
          500: 'rgb(var(--primary-500-rgb, 20 184 166) / <alpha-value>)',
          600: 'rgb(var(--primary-600-rgb, 13 148 136) / <alpha-value>)',
          700: 'rgb(var(--primary-700-rgb, 15 118 110) / <alpha-value>)',
          800: 'rgb(var(--primary-800-rgb, 17 94 89) / <alpha-value>)',
          900: 'rgb(var(--primary-900-rgb, 19 78 74) / <alpha-value>)',
          950: 'rgb(var(--primary-950-rgb, 4 47 46) / <alpha-value>)'
        },
        // 品牌辅色 / secondary accent（由主题运行时注入）
        secondary: {
          50: 'rgb(var(--secondary-50-rgb, 240 253 250) / <alpha-value>)',
          100: 'rgb(var(--secondary-100-rgb, 204 251 241) / <alpha-value>)',
          200: 'rgb(var(--secondary-200-rgb, 153 246 228) / <alpha-value>)',
          300: 'rgb(var(--secondary-300-rgb, 94 234 212) / <alpha-value>)',
          400: 'rgb(var(--secondary-400-rgb, 45 212 191) / <alpha-value>)',
          500: 'rgb(var(--secondary-500-rgb, 13 148 136) / <alpha-value>)',
          600: 'rgb(var(--secondary-600-rgb, 15 118 110) / <alpha-value>)',
          700: 'rgb(var(--secondary-700-rgb, 17 94 89) / <alpha-value>)',
          800: 'rgb(var(--secondary-800-rgb, 19 78 74) / <alpha-value>)',
          900: 'rgb(var(--secondary-900-rgb, 19 78 74) / <alpha-value>)',
          950: 'rgb(var(--secondary-950-rgb, 4 47 46) / <alpha-value>)'
        },
        // 辅助色 - 深蓝灰
        accent: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        // 深色模式背景（legacy slate; prefer surface-* brand tokens for chrome）
        dark: {
          50: '#f8fafc',
          100: '#f1f5f9',
          200: '#e2e8f0',
          300: '#cbd5e1',
          400: '#94a3b8',
          500: '#64748b',
          600: '#475569',
          700: '#334155',
          800: '#1e293b',
          900: '#0f172a',
          950: '#020617'
        },
        // Brand-driven UI surfaces (light/dark swapped via CSS aliases on .dark)
        surface: {
          DEFAULT: 'rgb(var(--surface-page-rgb) / <alpha-value>)',
          page: 'rgb(var(--surface-page-rgb) / <alpha-value>)',
          card: 'rgb(var(--surface-card-rgb) / <alpha-value>)',
          sidebar: 'rgb(var(--surface-sidebar-rgb) / <alpha-value>)',
          muted: 'rgb(var(--surface-muted-rgb) / <alpha-value>)',
          elevated: 'rgb(var(--surface-elevated-rgb) / <alpha-value>)',
          border: 'rgb(var(--surface-border-rgb) / <alpha-value>)'
        }
      },
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"SF Pro Text"',
          '"SF Pro Display"',
          '"PingFang SC"',
          '"Hiragino Sans GB"',
          '"Microsoft YaHei"',
          'system-ui',
          'sans-serif'
        ],
        mono: ['ui-monospace', 'SFMono-Regular', 'Menlo', 'Monaco', 'Consolas', 'monospace']
      },
      boxShadow: {
        glass: '0 8px 32px rgba(0, 0, 0, 0.08)',
        'glass-sm': '0 4px 16px rgba(0, 0, 0, 0.06)',
        glow: '0 0 20px var(--primary-glow, rgba(20, 184, 166, 0.25))',
        'glow-lg': '0 0 40px var(--primary-glow-lg, rgba(20, 184, 166, 0.35))',
        card: '0 1px 3px rgba(0, 0, 0, 0.04), 0 6px 20px -2px rgba(0, 0, 0, 0.05)',
        'card-hover': '0 2px 6px rgba(0, 0, 0, 0.06), 0 14px 32px -4px rgba(0, 0, 0, 0.08)',
        'mac-card': '0 1px 3px rgba(0, 0, 0, 0.04), 0 8px 24px -4px rgba(0, 0, 0, 0.06)',
        'mac-card-hover': '0 4px 12px rgba(0, 0, 0, 0.06), 0 16px 36px -4px rgba(0, 0, 0, 0.1)',
        'mac-window': '0 24px 60px rgba(0, 0, 0, 0.16), 0 0 0 1px rgba(0, 0, 0, 0.06)',
        'mac-popover': '0 12px 36px -4px rgba(0, 0, 0, 0.18), 0 0 0 1px rgba(0, 0, 0, 0.05)',
        'inner-glow': 'inset 0 1px 0 rgba(255, 255, 255, 0.1)'
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-primary': 'var(--gradient-primary, linear-gradient(135deg, #14b8a6 0%, #0d9488 100%))',
        'gradient-dark': 'linear-gradient(135deg, #1e293b 0%, #0f172a 100%)',
        'gradient-glass':
          'linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)',
        'mesh-gradient':
          'radial-gradient(at 40% 20%, rgba(20, 184, 166, 0.12) 0px, transparent 50%), radial-gradient(at 80% 0%, rgba(6, 182, 212, 0.08) 0px, transparent 50%), radial-gradient(at 0% 50%, rgba(20, 184, 166, 0.08) 0px, transparent 50%)'
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'slide-in-right': 'slideInRight 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        shimmer: 'shimmer 2s linear infinite',
        glow: 'glow 2s ease-in-out infinite alternate'
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' }
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInRight: {
          '0%': { opacity: '0', transform: 'translateX(20px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        },
        glow: {
          '0%': { boxShadow: '0 0 20px rgba(20, 184, 166, 0.25)' },
          '100%': { boxShadow: '0 0 30px rgba(20, 184, 166, 0.4)' }
        }
      },
      backdropBlur: {
        xs: '2px'
      },
      borderRadius: {
        '4xl': '2rem'
      }
    }
  },
  plugins: []
}
