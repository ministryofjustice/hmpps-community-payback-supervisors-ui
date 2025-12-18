import { jwtDecode } from 'jwt-decode'
import type { RequestHandler } from 'express'

import logger from '../../logger'
import SupervisorService from '../services/supervisorService'
import { dataAccess } from '../data'

export default function authorisationMiddleware(authorisedRoles: string[] = []): RequestHandler {
  return async (req, res, next) => {
    // authorities in the user token will always be prefixed by ROLE_.
    // Convert roles that are passed into this function without the prefix so that we match correctly.
    const authorisedAuthorities = authorisedRoles.map(role => (role.startsWith('ROLE_') ? role : `ROLE_${role}`))
    if (res.locals?.user?.token) {
      const { authorities: roles = [], user_name: userName } = jwtDecode(res.locals.user.token) as {
        authorities?: string[]
        user_name: string
      }

      const { isUnpaidWorkTeamMember } = (await new SupervisorService(dataAccess().supervisorClient).getSupervisor(
        userName,
      )) as { isUnpaidWorkTeamMember: boolean }

      if (
        !isUnpaidWorkTeamMember ||
        (authorisedAuthorities.length && !roles.some(role => authorisedAuthorities.includes(role)))
      ) {
        logger.error('User is not authorised to access this')
        return res.redirect('/authError')
      }

      return next()
    }

    req.session.returnTo = req.originalUrl
    return res.redirect('/sign-in')
  }
}
