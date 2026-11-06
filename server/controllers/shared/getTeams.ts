import GovUkSelectInput from '../../forms/GovUkSelectInput'
import { GetProvidersAndTeamsParams, GovUkSelectOption } from '../../@types/user-defined'

export default async ({
  providerService,
  providerCode,
  teamCode,
  response,
}: GetProvidersAndTeamsParams): Promise<Array<GovUkSelectOption>> => {
  if (!providerCode) {
    return [{ value: '', text: 'Choose a region' }]
  }

  const teams = await providerService.getTeams(providerCode, response.locals.user.username)

  return GovUkSelectInput.getOptions(teams.providers, 'name', 'code', 'Choose team', teamCode)
}
