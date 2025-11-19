import Offender from '../../../models/offender'
import paths from '../../../paths'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import AbleToWorkPage from './ableToWorkPage'

jest.mock('../../../models/offender')

describe('AbleToWorkPage', () => {
  beforeEach(() => {
    jest.resetAllMocks()
  })

  describe('viewData', () => {
    const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>

    it('should return an object with correct data', () => {
      const appointmentId = '1'
      const startTime = '09:00'
      const appointment = appointmentFactory.build({ id: 1, startTime })
      const projectCode = 'XR3'
      const offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }

      offenderMock.mockImplementation(() => {
        return offender
      })

      const page = new AbleToWorkPage()
      const result = page.viewData(appointment, projectCode)
      expect(result).toEqual({
        offender,
        backPath: paths.appointments.arrived.startTime({ appointmentId, projectCode }),
        updatePath: paths.appointments.arrived.ableToWork({ appointmentId, projectCode }),
        title: `Can Sam Smith work today?`,
      })
    })
  })

  describe('next', () => {
    it('should return path to the confirm working page with project code and appointment Id', () => {
      const appointmentId = '1'
      const projectCode = '2'
      const page = new AbleToWorkPage()
      const result = page.nextPath(appointmentId, projectCode)

      expect(result).toEqual(paths.appointments.confirm.working({ projectCode, appointmentId }))
    })
  })

  describe('validate', () => {
    describe('when ableToWork is not present', () => {
      it('should return true for page.hasError', () => {
        const page = new AbleToWorkPage({})
        page.validate()

        expect(page.hasErrors).toEqual(true)
      })

      it('should return the correct error', () => {
        const page = new AbleToWorkPage({})
        page.validate()

        expect(page.validationErrors.ableToWork).toEqual({
          text: 'Select whether the person is able to work today',
        })
      })
    })
  })
})
