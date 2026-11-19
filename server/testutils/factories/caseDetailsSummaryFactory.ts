import { Factory } from 'fishery'
import { CommonCaseDetailsSummaryDto } from '../../@types/shared'
import unpaidWorkDetailsFactory from './unpaidWorkDetailsFactory'
import offenderFullFactory from './offenderFullFactory'

export default Factory.define<CommonCaseDetailsSummaryDto>(() => ({
  offender: offenderFullFactory.build(),
  unpaidWorkDetails: unpaidWorkDetailsFactory.buildList(3),
}))
