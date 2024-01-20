export default defineNuxtRouteMiddleware(async (to, from) => {
  const user = useUser();
  if (!user.value && to.path === "/maps/mapsonly")
    return navigateTo("/login", { replace: true });
});
