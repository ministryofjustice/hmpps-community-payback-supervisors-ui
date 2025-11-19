import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const appointmentPath = projectPath.path('/appointments/:appointmentId')
const appointmentArrivedPath = appointmentPath.path('arrived')

const paths = {
  sessions: {
    show: projectPath.path('sessions/:date'),
  },
  appointments: {
    show: appointmentPath,
    arrived: {
      startTime: appointmentArrivedPath.path('start-time'),
      ableToWork: appointmentArrivedPath.path('able-to-work'),
    },
    confirm: {
      working: appointmentPath.path('confirm-working'),
    },
  },
}

export default paths
