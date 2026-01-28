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
import test from '../fixtures/test'
import { Team } from '../fixtures/testOptions'
import PersonOnProbation from '../delius/personOnProbation'

test('deliusData', async ({ page, team, testCount, canCreateNewPops, existingPops }) => {
  slow()
  await login(page)

  const upwProject = await test.step('Create UPW project', async () => {
    return createUpwProject(page, {
      providerName: team.provider,
      teamName: team.name,
    })
  })

  const deliusTestData: DeliusTestData = {
    project: {
      name: upwProject.projectName,
      code: upwProject.projectCode,
      availability: {
        startTime: upwProject.projectAvailability.startTime,
        endTime: upwProject.projectAvailability.endTime,
      },
    },
    team,
    pops: [],
  }
  /* eslint-disable no-await-in-loop */
  for (let i = 0; i < testCount; i += 1) {
    await test.step(`Create and allocate person ${i + 1} of ${testCount}`, async () => {
      console.log('----- Creating and allocating person %d out of %d -----', i + 1, testCount) // eslint-disable-line  no-console
      const personOnProbation = await createAndAllocatePerson(
        page,
        deliusTestData,
        team,
        existingPops,
        canCreateNewPops,
        i,
      )
      deliusTestData.pops.push(personOnProbation)
    })
  }
  /* eslint-enable no-await-in-loop */
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

    const crn: string = await test.step('Create offender', async () => {
      return createOffender(page, {
        person,
        providerName: team.provider,
      })
    })
    pop = new PersonOnProbation(person.firstName, person.lastName, crn)
  } else {
    pop = existingPops[count]
  }
  await test.step('Create community event', async () => {
    await createCommunityEvent(page, { crn: pop.crn, allocation: { team } })
  })

  await test.step('Create requirement for event', async () => {
    await createRequirementForEvent(page, {
      crn: pop.crn,
      requirement: data.requirements.unpaidWork,
      team,
    })
  })

  await page.locator('a', { hasText: 'Personal Details' }).click()

  await test.step('Allocate person to project', async () => {
    await allocateCurrentCaseToUpwProject(page, {
      providerName: team.provider,
      teamName: team.name,
      projectName: deliusTestData.project.name,
    })
  })

  return pop
}
