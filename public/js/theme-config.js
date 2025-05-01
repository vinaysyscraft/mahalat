// Common theme configuration
window.themeConfig = {
  colors: {
    primary: '#4B5945', // Primary Color
  }
};

// Update Tailwind configuration
if (window.tailwind) {
  tailwind.config = {
    darkMode: 'class',
    theme: {
      extend: {
        colors: {
          primary: '#4B5945', // Primary Color
        }
      },
    },
  };
} 