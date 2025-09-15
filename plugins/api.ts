import type { $Fetch, NitroFetchRequest } from "nitropack";

declare module "#app" {
  interface NuxtApp {
    $api: $Fetch<any, NitroFetchRequest>;
  }
}

export default defineNuxtPlugin((nuxtApp) => {
  const api = $fetch.create({
    baseURL: import.meta.client ? "/" : "localhost:3000/",
    onRequest({ request, options, error }) {},
    onResponseError({ response }) {
      // createAlert(response._data, LocalAlertTypes.ERROR);
    },
  });

  return {
    provide: {
      api,
    },
  };
});
