import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import attendanceDataFactory from './attendanceDataFactory'
import enforcementDataFactory from './enforcementDataFactory'
import { UpdateAppointmentDto } from '../../@types/shared'

export default Factory.define<UpdateAppointmentDto>(() => ({
  deliusId: faker.number.int(),
  deliusVersionToUpdate: faker.string.uuid(),
  startTime: '09:00',
  endTime: '17:00',
  contactOutcomeCode: faker.string.uuid(),
  attendanceData: attendanceDataFactory.build(),
  enforcementData: enforcementDataFactory.build(),
  supervisorOfficerCode: faker.string.alpha(10),
  notes: faker.string.alpha(30),
  sensitive: faker.datatype.boolean(),
  alertActive: faker.datatype.boolean(),
  date: faker.date.recent().toISOString().split('T')[0],
}))
