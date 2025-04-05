/**
 * Converte uma string em um slug.
 *
 * @param text - A string a ser convertida.
 * @returns Um slug gerado a partir da string fornecida.
 */
export function slugify(text: string): string {
  return text
    .toString()
    .normalize("NFD") // Remove acentos
    .replace(/\p{M}/gu, "") // Remove marcas diacríticas
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9 -]/g, "") // Remove caracteres inválidos
    .replace(/\s+/g, "-") // Substitui espaços por hífens
    .replace(/-+/g, "-") // Remove múltiplos hífens
}

export const RE_DIGIT = /^\d+$/

export const capitalize = (str: string) => str.charAt(0).toUpperCase() + str.slice(1)

/**
 * Insere hífens antes de letras maiúsculas (exceto no início) e converte a string para minúsculas.
 *
 * @param str - A string a ser transformada.
 * @returns A string transformada em kebab-case.
 */
export const toKebabCase = (str: string): string => str.replace(/(?<!^)[A-Z]/g, "-$&").toLowerCase()

export function jsonPrettify(json: string, spaces = 2): string {
  if (!json) return json

  try {
    return JSON.stringify(JSON.parse(json), null, spaces)
  } catch (e) {
    return json
  }
}

export function serializeQueryParams(params: Record<string, any>, prefix = ""): string[] {
  return Object.entries(params).reduce((acc: string[], [key, value]) => {
    const formattedKey = prefix ? `${prefix}[${key}]` : key

    if (value === null || value === undefined) {
      return acc
    }

    if (Array.isArray(value)) {
      return [...acc, ...value.map((item) => `${formattedKey}[]=${encodeURIComponent(String(item))}`)]
    }

    if (typeof value === "object") {
      return [...acc, ...serializeQueryParams(value, formattedKey)]
    }

    return [...acc, `${formattedKey}=${encodeURIComponent(String(value))}`]
  }, [])
}

export function serializeQueryParamsToString(params: Record<string, any>): string {
  return serializeQueryParams(params).join("&")
}

export function toBase64(data: string | Record<string, any>): string {
  if (typeof data === "string") return btoa(data)
  return btoa(JSON.stringify(data))
}

export function fromBase64(data: string): string | Record<string, any> {
  try {
    return JSON.parse(atob(data))
  } catch (e) {
    return atob(data)
  }
}

export function parseJson(json: string): Record<string, any> {
  try {
    return JSON.parse(json)
  } catch (e) {
    return {}
  }
}
