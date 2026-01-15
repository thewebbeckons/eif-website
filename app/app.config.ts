export default defineAppConfig({
  ui: {
    colors: {
      primary: "pink",
      neutral: "stone",
    },
    button: {
      slots: {}
    },
    input: {
      defaultVariants: {
        variant: 'outline',
      }
    },
    blogPost: {
      slots: {
        root: 'group/blog-post rounded-3xl bg-pink-50 dark:bg-stone-900 overflow-hidden transition-all duration-300 hover:bg-pink-100 dark:hover:bg-stone-800',
        header: 'overflow-hidden',
        image: 'transition-transform duration-500 group-hover/blog-post:scale-110',
        body: 'p-6',
        title: 'font-heading font-black text-xl uppercase tracking-tight mb-2 text-gray-900 dark:text-stone-100',
        description: 'text-gray-500 dark:text-stone-400 font-medium leading-relaxed line-clamp-2',
        date: 'text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-stone-500 mb-4 block',
      },
      variants: {
        orientation: {
          horizontal: {
            header: 'aspect-[16/9] bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900',
          },
          vertical: {
            header: 'aspect-[4/3] bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-stone-900 dark:via-stone-800 dark:to-stone-900',
          }
        }
      }
    },
    blogPosts: {
      base: 'flex flex-col gap-8 lg:gap-12',
      variants: {
        orientation: {
          horizontal: 'sm:grid sm:grid-cols-2 lg:grid-cols-3',
          vertical: ''
        }
      }
    },
  },
});
