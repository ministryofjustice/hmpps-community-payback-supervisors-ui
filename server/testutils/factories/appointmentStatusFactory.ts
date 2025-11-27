import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AppointmentStatus } from '../../services/appointmentStatusService'

export default Factory.define<AppointmentStatus>(() => ({
  appointmentId: faker.number.int(),
  status: faker.helpers.arrayElement(['Scheduled', 'Completed', 'Working']),
}))
