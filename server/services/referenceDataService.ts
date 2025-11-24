import { ContactOutcomesDto } from '../@types/shared'
import ReferenceDataClient from '../data/referenceDataClient'

export default class ReferenceDataService {
  constructor(private readonly referenceDataClient: ReferenceDataClient) {}

  async getContactOutcomes(userName: string): Promise<ContactOutcomesDto> {
    return this.referenceDataClient.getContactOutcomes(userName)
  }

  async getContactOutcomesForArrivedUnableToWork(userName: string): Promise<ContactOutcomesDto> {
    const contactOutcomesArrivedUnableToWorkCodes = ['ATSS', 'ATSH', 'AFTC']

    const contactOutcomes = await this.getContactOutcomes(userName)

    return {
      contactOutcomes: contactOutcomes.contactOutcomes.filter(outcome =>
        contactOutcomesArrivedUnableToWorkCodes.includes(outcome.code),
      ),
    }
  }
}
