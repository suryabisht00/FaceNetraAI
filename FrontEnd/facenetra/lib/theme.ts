export const theme = {
  colors: {
    primary: '#ff6a00',
    background: {
      light: '#0B0F1A',
      dark: '#0B0F1A',
    },
    text: {
      primary: '#FFFFFF',
      secondary: '#E5E7EB',
      muted: 'rgba(229, 231, 235, 0.7)',
    },
    border: {
      primary: 'rgba(255, 106, 0, 0.2)',
      primaryHover: '#ff6a00',
    },
    glassmorphism: {
      background: 'rgba(40, 32, 27, 0.25)',
      border: 'rgba(255, 106, 0, 0.2)',
    },
  },
  effects: {
    neonGlow: '0 0 5px #ff6a00, 0 0 10px rgba(255, 106, 0, 0.7), 0 0 15px rgba(255, 106, 0, 0.5)',
    neonGlowSubtle: '0 0 2px rgba(255, 106, 0, 0.8), 0 0 5px rgba(255, 106, 0, 0.5)',
    neonGlowBorder: '0 0 10px #ff6a00, 0 0 20px rgba(255, 106, 0, 0.7), 0 0 30px rgba(255, 106, 0, 0.5), inset 0 0 5px rgba(255, 106, 0, 0.6)',
  },
} as const;
