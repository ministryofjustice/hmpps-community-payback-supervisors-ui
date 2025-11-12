import { path } from 'static-path'

const supervisorUiPath = path('/supervisor')
const projectPath = supervisorUiPath.path('/projects/:projectCode')

export default {
  projects: {
    session: projectPath.path('sessions').path(':date'),
  },
}
