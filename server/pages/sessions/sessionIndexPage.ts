import MojDateInput from '../../forms/mojDateInput'
import { ValidationErrors, SearchValues, SessionIndexPageInput } from '../../@types/user-defined'

export default class sessionIndexPage {
  private query: SessionIndexPageInput

  constructor(query: SessionIndexPageInput) {
    this.query = query
  }

  validationErrors() {
    const validationErrors: ValidationErrors<SessionIndexPageInput> = {}

    if (!this.query.provider) {
      validationErrors.provider = { text: 'Choose a region' }
    }

    if (!this.query.team) {
      validationErrors.team = { text: 'Choose a team' }
    }

    const dateError = MojDateInput.validate(this.query.date)

    if (dateError) {
      validationErrors.date = dateError
    }

    return validationErrors
  }

  items() {
    return {
      date: this.query.date,
    }
  }

  searchValues(): SearchValues {
    const date = MojDateInput.toIsoDate(this.query.date)
    return {
      startDate: date,
      endDate: date,
      teamCode: this.query.team,
    }
  }
}
