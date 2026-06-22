import { ContactOutcomeDto, ContactOutcomesDto } from '../@types/shared'
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

  static readonly attendedOutcomeCodes = [...this.attendedNonWorkingOutcomeCodes, this.attendedCompliedOutcomeCode]

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

  async getContactOutcome(username: string, contactOutcomeCode: string): Promise<ContactOutcomeDto | undefined> {
    const contactOutcomes = await this.referenceDataClient.getContactOutcomes(username)
    return contactOutcomes.contactOutcomes.find(contactOutcome => contactOutcome.code === contactOutcomeCode)
  }
}
