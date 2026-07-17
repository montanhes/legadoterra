export function brDateToIso(value: string): string | undefined {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return undefined

  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

export function isoDateToBr(value: string): string | undefined {
  const match = value.match(/^(\d{4})-(\d{2})-(\d{2})/)
  if (!match) return undefined

  const [, year, month, day] = match
  return `${day}/${month}/${year}`
}

export function isValidBrDate(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const [, day, month, year] = match.map(Number) as unknown as [never, number, number, number]
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}

export function parseBrDate(value: string): Date | undefined {
  if (!isValidBrDate(value)) return undefined

  const [day, month, year] = value.split('/').map(Number)
  return new Date(year, month - 1, day)
}

export function formatBrDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  return `${day}/${month}/${date.getFullYear()}`
}
