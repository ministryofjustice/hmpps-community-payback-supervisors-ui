import { Factory } from 'fishery'
import { faker } from '@faker-js/faker'
import { CommonUnpaidWorkDetailsDto } from '../../@types/shared'
import courtFactory from './courtFactory'
import mainOffenceFactory from './mainOffenceFactory'

export default Factory.define<CommonUnpaidWorkDetailsDto>(() => {
  const requiredMinutes = faker.number.int({ min: 100, max: 300 })
  const completedMinutes = faker.number.int({ min: 0, max: 100 })
  const totalAdjustmentMinutes = faker.number.int({ min: 0, max: 100 })

  return {
    eventNumber: faker.number.int({ min: 1 }),
    sentenceDate: faker.date.recent().toISOString(),
    requiredMinutes,
    attendedAppointmentsMinutes: completedMinutes + totalAdjustmentMinutes,
    totalAdjustmentMinutes,
    completedMinutes,
    remainingMinutes: requiredMinutes - completedMinutes,
    allowedEteMinutes: faker.number.int({ min: 100, max: 200 }),
    completedEteMinutes: faker.number.int({ min: 0, max: 100 }),
    remainingEteMinutes: faker.number.int({ min: 0, max: 100 }),
    eventOutcome: faker.string.alpha(6),
    upwStatus: faker.string.alpha(10),
    referralDate: faker.date.recent().toISOString(),
    convictionDate: faker.date.recent().toISOString(),
    court: courtFactory.build(),
    mainOffence: mainOffenceFactory.build(),
  }
})
