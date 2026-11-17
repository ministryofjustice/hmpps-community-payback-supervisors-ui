import nock from 'nock'

// Tests run in band in CI share Node's http module, so remove each file's nock interceptors to stop them handling
// requests made by later files
afterAll(() => {
  nock.cleanAll()
  nock.restore()
})
