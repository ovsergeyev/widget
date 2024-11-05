export default {
  root: {
    class: [
      "w-full mx-auto bg-white rounded-xl shadow-md border border-solid border-border overflow-hidden flex-grow"
    ]
  },
  wrapDay: {
    class: [
      'md:flex p-3 [&:not(first)]:border-b-2 border-solid border-border last:border-b-0'
    ]
  },
  wrapTariffs: {
    class: [
      'pb-8 [&:not(:first-child)]:pt-4'
    ]
  }
}