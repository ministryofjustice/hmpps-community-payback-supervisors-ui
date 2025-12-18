import { test as base } from '@playwright/test'

import { TestOptions } from './testOptions'
import PersonOnProbation from './delius/personOnProbation'

export default base.extend<TestOptions>({
  deliusUser: [
    {
      username: process.env.DELIUS_USERNAME as string,
      password: process.env.DELIUS_PASSWORD as string,
    },
    { option: true },
  ],
  supervisorUser: [
    {
      username: process.env.SUPERVISOR_USERNAME as string,
      password: process.env.SUPERVISOR_PASSWORD as string,
    },
    { option: true },
  ],
  team: [
    {
      provider: 'East of England',
      name: 'CPB Automated Test Team',
    },
    { option: true },
  ],
  testCount: Number(process.env.PW_TOTAL_TESTS),
  canCreateNewPops: true,
  existingPops: [
    [
      new PersonOnProbation('Kathleen', 'Greenholt', 'X970944'),
      new PersonOnProbation('Milton', 'Predovic', 'X970945'),
      new PersonOnProbation('Darren', 'Botsford', 'X970948'),
    ],
    { option: true },
  ],
})
