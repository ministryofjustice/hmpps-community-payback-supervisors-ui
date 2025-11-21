import { path } from 'static-path'

const supervisorUiPath = path('/supervisor')

const projectPath = supervisorUiPath.path('/projects/:projectCode')
const singleAppointmentPath = projectPath.path('/appointments/:appointmentId')

export default {
  projects: {
    session: projectPath.path('sessions').path(':date'),
  },
  appointments: {
    singleAppointment: singleAppointmentPath,
    outcome: singleAppointmentPath.path('outcome'),
  },
  sessions: {
    next: supervisorUiPath.path('supervisors').path(':supervisorCode').path('sessions/next'),
  },
}
