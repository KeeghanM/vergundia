import { defineConfig } from "astro/config"
import tailwind from "@astrojs/tailwind"
import partytown from "@astrojs/partytown"

import node from "@astrojs/node"

export default defineConfig({
  adapter: node({
    mode: "standalone",
  }),
  integrations: [
    tailwind(),
    partytown({
      config: {
        debug: true,
      },
    }),
  ],
  output: "static",
})
