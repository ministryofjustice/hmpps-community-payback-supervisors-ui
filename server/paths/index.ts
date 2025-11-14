import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')
const appointmentPath = projectPath.path('/appointments/:appointmentId')

const paths = {
  sessions: {
    show: projectPath.path('sessions/:date'),
  },
  appointments: {
    personDetails: appointmentPath.path('/person-details'),
    startTime: appointmentPath.path('start-time'),
    ableToWork: appointmentPath.path('able-to-work'),
  },
}

export default paths
