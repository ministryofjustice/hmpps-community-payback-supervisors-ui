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

  static validOutcomeCodeForRoute(code: string, route: string): boolean {
    const rules: Record<string, string[]> = {
      'left-early': this.attendedNonWorkingOutcomeCodes,
      completed: [this.attendedCompliedOutcomeCode],
    }

    return Object.entries(rules).some(([routePattern, codes]) => {
      return new RegExp(routePattern).test(route) && codes.includes(code)
    })
  }

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
