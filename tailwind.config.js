/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // ========== 1. 自定义背景颜色 ==========
      backgroundColor: {
        // 主背景色
        'main': '#020C24',
        'secondary': '#0C1B39',
      },

      // ========== 2. 自定义文字颜色 ==========
      textColor: {
        // 主要文字色
        'primary': '#0f172a',       // 深蓝色
        'secondary': '#475569',     // 灰色
        'light': '#ffffff',         // 白色
        'accent': '#3b82f6',        // 蓝色
        'success': '#10b981',       // 绿色
        'warning': '#f59e0b',       // 橙色
        'error': '#ef4444',         // 红色
        'muted': '#94a3b8',         // 浅灰色
        'link': '#2563eb',          // 链接蓝色
      },

      // ========== 3. 自定义字体大小 ==========
      fontSize: {
        // 扩展小字体
        'xs': '0.75rem',     // 12px
        'sm': '0.875rem',    // 14px
        'base': '1rem',      // 16px
        'lg': '1.125rem',    // 18px
        'xl': '1.25rem',     // 20px
        '2xl': '1.5rem',     // 24px
        '3xl': '1.875rem',   // 30px
        '4xl': '2.25rem',    // 36px
        '5xl': '3rem',       // 48px

        // 自定义字体大小
        'h1': ['2.5rem', { lineHeight: '3rem' }],     // 40px
        'h2': ['2rem', { lineHeight: '2.5rem' }],     // 32px
        'h3': ['1.75rem', { lineHeight: '2.25rem' }], // 28px
        'h4': ['1.5rem', { lineHeight: '2rem' }],     // 24px
        'h5': ['1.25rem', { lineHeight: '1.75rem' }], // 20px
        'h6': ['1rem', { lineHeight: '1.5rem' }],     // 16px
      },
    },
  },
  plugins: [],
}