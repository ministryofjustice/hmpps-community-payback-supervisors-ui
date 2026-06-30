import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { ContactOutcomeDto, ContactOutcomesDto } from '../../@types/shared'

export const contactOutcomeFactory = Factory.define<ContactOutcomeDto>(() => ({
  id: faker.string.uuid(),
  name: faker.company.name(),
  code: faker.string.sample(10),
  enforceable: faker.datatype.boolean(),
  attended: faker.datatype.boolean(),
  availableToSupervisors: faker.datatype.boolean(),
  willAlertEnforcementDiary: faker.datatype.boolean(),
  // hintText is not required for most test cases
  hintText: undefined,
}))

export const contactOutcomesFactory = Factory.define<ContactOutcomesDto>(() => ({
  contactOutcomes: contactOutcomeFactory.buildList(3),
}))
