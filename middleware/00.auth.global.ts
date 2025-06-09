export default defineNuxtRouteMiddleware((to, from) => {
  const { loggedIn } = useUserSession();

  if (!loggedIn.value) {
    if (to.name == "login" || to.path == "/api/_auth/session")
      return;
    return navigateTo('/login');
  }
});
