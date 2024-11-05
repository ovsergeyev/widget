export default {
    root: ({ state }) => ({
        class: [
            // Shape
            'rounded-lg',
            'shadow-lg',
            'border-0',

            'z-[9999]',

            // Size
            'max-h-[90vh]',
            'max-w-[36rem]',
            'md:max-w-[44rem]',
            'm-4',

            // Color
            'bg-surface-0 dark:bg-surface-900',
            // '[&:last-child]:border-b',
            // 'border-surface-200 dark:border-surface-700',
            '!bg-white',

            // Transitions
            'transform',
            'scale-100',

            // Maximized State
            {
                'transition-none': state.maximized,
                'transform-none': state.maximized,
                '!w-screen': state.maximized,
                '!h-screen': state.maximized,
                '!max-h-full': state.maximized,
                '!top-0': state.maximized,
                '!left-0': state.maximized
            }
        ]
    }),
    header: {
        class: [
            // Flexbox and Alignment
            'flex items-center justify-between',
            'shrink-0',

            // Spacing
            'p-6',

            // Shape
            'rounded-tl-lg',
            'rounded-tr-lg',

            // Colors
            'text-text-primary'
            // 'text-surface-700 dark:text-surface-0/80',
            // 'border border-b-0',
            // 'border-surface-200 dark:border-surface-700'
        ]
    },
    title: {
        class: ['font-semibold text-xl leading-[normal]']
    },
    headerActions: {
        class: ['flex items-center']
    },
    content: ({ state, instance }) => ({
        class: [
            // Spacing
            'px-6',
            'pb-6',
            'pt-0',

            // Shape
            {
                grow: state.maximized,
                'rounded-bl-lg': !instance.$slots.footer,
                'rounded-br-lg': !instance.$slots.footer
            },

            // Colors
            'text-text-primary',
            // 'text-surface-700 dark:text-surface-0/80',
            // 'border border-t-0 border-b-0',
            // 'border-surface-200 dark:border-surface-700',

            // Misc
            'overflow-y-auto'
        ]
    }),
    footer: {
        class: [
            // Flexbox and Alignment
            'flex items-center justify-end',
            'shrink-0',
            'text-right',
            'gap-2',

            // Spacing
            'px-6',
            'pb-6',

            // Shape
            'border-t-0',
            'rounded-b-lg',

            // Colors
            'bg-surface-0 dark:bg-surface-900',
            'text-surface-700 dark:text-surface-0/80',
            'border border-t-0 border-b-0',
            'border-surface-200 dark:border-surface-700'
        ]
    },
    mask: ({ props }) => ({
        class: [
            // Transitions
            'transition-all',
            'duration-300',
            '!z-[9999]',
            { 'p-5': !props.position == 'full' },

            // Background and Effects
            { 'has-[.mask-active]:bg-transparent bg-black/40': props.modal }
        ]
    }),
    transition: ({ props }) => {
        return props.position === 'top'
            ? {
                  enterFromClass: 'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75 translate-x-0 -translate-y-full translate-z-0 mask-active'
              }
            : props.position === 'bottom'
            ? {
                  enterFromClass: 'opacity-0 scale-75 translate-y-full mask-active',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75 translate-x-0 translate-y-full translate-z-0 mask-active'
              }
            : props.position === 'left' || props.position === 'topleft' || props.position === 'bottomleft'
            ? {
                  enterFromClass: 'opacity-0 scale-75 -translate-x-full translate-y-0 translate-z-0 mask-active',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75  -translate-x-full translate-y-0 translate-z-0 mask-active'
              }
            : props.position === 'right' || props.position === 'topright' || props.position === 'bottomright'
            ? {
                  enterFromClass: 'opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75 translate-x-full translate-y-0 translate-z-0 mask-active'
              }
            : {
                  enterFromClass: 'opacity-0 scale-75 mask-active',
                  enterActiveClass: 'transition-all duration-200 ease-out',
                  leaveActiveClass: 'transition-all duration-200 ease-out',
                  leaveToClass: 'opacity-0 scale-75 mask-active'
              };
    }
};
