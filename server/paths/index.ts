import { path } from 'static-path'

const projectPath = path('/projects/:projectCode')

const paths = {
  sessions: {
    show: projectPath.path('sessions/:date'),
  },
}

export default paths
