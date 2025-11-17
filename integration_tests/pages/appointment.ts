import { AppointmentDto } from '../../server/@types/shared'
import Offender from '../../server/models/offender'
import Page from './page'

export default class AppointmentPage extends Page {
  constructor(appointment: AppointmentDto) {
    const offender = new Offender(appointment.offender)
    super(offender.name)
  }
}
