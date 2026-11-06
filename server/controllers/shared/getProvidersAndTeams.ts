import GovUkSelectInput from '../../forms/GovUkSelectInput'
import { GetProvidersAndTeamsParams, GovUkSelectOption } from '../../@types/user-defined'
import getTeams from './getTeams'

export type ProvidersAndTeams = {
  provider?: { text?: string; value: string }
  providerItems?: Array<GovUkSelectOption>
  teamItems: Array<GovUkSelectOption>
}

export default async ({
  providerService,
  providerCode,
  teamCode,
  response,
}: GetProvidersAndTeamsParams): Promise<ProvidersAndTeams> => {
  const providers = await providerService.getProviders(response.locals.user.username)

  if (providers.length === 1) {
    const [dto] = providers

    const provider = { text: dto.name, value: dto.code }
    const teamItems = await getTeams({
      providerService,
      providerCode: provider.value,
      teamCode,
      response,
    })

    return { teamItems, provider }
  }

  const provider = providerCode ? { value: providerCode } : undefined
  const providerItems = GovUkSelectInput.getOptions(providers, 'name', 'code', 'Choose region', providerCode)

  const teamItems = await getTeams({
    providerService,
    providerCode,
    response,
    teamCode,
  })

  return { teamItems, provider, providerItems }
}
