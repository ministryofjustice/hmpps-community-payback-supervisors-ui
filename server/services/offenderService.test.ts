import { OffenderClient } from '../data'
import caseDetailsFactory from '../testutils/factories/caseDetailsFactory'
import OffenderService from './offenderService'

jest.mock('../data/offenderClient')

describe('OffenderService', () => {
  const offenderClient = new OffenderClient(null) as jest.Mocked<OffenderClient>
  let offenderService: OffenderService

  beforeEach(() => {
    offenderService = new OffenderService(offenderClient)
    jest.clearAllMocks()
  })

  it('should call getOffenderSummary and get its result', async () => {
    const caseDetails = caseDetailsFactory.build()

    offenderClient.getOffenderSummary.mockResolvedValue(caseDetails)
    const result = await offenderService.getOffenderSummary({
      username: 'some-username',
      crn: 'ABC1234',
    })

    expect(offenderClient.getOffenderSummary).toHaveBeenCalledTimes(1)
    expect(result).toEqual(caseDetails)
    expect(result.unpaidWorkDetails[0]).toEqual(caseDetails.unpaidWorkDetails[0])
  })
})
