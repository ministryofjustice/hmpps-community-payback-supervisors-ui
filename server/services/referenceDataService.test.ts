import ReferenceDataClient from '../data/referenceDataClient'
import { contactOutcomeFactory, contactOutcomesFactory } from '../testutils/factories/contactOutcomeFactory'
import ReferenceDataService from './referenceDataService'

jest.mock('../data/referenceDataClient')

describe('ReferenceDataService', () => {
  const referenceDataClient = new ReferenceDataClient(null) as jest.Mocked<ReferenceDataClient>
  let referenceDataService: ReferenceDataService

  beforeEach(() => {
    referenceDataService = new ReferenceDataService(referenceDataClient)
  })

  afterEach(() => {
    jest.resetAllMocks()
  })

  describe('getContactOutcomes', () => {
    it('should call getContactOutcomes on the api client and return its result', async () => {
      const contactOutcomes = contactOutcomesFactory.build()

      referenceDataClient.getContactOutcomes.mockResolvedValue(contactOutcomes)

      const result = await referenceDataService.getContactOutcomes('some-username')

      expect(referenceDataClient.getContactOutcomes).toHaveBeenCalledTimes(1)
      expect(result).toEqual(contactOutcomes)
    })
  })

  describe('getContactOutcomesForArrivedUnableToWork', () => {
    it('should return filtered contact outcomes for arrived - unable to work', async () => {
      const attendedSentHomeServiceIssuesContactOutcome = contactOutcomeFactory.build({ code: 'ATSS' })
      const attendedSentHomeBehaviourContactOutcome = contactOutcomeFactory.build({ code: 'ATSH' })
      const attendedFailedToComplyContactOutcome = contactOutcomeFactory.build({ code: 'AFTC' })

      const contactOutcomes = {
        contactOutcomes: [
          attendedSentHomeServiceIssuesContactOutcome,
          attendedSentHomeBehaviourContactOutcome,
          contactOutcomeFactory.build({ code: 'RSOF' }),
          attendedFailedToComplyContactOutcome,
          contactOutcomeFactory.build({ code: 'ATTC' }),
        ],
      }

      referenceDataClient.getContactOutcomes.mockResolvedValue(contactOutcomes)

      const result = await referenceDataService.getAttendedNonWorkingContactOutcomes('some-username')

      expect(referenceDataClient.getContactOutcomes).toHaveBeenCalledTimes(1)
      expect(result.contactOutcomes).toEqual([
        attendedSentHomeServiceIssuesContactOutcome,
        attendedSentHomeBehaviourContactOutcome,
        attendedFailedToComplyContactOutcome,
      ])
    })
  })

  describe('attendedCompliedOutcomeCode', () => {
    it('is ATTC', () => {
      expect(ReferenceDataService.attendedCompliedOutcomeCode).toEqual('ATTC')
    })
  })
})
