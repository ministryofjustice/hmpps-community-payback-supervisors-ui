import { path } from 'static-path'

const supervisorUiPath = path('/supervisor')

const projectPath = supervisorUiPath.path('/projects/:projectCode')
const commonPath = path('/common')
const singleAppointmentPath = projectPath.path('/appointments/:appointmentId')
const referenceDataPath = commonPath.path('/references')
const formsPath = commonPath.path('/forms')
const offenderSummaryPath = commonPath.path('/offenders/:crn/summary')
const providersPath = commonPath.path('/providers')
const teamsPath = providersPath.path(':providerCode/teams')

export default {
  projects: {
    session: projectPath.path('sessions').path(':date'),
  },
  appointments: {
    singleAppointment: singleAppointmentPath,
    outcome: singleAppointmentPath,
  },
  sessions: {
    next: supervisorUiPath.path('sessions/recent'),
  },
  referenceData: {
    contactOutcomes: referenceDataPath.path('contact-outcomes'),
  },
  forms: formsPath.path(':type/:id'),
  supervisors: {
    supervisor: supervisorUiPath.path('supervisors'),
  },
  offenderSummary: offenderSummaryPath,
  providers: {
    providers: providersPath,
    teams: teamsPath,
    supervisors: teamsPath.path(':teamCode/supervisors'),
  },
}
