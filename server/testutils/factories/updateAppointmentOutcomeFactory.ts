import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { UpdateAppointmentOutcomeDto } from '../../@types/shared'
import attendanceDataFactory from './attendanceDataFactory'
import enforcementDataFactory from './enforcementDataFactory'

export default Factory.define<UpdateAppointmentOutcomeDto>(() => ({
  deliusId: faker.number.int(),
  deliusVersionToUpdate: faker.string.uuid(),
  startTime: '09:00',
  endTime: '17:00',
  contactOutcomeId: faker.string.uuid(),
  attendanceData: attendanceDataFactory.build(),
  enforcementData: enforcementDataFactory.build(),
  supervisorOfficerCode: faker.string.alpha(10),
  notes: faker.string.alpha(30),
  sensitive: faker.datatype.boolean(),
  alertActive: faker.datatype.boolean(),
}))
