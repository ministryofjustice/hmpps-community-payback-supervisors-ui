import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AppointmentSummaryDto } from '../../@types/shared'
import offenderFullFactory from './offenderFullFactory'
import contactOutcomeFactory from './contactOutcomeFactory'

export default Factory.define<AppointmentSummaryDto>(() => ({
  id: faker.number.int(),
  startTime: '09:00',
  endTime: '17:00',
  contactOutcome: contactOutcomeFactory.build(),
  requirementMinutes: faker.number.int(1000),
  completedMinutes: faker.number.int(1000),
  offender: offenderFullFactory.build(),
}))
