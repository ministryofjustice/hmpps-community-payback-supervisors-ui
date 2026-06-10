import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const sessionsPath = projectPath.path('sessions/:date')
const appointmentPath = projectPath.path('/appointments/:appointmentId')
const appointmentArrivedPath = appointmentPath.path('arrived')
const appointmentAbsentPath = appointmentPath.path('absent')
const appointmentCompletedPath = appointmentPath.path('completed')
const appointmentReviewPath = appointmentPath.path('review')

const paths = {
  sessions: {
    show: sessionsPath,
    clearSessionStatuses: sessionsPath.path('clear-data'),
  },
  appointments: {
    show: appointmentPath,
    arrived: {
      startTime: appointmentArrivedPath.path('start-time'),
      endTime: appointmentArrivedPath.path('finish-time'),
    },
    completed: {
      endTime: appointmentCompletedPath.path('finish-time'),
      compliance: appointmentCompletedPath.path('compliance'),
    },
    absent: {
      startTime: appointmentAbsentPath.path('start-time'),
    },
    confirm: {
      working: appointmentPath.path('confirm-working'),
      absent: appointmentPath.path('confirm-absent'),
      completed: appointmentPath.path('confirm-completed'),
    },
    review: {
      absent: appointmentReviewPath.path('absent'),
      completed: {
        compliance: appointmentReviewPath.path('completed').path('compliance'),
      },
    },
  },
}

export default paths
