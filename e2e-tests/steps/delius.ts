import { login as deliusLogin } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/login'
import { checkAppointmentOnDelius as _checkAppointmentOnDelius } from '@ministryofjustice/hmpps-probation-integration-e2e-tests/steps/delius/upw/checkAppointmentDetails'
import { Page } from '@playwright/test'
import { Team } from '../fixtures/testOptions'
import { AppointmentTestData } from '../delius/deliusTestData'

export interface ContactOutcome {
  outcome: string
  notes?: string
  startTime?: string
  endTime?: string
}

export const checkAppointmentOnDelius = async (
  page: Page,
  team: Team,
  testData: AppointmentTestData,
  contactOutcome: ContactOutcome,
) => {
  await deliusLogin(page)
  await page.getByRole('link', { name: 'UPW Project Diary' }).click()
  await page.waitForSelector('span.float-start:has-text("UPW Project Diary")')
  const { startTime, endTime } = testData.project.availability
  await _checkAppointmentOnDelius(page, {
    teamProvider: team.provider,
    teamName: team.name,
    projectName: testData.project.name,
    popCrn: testData.person.crn,
    popName: testData.person.getDisplayName(),
    startTime: contactOutcome.startTime ?? startTime,
    endTime: contactOutcome.endTime ?? endTime,
    outcome: contactOutcome.outcome,
  })
}
