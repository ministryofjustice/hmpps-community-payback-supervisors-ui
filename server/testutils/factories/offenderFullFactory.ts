import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { OffenderFullDto } from '../../@types/shared'

export default Factory.define<OffenderFullDto>(() => ({
  forename: faker.person.firstName(),
  surname: faker.person.lastName(),
  middleNames: [faker.person.middleName()],
  objectType: 'Full',
  crn: `CRN${faker.string.alphanumeric({ length: 5 })}`,
  dateOfBirth: faker.date.past().toISOString(),
}))
