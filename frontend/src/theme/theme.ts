export const themeTokens = {
  colors: {
    primary: '#FF5C5C',
    secondary: '#7C5CFF',
    accent: '#22B8A7',
    background: '#F8FAFC',
    surface: '#FFFFFF',
    textPrimary: '#1F2937',
    textSecondary: '#6B7280',
    border: '#E5E7EB',
    error: '#EF4444',
    warning: '#F59E0B',
    success: '#10B981',
    info: '#3B82F6',
  },
  gradients: {
    headerPrimary: 'linear-gradient(135deg, #FF5C5C 0%, #7C5CFF 100%)',
    panelDark: 'linear-gradient(135deg, #1F2937 0%, #111827 100%)',
    softSurface: 'linear-gradient(135deg, #F8FAFC 0%, #E5E7EB 100%)',
  },
  typography: {
    fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
    h1: { fontSize: '1.5rem', fontWeight: 700, lineHeight: 1.3 },
    h2: { fontSize: '1.25rem', fontWeight: 600, lineHeight: 1.4 },
    h3: { fontSize: '1rem', fontWeight: 600, lineHeight: 1.5 },
    body1: { fontSize: '0.875rem', fontWeight: 400, lineHeight: 1.5 },
    body2: { fontSize: '0.75rem', fontWeight: 400, lineHeight: 1.5 },
    label: { fontSize: '0.75rem', fontWeight: 500, lineHeight: 1.5, textTransform: 'uppercase' as const, letterSpacing: '0.05em' },
  },
  radius: { 
    sm: '8px',
    md: '12px', 
    lg: '16px',
    full: '9999px',
  },
  spacing: {
    xs: '4px',
    sm: '8px',
    md: '16px',
    lg: '24px',
    xl: '32px',
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
  },
};

export type ThemeTokens = typeof themeTokens;