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
      slots: {}
    },
    input: {
      defaultVariants: {
        variant: 'outline',
      }
    },    
  },
});
