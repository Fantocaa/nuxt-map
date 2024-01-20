import type { UseFetchOptions } from "nuxt/app";

export function useLarafetch<T>(
  url: string | (() => string),
  options: UseFetchOptions<T> = {}
) {
  return useFetch(url, {
    $fetch: $larafetch,
    async onResponseError({ response }) {
      // await useFetch("http://localhost:8000/sanctum/csrf-cookie");
      const status = response.status;
      if ([500].includes(status)) {
        console.error("[Laravel Error]", response.statusText, response._data);
      }

      if ([401, 419].includes(status)) {
        navigateTo("/login");
      }

      if ([409].includes(status)) {
        navigateTo("/verify-email");
      }
    },
    ...options,
  });
}
