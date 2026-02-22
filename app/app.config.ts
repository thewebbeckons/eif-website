export default defineAppConfig({
  ui: {
    colors: {
      primary: "pink",
      neutral: "stone",
    },
    button: {
      slots: {
        base: 'rounded-full shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-x-0.5 hover:-translate-y-0.5 active:shadow-xs active:translate-x-0 active:translate-y-0 border-2 border-gray-900 dark:border-stone-300'
      },
      compoundVariants: [
        {
          color: 'primary',
          variant: 'solid',
          class: 'bg-paladin-pink text-gray-900 hover:bg-paladin-pink/90'
        },
        {
          color: 'secondary',
          variant: 'solid',
          class: 'bg-loot-purple text-white hover:bg-loot-purple/90'
        },
        {
          color: 'success',
          variant: 'solid',
          class: 'bg-monk-green text-gray-900 hover:bg-monk-green/90'
        },
        {
          color: 'warning',
          variant: 'solid',
          class: 'bg-druid-orange text-gray-900 hover:bg-druid-orange/90'
        },
        {
          color: 'info',
          variant: 'solid',
          class: 'bg-mage-blue text-gray-900 hover:bg-mage-blue/90'
        },
        {
          color: 'neutral',
          variant: 'solid',
          class: 'bg-gray-900 text-white hover:bg-gray-800 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-200'
        },
        {
          color: 'neutral',
          variant: 'outline',
          class: 'bg-white/60 dark:bg-stone-900/60 backdrop-blur-sm'
        }
      ]
    },
    input: {
      defaultVariants: {
        variant: 'outline',
      }
    },
    blogPost: {
      slots: {
        root: 'group/blog-post rounded-3xl border-2 border-black dark:border-stone-600 bg-pink-50 dark:bg-stone-900 overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1',
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
            header: 'aspect-[16/9] bg-gradient-to-br from-pink-100 via-orange-50 to-yellow-100 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800',
          },
          vertical: {
            header: 'aspect-[4/3] bg-gradient-to-br from-blue-100 via-purple-50 to-pink-100 dark:from-stone-800 dark:via-stone-900 dark:to-stone-800',
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
