import GovUkSelectInput from './GovUkSelectInput'

describe('GovUkSelectInput', () => {
  describe('convertObjectsToSelectOptions', () => {
    const objects = [
      {
        id: '123',
        name: 'abc',
      },
      {
        id: '345',
        name: 'def',
      },
    ]

    it('converts objects to an array of select options', () => {
      const result = GovUkSelectInput.getOptions(objects, 'name', 'id')

      expect(result).toEqual([
        {
          text: 'abc',
          value: '123',
          selected: false,
        },
        {
          text: 'def',
          value: '345',
          selected: false,
        },
      ])
    })

    it('Adds a first option with selected if no value', () => {
      const result = GovUkSelectInput.getOptions(objects, 'name', 'id', 'Select a keyworker')

      expect(result).toEqual([
        {
          value: '',
          text: 'Select a keyworker',
          selected: true,
        },
        {
          text: 'abc',
          value: '123',
          selected: false,
        },
        {
          text: 'def',
          value: '345',
          selected: false,
        },
      ])
    })

    it('marks the object that is in the context as selected', () => {
      const result = GovUkSelectInput.getOptions(objects, 'name', 'id', 'Select a keyworker', '123')

      expect(result).toEqual([
        {
          value: '',
          text: 'Select a keyworker',
          selected: false,
        },
        {
          text: 'abc',
          value: '123',
          selected: true,
        },
        {
          text: 'def',
          value: '345',
          selected: false,
        },
      ])
    })

    it('converts numbers to strings', () => {
      const numberObjects = [
        { name: 1, id: 123 },
        { name: 2, id: 345 },
      ]
      const result = GovUkSelectInput.getOptions(numberObjects, 'name', 'id')

      expect(result).toEqual([
        {
          text: '1',
          value: '123',
          selected: false,
        },
        {
          text: '2',
          value: '345',
          selected: false,
        },
      ])
    })
  })
})
