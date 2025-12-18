import { SupervisorDto } from '../@types/shared'
import SupervisorClient from '../data/supervisorClient'

export default class SupervisorService {
  constructor(private readonly supervisorClient: SupervisorClient) {}

  getSupervisor(username: string): Promise<SupervisorDto> {
    return this.supervisorClient.find(username)
  }
}
