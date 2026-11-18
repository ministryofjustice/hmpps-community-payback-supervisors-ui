const popNameParts = new Set<string>()

const nonBlankString = (value: unknown): string | undefined =>
  typeof value === 'string' ? value.trim() || undefined : undefined

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null && !Array.isArray(value)

const collect = (value: unknown): void => {
  if (Array.isArray(value)) {
    value.forEach(collect)
    return
  }

  if (!isRecord(value)) return

  const forename = nonBlankString(value.forename) ?? nonBlankString(value.firstName)
  const surname = nonBlankString(value.surname) ?? nonBlankString(value.lastName)

  if (forename) popNameParts.add(forename)
  if (surname) popNameParts.add(surname)

  Object.values(value).forEach(collect)
}

export const recordPopNames = (mapping: Record<string, unknown>): void => collect(mapping.response)

export const clearPopNames = (): void => popNameParts.clear()

export default {
  getStubbedPopNameParts: (): Array<string> => Array.from(popNameParts),
}
