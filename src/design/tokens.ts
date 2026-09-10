export const tokens = {
  colors: {
    cream: '#F7F3EB',
    creamDeep: '#EFE8DC',
    espresso: '#382C2A',
    espresso70: '#6B5A56',
    espresso40: '#A99B96',
    terracotta: '#E27D60',
    clay: '#C96A4E',
    sand: '#E8DCC8',
    risk: {
      normal: '#6E8B5E', // moss
      watch: '#C9A227',  // ochre
      high: '#D97742',   // burnt orange
      critical: '#A63A28', // deep rust
      zoonotic: '#7B2D26'  // oxblood
    }
  },
  typography: {
    family: "'Montserrat', sans-serif",
  },
  spacing: {
    sectionPadDesktop: '112px',
    contentGutter: '64px',
  }
} as const;
