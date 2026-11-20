/* eslint-disable */

import { SanitisedError } from '@ministryofjustice/hmpps-rest-client'
import { HTTPError } from 'superagent'
import { createMock } from '@golevelup/ts-jest'
import {
  catchApiValidationErrorOrPropagate,
  getApiIssueMessages,
  errorHasStatus,
  generateErrorSummary,
  generateErrorTextList,
  getErrorStatus,
} from './errorUtils'
import type { Request, Response } from 'express'
import { ApiResponseIssue, ErrorResponse } from '../@types/shared'
import errorResponseFactory from '../testutils/factories/errorResponseFactory'

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

  describe('getApiIssueMessages', () => {
    it('returns the data.message of each issue', () => {
      const issues: Array<ApiResponseIssue> = [
        { field: '', code: 'FIRST', data: { message: 'First message' } },
        { field: '', code: 'SECOND', data: { message: 'Second message' } },
      ]

      expect(getApiIssueMessages(issues)).toEqual(['First message', 'Second message'])
    })

    it('ignores issues without a message', () => {
      const issues: Array<ApiResponseIssue> = [
        { field: '', code: 'NO_DATA', data: undefined },
        { field: '', code: 'NO_MESSAGE', data: { startTime: '09:00' } },
        { field: '', code: 'EMPTY_MESSAGE', data: { message: '' } },
        { field: '', code: 'MESSAGE', data: { message: 'A message' } },
      ]

      expect(getApiIssueMessages(issues)).toEqual(['A message'])
    })

    it.each([undefined, []])('returns an empty array when issues are %s', (issues?: Array<ApiResponseIssue>) => {
      expect(getApiIssueMessages(issues)).toEqual([])
    })
  })

  describe('catchApiValidationErrorOrPropagate', () => {
    const referer = 'foo/bar'
    let request = createMock<Request>()
    let response = createMock<Response>()

    const issue = (message?: string): ApiResponseIssue => ({
      field: '',
      code: 'SOME_CODE',
      data: message === undefined ? {} : { message },
    })

    const badRequest = (data: Partial<ErrorResponse>): SanitisedError<ErrorResponse> => ({
      responseStatus: 400,
      data: errorResponseFactory.build(data),
      name: 'Bad request',
      message: 'error message',
    })

    beforeEach(() => {
      jest.resetAllMocks()
      request = createMock<Request>()
      response = createMock<Response>()
    })

    it('flashes the message of every error and redirects to the given path', () => {
      const error = badRequest({ errors: [issue('First error'), issue('Second error')] })

      catchApiValidationErrorOrPropagate(request, response, error, referer)

      expect(request.flash).toHaveBeenCalledTimes(1)
      expect(request.flash).toHaveBeenCalledWith('error', ['First error', 'Second error'])
      expect(response.redirect).toHaveBeenCalledWith(referer)
    })

    it('flashes only the errors when there are both errors and warnings', () => {
      const error = badRequest({ errors: [issue('An error')], warnings: [issue('A warning')] })

      catchApiValidationErrorOrPropagate(request, response, error, referer)

      expect(request.flash).toHaveBeenCalledTimes(1)
      expect(request.flash).toHaveBeenCalledWith('error', ['An error'])
      expect(response.redirect).toHaveBeenCalledWith(referer)
    })

    it('flashes the message of every warning when there are no errors', () => {
      const error = badRequest({ errors: [], warnings: [issue('First warning'), issue('Second warning')] })

      catchApiValidationErrorOrPropagate(request, response, error, referer)

      expect(request.flash).toHaveBeenCalledTimes(1)
      expect(request.flash).toHaveBeenCalledWith('warning', ['First warning', 'Second warning'])
      expect(response.redirect).toHaveBeenCalledWith(referer)
    })

    it('throws error when responseStatus is 400 but no error or warning has a message, even if there is a userMessage', () => {
      const error = badRequest({ errors: [issue()], warnings: [issue()], userMessage: 'Some error' })

      expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
      expect(request.flash).not.toHaveBeenCalled()
      expect(response.redirect).not.toHaveBeenCalled()
    })

    it('throws error when responseStatus is 400 but there are no errors or warnings', () => {
      const error = badRequest({ errors: [], warnings: [] })

      expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
      expect(request.flash).not.toHaveBeenCalled()
      expect(response.redirect).not.toHaveBeenCalled()
    })

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
        responseStatus,
        data: errorResponseFactory.build({ errors: [issue('An error')], status: responseStatus }),
        name: 'error',
        message: 'error message',
      }

      expect(() => catchApiValidationErrorOrPropagate(request, response, error, referer)).toThrow(error)
      expect(request.flash).not.toHaveBeenCalled()
      expect(response.redirect).not.toHaveBeenCalled()
    })
  })
})
