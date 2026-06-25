export const theme = {
  colors: {
    background: '#1A1A1A', // Dark grey/black for Eldritch horror feel
    surface: '#2C2C2C', // Slightly lighter grey for cards
    primary: '#1F8A70', // Emerald/Eldritch green
    secondary: '#8B0000', // Blood red for health/wounds
    text: '#E0E0E0', // Off-white for readability
    textMuted: '#A0A0A0', // Muted text for secondary info
    border: '#3D3D3D',
    gold: '#D4AF37', // Vintage gold accent
  },
  spacing: {
    xs: 4,
    s: 8,
    m: 16,
    l: 24,
    xl: 32,
  },
  typography: {
    // We'll use system fonts for simplicity in the prototype,
    // but styling them to look more vintage/serif where possible.
    fontFamilyPrimary: 'System', // Would ideally be a Serif font like 'Playfair Display'
    fontFamilySecondary: 'System', // Would ideally be a Monospace/Typewriter font
    sizes: {
      small: 12,
      body: 16,
      h3: 20,
      h2: 24,
      h1: 32,
    },
  },
};
