export default defineAppConfig({
  ui: {
    colors: {
      primary: "pink",
      neutral: "zinc",
      success: "green",
      warning: "yellow",
      error: "red",
      info: "blue",
      secondary: "cyan",
    },
    button: {
      defaultVariants: {
        variant: 'solid',
      }
    },
    input: {
      defaultVariants: {
        variant: 'outline',
      }
    },    
  },
});
