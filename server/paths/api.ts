import { path } from 'static-path'

const supervisorUiPath = path('/supervisor')

const projectPath = supervisorUiPath.path('/projects/:projectCode')
const singleAppointmentPath = projectPath.path('/appointments/:appointmentId')
const referenceDataPath = path('/common/references')
const formsPath = path('/common/forms')

export default {
  projects: {
    session: projectPath.path('sessions').path(':date'),
  },
  appointments: {
    singleAppointment: singleAppointmentPath,
    outcome: singleAppointmentPath.path('outcome'),
  },
  sessions: {
    next: supervisorUiPath
      .path('providers')
      .path(':providerCode')
      .path('teams')
      .path(':teamCode')
      .path('sessions/future'),
  },
  referenceData: {
    contactOutcomes: referenceDataPath.path('contact-outcomes'),
  },
  forms: formsPath.path(':type/:id'),
}
