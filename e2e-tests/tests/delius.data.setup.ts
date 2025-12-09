import { slow } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/common/common'
import { deliusPerson } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/utils/person'
import { login } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { createOffender } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/offender/create-offender'
import { data } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/test-data/test-data'
import { createCommunityEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/event/create-event'
import { createRequirementForEvent } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/requirement/create-requirement'
import { createUpwProject } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/create-upw-project'
import { allocateCurrentCaseToUpwProject } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/allocate-current-case-to-upw-project'
import { Page } from '@playwright/test'
import DeliusTestData, { writeDeliusData } from '../delius/deliusTestData'
import test from '../test'
import { Team } from '../testOptions'
import PersonOnProbation from '../delius/personOnProbation'

test('deliusData', async ({ page, team, testCount, canCreateNewPops, existingPops }) => {
  slow()
  await login(page)
  const upwProject = await createUpwProject(page, {
    providerName: team.provider,
    teamName: team.name,
  })

  const deliusTestData: DeliusTestData = {
    project: { name: upwProject.projectName, code: upwProject.projectCode },
    pops: [],
  }
  const allocationPromises: Array<() => Promise<PersonOnProbation>> = Array.from({ length: testCount }, (_, i) => {
    return () => createAndAllocatePerson(page, deliusTestData, team, existingPops, canCreateNewPops, i)
  })
  const personOnProbationResults = await allocationPromises.reduce<Promise<PersonOnProbation[]>>(
    async (allocationPromiseChain, task) => {
      const popList = await allocationPromiseChain
      const pop = await task()
      popList.push(pop)
      return popList
    },
    Promise.resolve([]),
  )

  deliusTestData.pops.push(...personOnProbationResults)
  await writeDeliusData(deliusTestData)
})

async function createAndAllocatePerson(
  page: Page,
  deliusTestData: DeliusTestData,
  team: Team,
  existingPops: PersonOnProbation[],
  canCreateNewPops: boolean,
  count: number,
): Promise<PersonOnProbation> {
  let pop: PersonOnProbation
  if (canCreateNewPops || existingPops.length < count) {
    const person = deliusPerson()
    const crn: string = await createOffender(page, {
      person,
      providerName: team.provider,
    })
    pop = new PersonOnProbation(person.firstName, person.lastName, crn)
  } else {
    pop = existingPops[count]
  }
  await createCommunityEvent(page, { crn: pop.crn, allocation: { team } })

  await createRequirementForEvent(page, {
    crn: pop.crn,
    requirement: data.requirements.unpaidWork,
    team,
  })

  await page.locator('a', { hasText: 'Personal Details' }).click()

  await allocateCurrentCaseToUpwProject(page, {
    providerName: team.provider,
    teamName: team.name,
    projectName: deliusTestData.project.name,
  })
  return pop
}
