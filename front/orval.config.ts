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
      baseUrl: "http://localhost:3333",

      clean: true,
      biome: true,
    },

    hooks: {
      afterAllFilesWrite: "pnpm run format",
    },
  },
})
