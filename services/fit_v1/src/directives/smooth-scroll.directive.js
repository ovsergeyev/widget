export default {
  mounted(el, binding) {
    el.addEventListener('click', () => {
      const targetEl = document.querySelector(binding.value);
      if (targetEl) {
        targetEl.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
      }
    });
  },
};