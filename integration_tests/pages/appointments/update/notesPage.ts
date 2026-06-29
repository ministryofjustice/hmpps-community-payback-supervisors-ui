import paths from '../../../../server/paths'
import Offender from '../../../../server/models/offender'
import { AppointmentDto } from '../../../../server/@types/shared'
import { pathWithQuery } from '../../../../server/utils/utils'
import PageWithNotes from './base/pageWithNotes'
import { AppointmentNotesAction } from '../../../../server/@types/user-defined'

export default class NotesPage extends PageWithNotes {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    super(offender.name, 'Add notes')
  }

  static visit(appointment: AppointmentDto, action: AppointmentNotesAction, formId: string = 'some-form'): NotesPage {
    const path = pathWithQuery(
      paths.appointments.notes[action]({
        projectCode: appointment.projectCode,
        appointmentId: appointment.id.toString(),
      }),
      { form: formId },
    )

    cy.visit(path)

    return new NotesPage(appointment)
  }

  completeForm() {
    this.enterNotes()
    this.checkSensitiveInformation()
  }

  enterNotes() {
    this.enterNotesWithCharacterLength(4000)
  }

  enterNote(text: string) {
    this.notesField().invoke('val', text)
  }

  shouldHaveEmptyNotes() {
    this.notesField().should('have.value', '')
  }

  checkSensitiveInformation(): void {
    this.getInputByLabel(
      'This is information that you believe must be recorded but not shared with a person on probation. If they make a request for their record, the Data Protection Team will decide whether the information can be shared.',
    ).check()
  }
}
