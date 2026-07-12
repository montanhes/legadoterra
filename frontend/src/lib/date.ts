export function brDateToIso(value: string): string | undefined {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return undefined

  const [, day, month, year] = match
  return `${year}-${month}-${day}`
}

export function isValidBrDate(value: string): boolean {
  const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/)
  if (!match) return false

  const [, day, month, year] = match.map(Number) as unknown as [never, number, number, number]
  const date = new Date(year, month - 1, day)

  return date.getFullYear() === year && date.getMonth() === month - 1 && date.getDate() === day
}
