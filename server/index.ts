import createApp from './app'
import { controllers } from './controllers'
import { services } from './services'

const serviceList = services()
const app = createApp(controllers(serviceList), serviceList)

export default app
