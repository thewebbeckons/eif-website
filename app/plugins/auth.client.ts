export default defineNuxtPlugin(() => {
  // Not awaited: the page renders right away and fills in once this resolves.
  void useAuth().refresh();
});
