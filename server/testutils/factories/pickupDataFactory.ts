import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { PickUpDataDto, PickUpLocationDto } from '../../@types/shared'

export default Factory.define<PickUpDataDto>(() => ({
  pickupLocation: pickupLocationFactory.build(),
  time: '09:00:00',
}))

export const pickupLocationFactory = Factory.define<PickUpLocationDto>(() => ({
  buildingName: faker.company.name(),
  buildingNumber: faker.location.buildingNumber(),
  streetName: faker.location.street(),
  townCity: faker.location.city(),
  county: faker.location.county(),
  deliusCode: faker.string.alpha(8),
  description: faker.location.streetAddress(),
  postCode: faker.location.zipCode(),
}))
