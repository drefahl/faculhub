import { type FormatDistanceToNowOptions, formatDistanceToNow as _formatDistanceToNow } from "date-fns"
import { ptBR } from "date-fns/locale"

export function formatDistanceToNow(
  date: Date | number | string,
  options: FormatDistanceToNowOptions = { addSuffix: true, locale: ptBR },
): string {
  const parsedDate = typeof date === "string" ? new Date(date) : date
  return _formatDistanceToNow(parsedDate, options)
}
