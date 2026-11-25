import { UUID } from 'crypto'
import * as jwt from 'jwt-decode'
import type { Request, Response } from 'express'
import setUpCurrentUser from './setUpCurrentUser'
import logger from '../../logger'

jest.mock('../../logger')

type MiddlewareStack = Array<{ handle: (req: Request, res: Response, next: (error?: unknown) => void) => void }>

describe('setUpCurrentUser', () => {
  const token = 'some-token'
  const next = jest.fn()
  const jwtSpy = jest.spyOn(jwt, 'jwtDecode')

  const runMiddleware = (): Response => {
    const router = setUpCurrentUser() as unknown as { stack: MiddlewareStack }
    const middleware = router.stack[0].handle
    const req = { session: {}, state: {} } as unknown as Request
    const res = {
      locals: {
        user: {
          token,
        },
      },
    } as unknown as Response
    middleware(req, res, next)

    return res
  }

  beforeEach(() => {
    jest.resetAllMocks()
  })

  it('should populate res with decoded user details and call next', () => {
    const payload = {
      name: 'some name',
      user_id: 'some_name',
      user_uuid: '11111111-1111-1111-1111-111111111111' as UUID,
    }

    jwtSpy.mockReturnValue(payload)

    const res = runMiddleware()

    expect(res.locals.user).toEqual({
      token,
      userId: 'some_name',
      name: 'some name',
      displayName: 'Some Name',
      userUuid: '11111111-1111-1111-1111-111111111111',
      userRoles: [],
    })

    expect(jwtSpy).toHaveBeenCalledWith(token)
    expect(next).toHaveBeenCalled()
  })

  it('should populate res with decoded user roles and call next', () => {
    const payload = {
      authorities: ['ROLE_UPDATE_RECORD', 'ROLE_VIEW_RECORD'],
    }

    jwtSpy.mockReturnValue(payload)

    const res = runMiddleware()

    expect(res.locals.user).toEqual({
      token: res.locals.user.token,
      userRoles: ['UPDATE_RECORD', 'VIEW_RECORD'],
      displayName: '',
    })

    expect(next).toHaveBeenCalled()
  })

  it('logs any errors and calls next with the error', () => {
    const error = new Error('Error')

    jwtSpy.mockImplementation(() => {
      throw error
    })

    runMiddleware()

    expect(logger.error).toHaveBeenCalledWith(error, `Failed to populate user details for: undefined`)
    expect(next).toHaveBeenCalledWith(error)
  })
})
