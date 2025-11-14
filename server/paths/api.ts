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
  },
}
