// https://nuxt.com/docs/api/configuration/nuxt-config
import { FileSystemIconLoader } from "unplugin-icons/loaders";
import IconsResolver from "unplugin-icons/resolver";
import Icons from "unplugin-icons/vite";
import ViteComponents from "unplugin-vue-components/vite";

export default defineNuxtConfig({
  compatibilityDate: "2025-05-15",
  devtools: {
    enabled: true,
  },

  modules: [
    "@nuxt/ui",
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "storeToRefs"],
      },
    ],
    "unplugin-icons/nuxt",
  ],
  css: [
    "@rds-vue-ui/rds-theme-base/dist/css/rds-theme-base.css",
    "~/assets/main.scss",
  ],
  components: [
    { path: "~/components" },
    {
      path: "~/node_modules/@rds-vue-ui/",
      ignore: ["**/index.ts", "**/index.js"],
    },
  ],
  vite: {
    plugins: [
      ViteComponents({
        resolvers: [
          IconsResolver({
            prefix: "i",
            customCollections: ["custom"],
          }),
        ],
      }),
      Icons({
        customCollections: {
          custom: FileSystemIconLoader("assets/custom"),
        },
      }),
    ],
  },
});
