import { defineNuxtPlugin } from "#app";
// import VueGoogleMaps from "vue-google-maps-community-fork";
import VueGoogleMaps from "@fawmi/vue-google-maps"

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(VueGoogleMaps, {
    load: {
      key: "AIzaSyD2dASx5Zo68GSyZuPjUs-4SBLYGsn4OPQ",
      libraries: "places", // This is required if you use the Autocomplete plugin
    },
    autobindAllEvents: true,
  });
});
