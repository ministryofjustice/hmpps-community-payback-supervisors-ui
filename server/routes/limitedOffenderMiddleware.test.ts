import { createMock } from '@golevelup/ts-jest'
import type { Request, Response } from 'express'
import OffenderService from '../services/offenderService'
import caseDetailsSummaryFactory from '../testutils/factories/caseDetailsSummaryFactory'
import unpaidWorkDetailsFactory from '../testutils/factories/unpaidWorkDetailsFactory'
import offenderLimitedFactory from '../testutils/factories/offenderLimitedFactory'
import AppointmentService from '../services/appointmentService'
import limitedOffenderMiddleware from './limitedOffenderMiddleware'
import appointmentFactory from '../testutils/factories/appointmentFactory'
import offenderFullFactory from '../testutils/factories/offenderFullFactory'
import Offender from '../models/offender'
import AppointmentFormService from '../services/appointmentFormService'

describe('limitedOffenderMiddleware', () => {
  const mockOffenderService = {
    getOffenderSummary: jest.fn(),
  } as unknown as jest.Mocked<OffenderService>

  const mockAppointmentService = {
    getAppointment: jest.fn(),
  } as unknown as jest.Mocked<AppointmentService>

  const mockAppointmentFormService = {
    getForm: jest.fn(() => {
      return { crn: 'abcd' }
    }),
  } as unknown as jest.Mocked<AppointmentFormService>

  const crn = 'X12345'
  const appointmentId = '1'
  const username = 'username'

  const req = createMock<Request>({
    params: {
      crn,
    },
    query: { prop: '12' },
  })

  const reqWithAppointmentId = createMock<Request>({
    params: {
      appointmentId,
    },
    query: { prop: '12' },
  })

  const res = createMock<Response>({
    locals: {
      user: {
        username,
      },
    },
    redirect: jest.fn(),
  })

  const next = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when there is a CRN in the req', () => {
    it('renders the restricted person page when the person is limited', async () => {
      const offender = offenderLimitedFactory.build({ crn })
      const unpaidWorkDetails = unpaidWorkDetailsFactory.build()
      const caseDetailsSummary = caseDetailsSummaryFactory.build({ unpaidWorkDetails: [unpaidWorkDetails], offender })

      mockOffenderService.getOffenderSummary.mockResolvedValue(caseDetailsSummary)

      const appointment = appointmentFactory.build({
        offender,
      })

      mockAppointmentService.getAppointment.mockResolvedValue(appointment)

      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
      })

      await middleware(req, res, next)

      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalledWith({
        username,
        crn,
      })

      expect(res.render).toHaveBeenCalledWith('pages/restrictedPerson', {
        person: new Offender(offender),
        backLink: '/',
      })
    })

    it('calls next when the person is not limited', async () => {
      const offender = offenderFullFactory.build({ crn })
      const unpaidWorkDetails = unpaidWorkDetailsFactory.build()
      const caseDetailsSummary = caseDetailsSummaryFactory.build({ unpaidWorkDetails: [unpaidWorkDetails], offender })

      mockOffenderService.getOffenderSummary.mockResolvedValue(caseDetailsSummary)

      const appointment = appointmentFactory.build({
        offender,
      })

      mockAppointmentService.getAppointment.mockResolvedValue(appointment)

      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
      })

      await middleware(req, res, next)

      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalledWith({
        username,
        crn,
      })

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when there is only an appointmentId in the req', () => {
    it('renders the restricted person page when the person is limited', async () => {
      const offender = offenderLimitedFactory.build({ crn })
      const unpaidWorkDetails = unpaidWorkDetailsFactory.build()
      const caseDetailsSummary = caseDetailsSummaryFactory.build({ unpaidWorkDetails: [unpaidWorkDetails], offender })

      mockOffenderService.getOffenderSummary.mockResolvedValue(caseDetailsSummary)

      const appointment = appointmentFactory.build({
        offender,
      })

      mockAppointmentService.getAppointment.mockResolvedValue(appointment)

      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
      })

      await middleware(reqWithAppointmentId, res, next)

      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalledWith({
        username,
        crn,
      })

      expect(res.render).toHaveBeenCalledWith('pages/restrictedPerson', {
        person: new Offender(offender),
        backLink: '/',
      })
    })

    it('calls next when the person is not limited', async () => {
      const offender = offenderFullFactory.build({ crn })
      const unpaidWorkDetails = unpaidWorkDetailsFactory.build()
      const caseDetailsSummary = caseDetailsSummaryFactory.build({ unpaidWorkDetails: [unpaidWorkDetails], offender })

      mockOffenderService.getOffenderSummary.mockResolvedValue(caseDetailsSummary)

      const appointment = appointmentFactory.build({
        offender,
      })

      mockAppointmentService.getAppointment.mockResolvedValue(appointment)

      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
      })

      await middleware(reqWithAppointmentId, res, next)

      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalledWith({
        username,
        crn,
      })

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when a CRN is given', () => {
    const givenCrn = 'Y67890'

    it('checks the given CRN instead of the one in the req', async () => {
      mockOffenderService.getOffenderSummary.mockResolvedValue(
        caseDetailsSummaryFactory.build({ offender: offenderFullFactory.build({ crn: givenCrn }) }),
      )

      await limitedOffenderMiddleware({ offenderService: mockOffenderService, backPath: '/', crn: givenCrn })(
        req,
        res,
        next,
      )

      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalledWith({ username, crn: givenCrn })
      expect(next).toHaveBeenCalled()
    })
  })

  describe('when an another person link is given', () => {
    const anotherPersonLink = jest.fn()

    beforeEach(() => {
      anotherPersonLink.mockResolvedValue('/another-person')
    })

    it('renders the restricted person page with the link when the person is limited', async () => {
      const offender = offenderLimitedFactory.build({ crn })
      mockOffenderService.getOffenderSummary.mockResolvedValue(caseDetailsSummaryFactory.build({ offender }))

      await limitedOffenderMiddleware({ offenderService: mockOffenderService, backPath: '/', anotherPersonLink })(
        req,
        res,
        next,
      )

      expect(res.render).toHaveBeenCalledWith('pages/restrictedPerson', {
        person: new Offender(offender),
        backLink: '/',
        anotherPersonLink: '/another-person',
      })
    })

    it('does not build the link when the person is not limited', async () => {
      mockOffenderService.getOffenderSummary.mockResolvedValue(
        caseDetailsSummaryFactory.build({ offender: offenderFullFactory.build({ crn }) }),
      )

      await limitedOffenderMiddleware({ offenderService: mockOffenderService, backPath: '/', anotherPersonLink })(
        req,
        res,
        next,
      )

      expect(anotherPersonLink).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe('when there is neither an appointmentId or a CRN in the req', () => {
    it('calls next', async () => {
      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
      })

      const emptyReq = createMock<Request>({
        params: {},
        query: { prop: '12' },
      })

      await middleware(emptyReq, res, next)

      expect(next).toHaveBeenCalled()
    })
  })

  describe('when there is not a form in the query', () => {
    it('should not call the appointment form service', async () => {
      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
        appointmentFormService: mockAppointmentFormService,
      })

      const emptyReq = createMock<Request>({
        params: {},
        query: { prop: '12' },
      })

      await middleware(emptyReq, res, next)

      expect(mockAppointmentFormService.getForm).not.toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })

  describe('when there is a form in the query (and nothing in the params)', () => {
    it('should call the appointment form service to get a form and a CRN, and thence the offender service', async () => {
      const middleware = limitedOffenderMiddleware({
        offenderService: mockOffenderService,
        backPath: '/',
        appointmentService: mockAppointmentService,
        appointmentFormService: mockAppointmentFormService,
      })

      const reqWithFormId = createMock<Request>({
        params: {},
        query: { prop: '12', form: 'form1234' },
      })

      await middleware(reqWithFormId, res, next)

      expect(mockAppointmentFormService.getForm).toHaveBeenCalled()
      expect(mockOffenderService.getOffenderSummary).toHaveBeenCalled()
      expect(next).toHaveBeenCalled()
    })
  })
})
