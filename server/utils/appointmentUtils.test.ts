import { ContactOutcomeDto } from '../@types/shared'
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

  describe('buildStatusTag', () => {
    const states: [ContactOutcomeDto, ((outcome: ContactOutcomeDto) => string) | string, string][] = [
      [
        contactOutcomeFactory.build({ attended: true, enforceable: true }),
        (outcome: ContactOutcomeDto) => outcome.name,
        'yellow',
      ],
      [
        contactOutcomeFactory.build({ enforceable: true, attended: false }),
        (outcome: ContactOutcomeDto) => outcome.name,
        'red',
      ],
      [
        contactOutcomeFactory.build({ enforceable: false, attended: true }),
        (outcome: ContactOutcomeDto) => outcome.name,
        'teal',
      ],
      [null, 'Scheduled', 'grey'],
    ]

    it.each(states)(
      'returns a GOV.UK Frontend status tag component with the given colour and label',
      (outcome, functionOrLabel, colour) => {
        const result = AppointmentUtils.buildStatusTag(outcome)
        const label = typeof functionOrLabel === 'function' ? functionOrLabel(outcome) : functionOrLabel

        expect(result).toEqual(`<strong class="govuk-tag govuk-tag--${colour} cpb-unset-max-width">${label}</strong>`)
      },
    )
  })
})
