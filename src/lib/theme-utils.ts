// Removed database dependencies - using static theme configuration

interface ThemeSettings {
  primary_color: string;
  secondary_color: string;
  font_family: string;
  header_style: string;
  footer_style: string;
  custom_css: string;
}

// Helper function to create a ThemeSettingsConfig object from localStorage or default values
export function parseThemeSettings(data: any): ThemeSettings {
  // If it's already in the correct format, return it
  if (
    typeof data === 'object' && 
    data !== null && 
    'primary_color' in data &&
    'secondary_color' in data &&
    'font_family' in data
  ) {
    return data as ThemeSettings;
  }
  
  // Fallback to default theme settings
  return {
    primary_color: '#8B0000',
    secondary_color: '#FFD700',
    font_family: 'Inter, sans-serif',
    header_style: 'standard',
    footer_style: 'standard',
    custom_css: ''
  };
}

// Apply theme settings to the document
export function applyThemeSettings(settings: ThemeSettings): void {
  // Apply colors to CSS variables
  document.documentElement.style.setProperty('--primary-color', settings.primary_color);
  document.documentElement.style.setProperty('--secondary-color', settings.secondary_color);
  
  // Apply font family
  if (settings.font_family) {
    document.documentElement.style.setProperty('--font-family', settings.font_family);
  }
  
  // Apply custom CSS if provided
  if (settings.custom_css) {
    let customStyleElement = document.getElementById('custom-theme-css');
    
    if (!customStyleElement) {
      customStyleElement = document.createElement('style');
      customStyleElement.id = 'custom-theme-css';
      document.head.appendChild(customStyleElement);
    }
    
    customStyleElement.textContent = settings.custom_css;
  }
}