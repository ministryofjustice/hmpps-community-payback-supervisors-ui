import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AttendanceDataDto } from '../../@types/shared'

export default Factory.define<AttendanceDataDto>(() => ({
  hiVisWorn: faker.datatype.boolean(),
  workedIntensively: faker.datatype.boolean(),
  penaltyTime: '01:00',
  workQuality: 'GOOD',
  behaviour: 'NOT_APPLICABLE',
  supervisorOfficerCode: faker.string.alpha(8),
  contactOutcomeId: faker.string.uuid(),
}))
