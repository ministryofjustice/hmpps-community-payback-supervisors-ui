import type { Request, RequestHandler, Response } from 'express'
import ProviderService from '../../services/providerService'
import getTeams from './getTeams'

export default class DataController {
  constructor(private readonly providerService: ProviderService) {}

  teams(): RequestHandler {
    return async (_req: Request, res: Response) => {
      const { provider } = _req.params
      const teams = await getTeams({
        providerService: this.providerService,
        providerCode: provider,
        response: res,
      })
      res.send({ teams })
    }
  }
}
