import { CommonCaseDetailsSummaryDto } from '../@types/shared'
import OffenderClient from '../data/offenderClient'

export default class OffenderService {
  constructor(private readonly offenderClient: OffenderClient) {}

  async getOffenderSummary({ username, crn }: { username: string; crn: string }): Promise<CommonCaseDetailsSummaryDto> {
    return this.offenderClient.getOffenderSummary({ username, crn })
  }
}
