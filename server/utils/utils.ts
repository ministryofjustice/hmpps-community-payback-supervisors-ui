import type { Response } from 'express'
import qs, { IStringifyOptions } from 'qs'

const properCase = (word: string): string =>
  word.length >= 1 ? word[0].toUpperCase() + word.toLowerCase().slice(1) : word

const isBlank = (str: string): boolean => !str || /^\s*$/.test(str)

/**
 * Converts a name (first name, last name, middle name, etc.) to proper case equivalent, handling double-barreled names
 * correctly (i.e. each part in a double-barreled is converted to proper case).
 * @param name name to be converted.
 * @returns name converted to proper case.
 */
const properCaseName = (name: string): string => (isBlank(name) ? '' : name.split('-').map(properCase).join('-'))

export const convertToTitleCase = (sentence: string): string =>
  isBlank(sentence) ? '' : sentence.split(' ').map(properCaseName).join(' ')

export const initialiseName = (fullName?: string): string | null => {
  // this check is for the authError page
  if (!fullName) return null

  const array = fullName.split(' ')
  return `${array[0][0]}. ${array.reverse()[0]}`
}

export const notFound = (res: Response) => {
  res.status(404)
  return res.render('pages/error', {
    message: 'Page not found',
    status: 404,
  })
}

const inflections = {
  plural: {
    person: 'people',
  } as Record<string, string>,
}

export const pluralise = (str: string, count: number, suffix: string = 's') => {
  if (count === 1) {
    return str
  }
  return inflections.plural[str] ?? `${str}${suffix}`
}

export const createQueryString = (
  params: Record<string, unknown> | string,
  options: IStringifyOptions = { encode: false, indices: false },
): string => {
  return qs.stringify(params, options)
}

export const pathWithQuery = (
  path: string,
  params: Record<string, string>,
  options: IStringifyOptions = { encode: false, indices: false },
) => {
  const [basePath, pathParams = ''] = path.split('?')
  const queryString = createQueryString({ ...qs.parse(pathParams), ...params }, options)
  return `${basePath}?${queryString}`
}
