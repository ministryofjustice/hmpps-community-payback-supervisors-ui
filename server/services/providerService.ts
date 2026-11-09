import { ProviderSummaryDto, ProviderTeamSummariesDto } from '../@types/shared'
import ProviderClient from '../data/providerClient'

export default class ProviderService {
  constructor(private readonly providerClient: ProviderClient) {}

  async getProviders(username: string): Promise<ProviderSummaryDto[]> {
    const response = await this.providerClient.getProviders(username)
    return response.providers
  }

  async getTeams(providerCode: string, username: string): Promise<ProviderTeamSummariesDto> {
    const teams = await this.providerClient.getTeams(providerCode, username)

    return teams
  }
}
