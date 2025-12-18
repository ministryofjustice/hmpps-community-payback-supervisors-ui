import { ContactOutcomesDto } from '../@types/shared'
import ReferenceDataClient from '../data/referenceDataClient'

export default class ReferenceDataService {
  static readonly attendedCompliedOutcomeCode = 'ATTC'

  static readonly attendedSentHomeBehaviourOutcomeCode = 'ATSH'

  static readonly attendedSentHomeServiceIssuesOutcomeCode = 'ATSS'

  static readonly attendedFailedToComplyOutcomeCode = 'AFTC'

  static readonly attendedNonWorkingOutcomeCodes = [
    this.attendedSentHomeServiceIssuesOutcomeCode,
    this.attendedSentHomeBehaviourOutcomeCode,
    this.attendedFailedToComplyOutcomeCode,
  ]

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
