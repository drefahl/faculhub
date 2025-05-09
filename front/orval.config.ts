import { defineConfig } from "orval"

const SWAGGER_PATH = "../api/swagger.json"

const FORMAT_HOOK = {
  afterAllFilesWrite: "pnpm run format",
} as const

export default defineConfig({
  reactQuery: {
    input: { target: SWAGGER_PATH },

    output: {
      target: "./lib/api/react-query/generated.ts",
      mode: "tags",

      client: "react-query",

      override: {
        mutator: {
          path: "./lib/utils/axios.ts",
          name: "request",
        },
      },

      clean: true,
      biome: true,
    },

    hooks: FORMAT_HOOK,
  },

  api: {
    input: { target: SWAGGER_PATH },

    output: {
      target: "./lib/api/axios/generated.ts",
      mode: "tags",

      client: "axios-functions",

      override: {
        mutator: {
          path: "./lib/utils/axios.ts",
          name: "requestSafe",
        },
      },

      clean: true,
      biome: true,
    },

    hooks: FORMAT_HOOK,
  },
})
