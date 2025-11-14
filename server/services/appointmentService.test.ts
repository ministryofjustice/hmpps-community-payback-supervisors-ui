import AppointmentClient from '../data/appointmentClient'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import AppointmentService from './appointmentService'

jest.mock('../data/appointmentClient')

describe('AppointmentService', () => {
  const appointmentClient = new AppointmentClient(null) as jest.Mocked<AppointmentClient>
  let appointmentService: AppointmentService

  beforeEach(() => {
    appointmentService = new AppointmentService(appointmentClient)
  })

  it('should call find on the appointment client and return its result', async () => {
    const projectCode = '1'
    const appointmentId = '1'

    const appointment = appointmentFactory.build()

    appointmentClient.find.mockResolvedValue(appointment)

    const result = await appointmentService.getAppointment({
      username: 'some-username',
      projectCode,
      appointmentId,
    })

    expect(appointmentClient.find).toHaveBeenCalledTimes(1)
    expect(result).toEqual(appointment)
  })
})
