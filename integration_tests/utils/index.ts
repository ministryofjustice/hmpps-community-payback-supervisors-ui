import { AppointmentDto } from '../../server/@types/shared'
import caseDetailsSummaryFactory from '../../server/testutils/factories/caseDetailsSummaryFactory'
import offenderFullFactory from '../../server/testutils/factories/offenderFullFactory'
import unpaidWorkDetailsFactory from '../../server/testutils/factories/unpaidWorkDetailsFactory'

export default class Utils {
  static stubOffenderFromAppointment(appointment: AppointmentDto) {
    const { crn } = appointment.offender
    const offender = offenderFullFactory.build({ crn })
    const upwDetails = unpaidWorkDetailsFactory.build({ eventNumber: appointment.deliusEventNumber })
    const caseDetailsSummary = caseDetailsSummaryFactory.build({
      offender,
      unpaidWorkDetails: [upwDetails, unpaidWorkDetailsFactory.build()],
    })

    cy.task('stubGetOffenderSummary', {
      caseDetailsSummary,
    })

    return caseDetailsSummary
  }
}
