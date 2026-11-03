import * as govukFrontend from 'govuk-frontend'
import * as mojFrontend from '@ministryofjustice/frontend'
import initTeamFilter from './teamFilter'

govukFrontend.initAll()
mojFrontend.initAll()
initTeamFilter()
