import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const appointmentPath = projectPath.path('/appointments/:appointmentId')
const appointmentArrivedPath = appointmentPath.path('arrived')
const appointmentAbsentPath = appointmentPath.path('absent')

const paths = {
  sessions: {
    show: projectPath.path('sessions/:date'),
  },
  appointments: {
    show: appointmentPath,
    arrived: {
      startTime: appointmentArrivedPath.path('start-time'),
      isAbleToWork: appointmentArrivedPath.path('is-able-to-work'),
      unableToWork: appointmentArrivedPath.path('unable-to-work'),
    },
    absent: {
      startTime: appointmentAbsentPath.path('start-time'),
    },
    confirm: {
      working: appointmentPath.path('confirm-working'),
      absent: appointmentPath.path('confirm-absent'),
      unableToWork: appointmentPath.path('confirm-unable-to-work'),
    },
  },
}

export default paths
