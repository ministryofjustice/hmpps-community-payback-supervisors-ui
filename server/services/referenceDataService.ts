import { ContactOutcomesDto } from '../@types/shared'
import ReferenceDataClient from '../data/referenceDataClient'

export default class ReferenceDataService {
  static readonly attendedCompliedOutcomeCode = 'ATTC'

  static readonly attendedNonWorkingOutcomeCodes = ['ATSS', 'ATSH', 'AFTC']

  constructor(private readonly referenceDataClient: ReferenceDataClient) {}

  async getContactOutcomes(userName: string): Promise<ContactOutcomesDto> {
    return this.referenceDataClient.getContactOutcomes(userName)
  }

  async getAttendedNonWorkingContactOutcomes(userName: string): Promise<ContactOutcomesDto> {
    const contactOutcomes = await this.getContactOutcomes(userName)

    return {
      contactOutcomes: contactOutcomes.contactOutcomes.filter(outcome =>
        ReferenceDataService.attendedNonWorkingOutcomeCodes.includes(outcome.code),
      ),
    }
  }
}
