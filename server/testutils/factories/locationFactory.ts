import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { LocationDto } from '../../@types/shared'

export default Factory.define<LocationDto>(() => ({
  buildingName: faker.company.name(),
  buildingNumber: faker.location.buildingNumber(),
  streetName: faker.location.street(),
  townCity: faker.location.city(),
  county: faker.location.county(),
}))
