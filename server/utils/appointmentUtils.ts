import { ContactOutcomeDto } from '../@types/shared'
import { GovUkStatusTagColour } from '../@types/user-defined'

export default class AppointmentUtils {
  static getStatusColour(contactOutcome?: ContactOutcomeDto): GovUkStatusTagColour {
    if (!contactOutcome) {
      return 'grey'
    }

    // Attended & complied or acceptable absence
    if (!contactOutcome.enforceable) {
      return 'teal'
    }

    // Attended & did not comply
    if (contactOutcome.attended) {
      return 'yellow'
    }

    // Unexpected absence
    return 'red'
  }
}
