import generateErrorSummary from './errorUtils'

describe('errorUtils', () => {
  it('generates an error summary', () => {
    const validationErrors = {
      selectField: {
        text: 'Select an answer',
      },
      inputField: {
        text: 'Provide an answer',
      },
    }

    expect(generateErrorSummary(validationErrors)).toEqual([
      {
        text: 'Select an answer',
        href: '#selectField',
        attributes: {
          'data-cy-error-selectField': 'Select an answer',
        },
      },
      {
        text: 'Provide an answer',
        href: '#inputField',
        attributes: {
          'data-cy-error-inputField': 'Provide an answer',
        },
      },
    ])
  })
})
