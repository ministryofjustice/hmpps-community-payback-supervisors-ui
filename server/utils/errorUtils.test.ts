/* eslint-disable */

import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { HTTPError } from 'superagent'
import { createMock } from '@golevelup/ts-jest'
import {
  catchApiValidationErrorOrPropagate,
  errorHasStatus,
  generateErrorSummary,
  generateErrorTextList,
  getErrorStatus,
} from './errorUtils'
import type { Request, Response } from 'express'
import { ErrorResponse } from '../@types/shared'

describe('errorUtils', () => {
  describe('generateErrorSummary', () => {
    it('generates an error summary', () => {
      const validationErrors = {
        selectField: {
          text: 'Select an answer',
        },
        inputField: {
          text: 'Provide an answer',
        },
      }

      expect(generateErrorSummary(validationErrors)).toEqual([
        {
          text: 'Select an answer',
          href: '#selectField',
          attributes: {
            'data-cy-error-selectField': 'Select an answer',
          },
        },
        {
          text: 'Provide an answer',
          href: '#inputField',
          attributes: {
            'data-cy-error-inputField': 'Provide an answer',
          },
        },
      ])
    })
  })

  describe('generateErrorTextList', () => {
    it('returns a list of GOV.UK error summary text errors if any errors', () => {
      const errors = ['Error 1', 'Error 2']
      const result = generateErrorTextList(errors)

      expect(result).toEqual([{ text: 'Error 1' }, { text: 'Error 2' }])
    })

    it('returns undefined if errors are empty', () => {
      const result = generateErrorTextList([])

      expect(result).toBeUndefined()
    })

    it.each([null, undefined])('returns undefined if passed null or undefined', (list?: Array<string>) => {
      const result = generateErrorTextList(list)
      expect(result).toBeUndefined()
    })
  })

  const errorWithStatus: HTTPError = createMock<HTTPError>({
    status: 404,
  })

  const errorWithResponseStatus: SanitisedError = createMock<SanitisedError>({
    responseStatus: 500,
  })

  const errorWithNeither = {}

  describe('getErrorStatus', () => {
    it.each([
      ['Error with status', errorWithStatus, 404],
      ['Error with responseStatus', errorWithResponseStatus, 500],
      ['Error with neither', errorWithNeither, undefined],
    ])('Gets the correct error code: %s', (_, err, expected) => {
      expect(getErrorStatus(err as any)).toEqual(expected)
    })
  })

  describe('errorHasStatus', () => {
    it.each([
      ['Error with status: true', errorWithStatus, 404, true],
      ['Error with status: false', errorWithStatus, 500, false],
      ['Error with responseStatus: true', errorWithResponseStatus, 500, true],
      ['Error with responseStatus: false', errorWithResponseStatus, 404, false],
      ['Error with neither', errorWithNeither, 400, false],
    ])('Returns true/false depending on whether error has a status: %s', (_, err, status, expected) => {
      expect(errorHasStatus(err as any, status)).toEqual(expected)
    })
  })

  describe('catchApiValidationErrorOrPropagate', () => {
    const referer = 'foo/bar'
    let request = createMock<Request>()
    let response = createMock<Response>()

    beforeEach(() => {
      jest.resetAllMocks()
    })

    it('populates the error and redirects to the previous page if the API finds an error', () => {
      const userMessage = 'Some error'
      const error: SanitisedError<ErrorResponse> = {
        responseStatus: 400,
        data: {
          userMessage,
          developerMessage: '',
          status: 400,
        },
        name: 'Bad request',
        message: userMessage,
      }

      catchApiValidationErrorOrPropagate(request, response, error, referer)

      expect(request.flash).toHaveBeenCalledWith('error', userMessage)
      expect(response.redirect).toHaveBeenCalledWith(referer)
    })

    it.each([undefined, null, ''])(
      'throws error when responseStatus is 400 but userMessage is %s',
      (userMessage?: string | null) => {
        const error: SanitisedError<ErrorResponse> = {
          responseStatus: 400,
          data: {
            userMessage,
            developerMessage: '',
            status: 400,
          },
          name: 'Bad request',
          message: 'error message',
        }

        expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
        expect(request.flash).not.toHaveBeenCalled()
        expect(response.redirect).not.toHaveBeenCalled()
      },
    )

    it.each([undefined, null])(
      'throws error when responseStatus is 400 but data is %s',
      (data?: ErrorResponse | null) => {
        const error: SanitisedError<ErrorResponse> = {
          responseStatus: 400,
          data: data as any,
          name: 'Bad request',
          message: 'error message',
        }

        expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
        expect(request.flash).not.toHaveBeenCalled()
        expect(response.redirect).not.toHaveBeenCalled()
      },
    )

    it.each([500, undefined])('throws error when responseStatus is %s', (responseStatus: number) => {
      const error: SanitisedError<ErrorResponse> = {
        responseStatus: responseStatus,
        data: {
          userMessage: undefined,
          developerMessage: '',
          status: responseStatus,
        },
        name: 'error',
        message: 'error message',
      }

      expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
      expect(request.flash).not.toHaveBeenCalled()
      expect(response.redirect).not.toHaveBeenCalled()
    })
  })
})
