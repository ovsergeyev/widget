export const card = {
  root: {
    class: [
      //Color
      'bg-surface-0 dark:bg-surface-900',
      'text-surface-700 dark:text-surface-0'
    ]
    // background: '{content.background}',
    // borderRadius: '{border.radius.xl}',
    // color: '{content.color}',
    // shadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px -1px rgba(0, 0, 0, 0.1)'
  },
  body: {
    class: [
      //Flex
      'flex flex-col',
      'gap-4',

      'p-6'
    ]
    // padding: '1.25rem',
    // gap: '0.5rem'
  },
  caption: {
    gap: '0.5rem'
  },
  title: {
    fontSize: '1.25rem',
    fontWeight: '500'
  },
  subtitle: {
    color: '{text.muted.color}'
  }
};
