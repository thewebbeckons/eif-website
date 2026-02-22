export default defineAppConfig({
  ui: {
    colors: {
      primary: "violet",
      neutral: "stone",
    },
    button: {
      slots: {
        base: 'font-black uppercase border-4 border-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] transition-all duration-150 ease-in-out hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] active:translate-x-[4px] active:translate-y-[4px] active:shadow-none'
      }
    },
    input: {
      defaultVariants: {
        variant: 'outline',
      }
    },
    navigationMenu: {
      slots: {
        list: 'gap-3',
        link: 'font-black !text-white uppercase border-2 border-transparent transition-all duration-150 ease-in-out hover:border-black hover:!bg-[var(--ui-primary)] hover:!text-black hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none before:hidden',
        childLink: 'font-black !text-white uppercase border-2 border-transparent transition-all duration-150 ease-in-out hover:border-black hover:!bg-[var(--ui-primary)] hover:!text-black hover:-translate-y-[2px] hover:-translate-x-[2px] hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] active:translate-x-0 active:translate-y-0 active:shadow-none before:hidden'
      },
      variants: {
        active: {
          true: {
            link: 'border-black !bg-[var(--ui-primary)] !text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px] -translate-x-[2px]',
            childLink: 'border-black !bg-[var(--ui-primary)] !text-black shadow-[4px_4px_0px_0px_rgba(0,0,0,1)] -translate-y-[2px] -translate-x-[2px]'
          }
        }
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
