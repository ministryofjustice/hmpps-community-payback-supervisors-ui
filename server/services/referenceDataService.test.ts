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

  describe('validOutcomeCodeForRoute', () => {
    it('returns true for ATSH/ATSS/AFTC on left early route', () => {
      const route = '/xx/yy/zz/left-early/aa/bb'
      expect(ReferenceDataService.validOutcomeCodeForRoute('ATSH', route)).toEqual(true)
      expect(ReferenceDataService.validOutcomeCodeForRoute('ATSS', route)).toEqual(true)
      expect(ReferenceDataService.validOutcomeCodeForRoute('AFTC', route)).toEqual(true)
    })

    it('returns true for ATTC on completed route', () => {
      const route = '/xx/yy/zz/completed/aa/bb'
      expect(ReferenceDataService.validOutcomeCodeForRoute('ATTC', route)).toEqual(true)
    })

    it('returns false for a valid code on the wrong route', () => {
      const route = '/xx/yy/zz/completed/aa/bb'
      const route2 = '/xx/yy/zz/left-early/aa/bb'
      expect(ReferenceDataService.validOutcomeCodeForRoute('ATSH', route)).toEqual(false)
      expect(ReferenceDataService.validOutcomeCodeForRoute('ATTC', route2)).toEqual(false)
    })

    it('returns false for a bad code on a good route', () => {
      const route = '/xx/yy/zz/completed/aa/bb'
      const route2 = '/xx/yy/zz/left-early/aa/bb'
      expect(ReferenceDataService.validOutcomeCodeForRoute('XXXX', route)).toEqual(false)
      expect(ReferenceDataService.validOutcomeCodeForRoute('YYYY', route2)).toEqual(false)
    })
  })
})
