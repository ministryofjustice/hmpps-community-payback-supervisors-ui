import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AppointmentDto } from '../../@types/shared'
import offenderFullFactory from './offenderFullFactory'
import attendanceDataFactory from './attendanceDataFactory'
import enforcementDataFactory from './enforcementDataFactory'

export default Factory.define<AppointmentDto>(() => ({
  id: faker.number.int(),
  version: faker.string.uuid(),
  projectName: faker.company.name(),
  projectCode: faker.string.alpha(10),
  projectTypeName: faker.company.buzzPhrase(),
  projectTypeCode: faker.string.alpha(10),
  offender: offenderFullFactory.build(),
  supervisingTeam: faker.location.county(),
  supervisingTeamCode: faker.string.alpha(10),
  providerCode: faker.string.alpha(10),
  date: faker.date.recent().toISOString().split('T')[0],
  startTime: '09:00',
  endTime: '17:00',
  contactOutcomeCode: faker.string.uuid(),
  attendanceData: attendanceDataFactory.build(),
  enforcementData: enforcementDataFactory.build(),
  supervisorOfficerCode: faker.string.alpha(10),
  notes: faker.string.alpha(30),
  sensitive: faker.datatype.boolean(),
  alertActive: faker.datatype.boolean(),
}))
