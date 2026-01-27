import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { AppointmentOutcomeForm } from '../../@types/user-defined'

export default Factory.define<AppointmentOutcomeForm>(() => ({
  deliusVersion: faker.string.alphanumeric(8),
  endTime: '17:00',
}))
