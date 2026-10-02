import paths from '../../../paths'
import { AppointmentDto, ContactOutcomeDto } from '../../../@types/shared'
import appointmentFactory from '../../../testutils/factories/appointmentFactory'
import { contactOutcomeFactory } from '../../../testutils/factories/contactOutcomeFactory'
import AppointmentUtils from '../../../utils/appointmentUtils'
import ReviewPage from './reviewPage'
import Offender from '../../../models/offender'
import GovUkRadioGroup from '../../../utils/GovUKFrontend/GovUkRadioGroup'
import ReferenceDataService from '../../../services/referenceDataService'
import supervisorFactory from '../../../testutils/factories/supervisorFactory'
import { AppointmentOutcomeForm } from '../../../@types/user-defined'
import appointmentOutcomeFormFactory from '../../../testutils/factories/appointmentOutcomeFormFactory'

jest.mock('../../../models/offender')

describe('ReviewPage', () => {
  let appointment: AppointmentDto
  let form: AppointmentOutcomeForm

  describe('viewData', () => {
    let offender: object

    beforeEach(() => {
      const offenderMock: jest.Mock = Offender as unknown as jest.Mock<Offender>
      offender = {
        name: 'Sam Smith',
        crn: 'CRN123',
        isLimited: false,
      }
      offenderMock.mockImplementation(() => {
        return offender
      })
      appointment = appointmentFactory.build()
    })

    describe('when showWillAlertPractitionerMessage is true', () => {
      it('should return an object with correct data', () => {
        const formId = 'form1234'
        const backUrl = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`
        const updateUrl = `${paths.appointments.review.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const outcome = contactOutcomeFactory.build({ attended: true })

        const page = new ReviewPage('absent', 'test', { form: formId }, outcome, { 'Test key': 'Test value' }, true)

        const link = `<a href=${backUrl} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const outcomeLink = `${paths.appointments.attendanceOutcome({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        })}?form=${formId}`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: backUrl,
          updatePath: updateUrl,
          rows: [
            [
              { text: 'Outcome' },
              { html: statusTagHtml },
              {
                html: `<a href='${outcomeLink}' class="govuk-link govuk-link--no-visited-state">Change</a>`,
              },
            ],
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: true,
          alertDiaryText: 'Would you also like this to be sent to the alert diary?',
          alertPractitionerItems: [
            {
              checked: false,
              text: 'Yes',
              value: 'yes',
            },
            {
              checked: false,
              text: 'No',
              value: 'no',
            },
          ],
        })
      })
    })

    describe('when showWillAlertPractitionerMessage is false', () => {
      it('should return an object with correct data', () => {
        const formId = 'form1234'
        const backUrl = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`
        const updateUrl = `${paths.appointments.review.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const outcome = contactOutcomeFactory.build({
          willAlertEnforcementDiary: false,
          attended: true,
        })

        const outcomeLink = `${paths.appointments.attendanceOutcome({
          projectCode: appointment.projectCode,
          appointmentId: appointment.id.toString(),
        })}?form=${formId}`

        const page = new ReviewPage('absent', 'test', { form: formId }, outcome, { 'Test key': 'Test value' }, false)

        const link = `<a href=${backUrl} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: backUrl,
          updatePath: updateUrl,
          rows: [
            [
              { text: 'Outcome' },
              { html: statusTagHtml },
              {
                html: `<a href='${outcomeLink}' class="govuk-link govuk-link--no-visited-state">Change</a>`,
              },
            ],
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: false,
          alertDiaryText: 'Would you like this to be sent to the alert diary?',
          alertPractitionerItems: [
            {
              checked: false,
              text: 'Yes',
              value: 'yes',
            },
            {
              checked: false,
              text: 'No',
              value: 'no',
            },
          ],
        })
      })
    })

    describe('when the outcome is not attended', () => {
      it('should not show the change link', () => {
        const formId = 'form1234'
        const backUrl = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`
        const updateUrl = `${paths.appointments.review.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const outcome = contactOutcomeFactory.build({ attended: false })

        const page = new ReviewPage('absent', 'test', { form: formId }, outcome, { 'Test key': 'Test value' }, true)

        const link = `<a href=${backUrl} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: backUrl,
          updatePath: updateUrl,
          rows: [
            [
              { text: 'Outcome' },
              { html: statusTagHtml },
              {
                text: '',
              },
            ],
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: true,
          alertDiaryText: 'Would you also like this to be sent to the alert diary?',
          alertPractitionerItems: [
            {
              checked: false,
              text: 'Yes',
              value: 'yes',
            },
            {
              checked: false,
              text: 'No',
              value: 'no',
            },
          ],
        })
      })
    })

    describe('when the outcome does not exist', () => {
      it('should not show the change link', () => {
        const formId = 'form1234'
        const backUrl = `${paths.appointments.notes.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`
        const updateUrl = `${paths.appointments.review.absent({ appointmentId: appointment.id.toString(), projectCode: appointment.projectCode })}?form=${formId}`

        const page = new ReviewPage(
          'absent',
          'test',
          { form: formId },
          undefined as unknown as ContactOutcomeDto,
          { 'Test key': 'Test value' },
          true,
        )

        const link = `<a href=${backUrl} class="govuk-link govuk-link--no-visited-state">Change</a>`

        const statusTagHtml = '<strong>Contact outcome name</strong>'
        jest.spyOn(AppointmentUtils, 'buildStatusTag').mockReturnValue(statusTagHtml)

        expect(page.viewData(appointment)).toEqual({
          offender,
          backPath: backUrl,
          updatePath: updateUrl,
          rows: [
            [
              { text: 'Outcome' },
              { html: statusTagHtml },
              {
                text: '',
              },
            ],
            [{ text: 'Test key' }, { html: 'Test value' }, { html: link }],
          ],
          template: './test.njk',
          showWillAlertPractitionerMessage: true,
          alertDiaryText: 'Would you also like this to be sent to the alert diary?',
          alertPractitionerItems: [
            {
              checked: false,
              text: 'Yes',
              value: 'yes',
            },
            {
              checked: false,
              text: 'No',
              value: 'no',
            },
          ],
        })
      })
    })
  })

  describe('buildPayload', () => {
    beforeEach(() => {
      appointment = appointmentFactory.build()
      jest.spyOn(GovUkRadioGroup, 'nullableValueFromYesOrNoItem').mockReturnValue(false)
    })

    const formId = '12'

    describe('absent', () => {
      it('returns data from the appointment except for notes, sensitive, supervisor code, and the outcome code', () => {
        form = appointmentOutcomeFormFactory.build({
          notes: 'testnote',
          sensitive: true,
          contactOutcomeCode: ReferenceDataService.UnacceptableAbsenceOutcomeCode,
        })

        const page = new ReviewPage(
          'absent',
          'test',
          { form: formId },
          undefined as unknown as ContactOutcomeDto,
          { 'Test key': 'Test value' },
          false,
        )

        const supervisor = supervisorFactory.build()

        const result = page.buildPayload(appointment, form, supervisor)

        expect(result).toEqual(
          expect.objectContaining({
            deliusId: appointment.id,
            deliusVersionToUpdate: appointment.version,
            alertActive: false,
            startTime: appointment.startTime,
            endTime: appointment.endTime,
            attendanceData: appointment.attendanceData,
            supervisorOfficerCode: supervisor.code,
            date: appointment.date,
            notes: 'testnote',
            sensitive: true,
            contactOutcomeCode: ReferenceDataService.UnacceptableAbsenceOutcomeCode,
          }),
        )
      })
    })

    describe('completed', () => {
      it('returns data from the form and query', () => {
        form = appointmentOutcomeFormFactory.build({
          notes: 'testnote',
          sensitive: false,
          contactOutcomeCode: 'ABCD',
        })

        const page = new ReviewPage(
          'completed',
          'test',
          { form: formId },
          undefined as unknown as ContactOutcomeDto,
          { 'Test key': 'Test value' },
          false,
        )

        const supervisor = supervisorFactory.build()

        const result = page.buildPayload(appointment, form, supervisor)

        expect(result).toEqual(
          expect.objectContaining({
            deliusId: appointment.id,
            deliusVersionToUpdate: form.deliusVersion,
            startTime: form.startTime,
            endTime: form.endTime,
            attendanceData: {
              ...appointment.attendanceData,
              ...form.attendanceData,
            },
            supervisorOfficerCode: supervisor.code,
            date: appointment.date,
            alertActive: false,
            sensitive: form.sensitive,
            contactOutcomeCode: 'ABCD',
            notes: 'testnote',
          }),
        )
      })
    })

    it('saves the correct outcome code if the action is completed', () => {
      const page = new ReviewPage(
        'completed',
        'test',
        { form: formId },
        undefined as unknown as ContactOutcomeDto,
        { 'Test key': 'Test value' },
        true,
      )
      form = appointmentOutcomeFormFactory.build({
        contactOutcomeCode: 'ABCD',
      })

      const supervisor = supervisorFactory.build()

      const result = page.buildPayload(appointment, form, supervisor)

      expect(result.contactOutcomeCode).toEqual('ABCD')
    })
  })
})
