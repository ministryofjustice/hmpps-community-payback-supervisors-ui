import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const sessionsPath = projectPath.path('sessions/:date')
const appointmentPath = projectPath.path('/appointments/:appointmentId')
const appointmentArrivedPath = appointmentPath.path('arrived')
const appointmentAbsentPath = appointmentPath.path('absent')
const appointmentCompletedPath = appointmentPath.path('completed')
const appointmentLeftEarlyPath = appointmentPath.path('left-early')

const paths = {
  sessions: {
    show: sessionsPath,
    clearSessionStatuses: sessionsPath.path('clear-data'),
  },
  appointments: {
    show: appointmentPath,
    arrived: {
      startTime: appointmentArrivedPath.path('start-time'),
      isAbleToWork: appointmentArrivedPath.path('is-able-to-work'),
      unableToWork: appointmentArrivedPath.path('unable-to-work'),
    },
    completed: {
      endTime: appointmentCompletedPath.path('finish-time'),
      compliance: appointmentCompletedPath.path('compliance'),
    },
    leftEarly: {
      endTime: appointmentLeftEarlyPath.path('finish-time'),
      reason: appointmentLeftEarlyPath.path('reason'),
      compliance: appointmentLeftEarlyPath.path('compliance'),
    },
    absent: {
      startTime: appointmentAbsentPath.path('start-time'),
    },
    confirm: {
      working: appointmentPath.path('confirm-working'),
      absent: appointmentPath.path('confirm-absent'),
      unableToWork: appointmentPath.path('confirm-unable-to-work'),
      completed: appointmentPath.path('confirm-completed'),
      leftEarly: appointmentPath.path('confirm-left-early'),
    },
  },
}

export default paths
