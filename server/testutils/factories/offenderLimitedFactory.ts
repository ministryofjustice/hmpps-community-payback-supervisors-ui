import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { OffenderLimitedDto } from '../../@types/shared'

export default Factory.define<OffenderLimitedDto>(() => ({
  objectType: 'Limited',
  crn: `CRN${faker.string.alphanumeric({ length: 5 })}`,
}))
