import superagent, { type SuperAgentRequest, type Response } from 'superagent'

const url = 'http://localhost:9092/__admin'

const stubFor = (mapping: Record<string, unknown>): SuperAgentRequest =>
  superagent.post(`${url}/mappings`).send(mapping)

const getMatchingRequests = body => superagent.post(`${url}/requests/find`).send(body)

const resetStubs = (): Promise<Array<Response>> =>
  Promise.all([superagent.delete(`${url}/mappings`), superagent.delete(`${url}/requests`)])

const arrayToQueryStubMappings = (array: Array<unknown>) => array.map(value => ({ equalTo: value }))

export { stubFor, getMatchingRequests, resetStubs, arrayToQueryStubMappings }
