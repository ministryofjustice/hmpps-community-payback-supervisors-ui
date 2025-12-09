import PersonOnProbation from './delius/personOnProbation'

export type TestOptions = {
  deliusUser: {
    username: string
    password: string
  }
  supervisorUser: SupervisorUser
  team: Team
  testCount: number
  canCreateNewPops: boolean
  existingPops: Array<PersonOnProbation>
}

export interface SupervisorUser {
  username: string
  password: string
}
export interface Team {
  name: string
  provider: string
}
