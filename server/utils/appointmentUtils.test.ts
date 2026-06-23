import { contactOutcomeFactory } from '../testutils/factories/contactOutcomeFactory'
import AppointmentUtils from './appointmentUtils'

describe('AppointmentUtils', () => {
  describe('getStatusColour', () => {
    it('returns teal colour when outcome is not enforceable', () => {
      const contactOutcome = contactOutcomeFactory.build({ enforceable: false, attended: true })

      const result = AppointmentUtils.getStatusColour(contactOutcome)

      expect(result).toBe('teal')
    })

    it('returns yellow colour when attended and enforceable', () => {
      const contactOutcome = contactOutcomeFactory.build({ attended: true, enforceable: true })

      const result = AppointmentUtils.getStatusColour(contactOutcome)

      expect(result).toBe('yellow')
    })

    it('returns red colour when not attended and enforceable', () => {
      const contactOutcome = contactOutcomeFactory.build({ attended: false, enforceable: true })

      const result = AppointmentUtils.getStatusColour(contactOutcome)

      expect(result).toBe('red')
    })

    it('returns grey colour when there is no contact outcome', () => {
      const result = AppointmentUtils.getStatusColour()

      expect(result).toBe('grey')
    })
  })
})
