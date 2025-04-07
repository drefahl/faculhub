import { defineConfig } from "orval"

export default defineConfig({
  api: {
    input: {
      target: "../api/swagger.json",
    },

    output: {
      target: "./lib/api/generated.ts",
      client: "react-query",
      mode: "tags-split",

      clean: true,
      biome: true,

      override: {
        mutator: {
          path: "./lib/utils/axios.ts",
          name: "makeRequest",
        },
      },
    },

    hooks: {
      afterAllFilesWrite: "pnpm run format",
    },
  },
})
