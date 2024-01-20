import { defineNuxtConfig } from "nuxt/config";

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  modules: ["@nuxtjs/tailwindcss", "@pinia/nuxt"],
  runtimeConfig: {
    public: {
      backendUrl: "http://localhost:8000",
      frontendUrl: "http://localhost:3000",
    },
  },
  imports: {
    dirs: ["./utils"],
  },
  experimental: {
    asyncContext: true,
  },
  alias: {
    pinia: "/node_modules/@pinia/nuxt/node_modules/pinia/dist/pinia.mjs"
  },
  app: {
    head: {
      title: "Map Test",
      meta: [
        { charset: "utf-8" },
        {
          name: "viewport",
          content: "width=device-width, initial-width, initial-scale=1",
        },
      ],
      link: [],
      script: [
        {
          src: "https://code.jquery.com/jquery-3.7.1.js",
          type: "text/javascript",
        },
        // {
        //   src: "https://maps.googleapis.com/maps/api/js?key=AIzaSyD2dASx5Zo68GSyZuPjUs-4SBLYGsn4OPQ&libraries=places&callback=initAutocomplete&libraries=places&v=weekly",
        //   type: 'text/javascript',
        // }
      ],
    },
  },
  build: {
    // extractCSS: true,
    transpile: [
      "vue-google-maps-community-fork",
      "@googlemaps/markercluster",
      "@fawmi/vue-google-maps",
      "fast-deep-equal",
    ],
  },
});