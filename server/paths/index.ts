import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const appointmentPath = projectPath.path('/appointments/:appointmentId')
const appointmentUpdatePath = appointmentPath.path(':action')

const paths = {
  sessions: {
    show: projectPath.path('sessions/:date'),
  },
  appointments: {
    show: appointmentPath,
    startTime: appointmentUpdatePath.path('/start-time'),
    ableToWork: appointmentUpdatePath.path('/able-to-work'),
    confirm: {
      absent: appointmentPath.path('absent').path('confirm'),
    },
  },
}

export default paths
