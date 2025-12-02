import { YesOrNo } from '../../@types/user-defined'
import GovUkRadioGroup from './GovUkRadioGroup'

describe('GovUkRadioGroup', () => {
  describe('yesNoItems', () => {
    it('should return a list of yes/no options', () => {
      expect(GovUkRadioGroup.yesNoItems({})).toStrictEqual([
        { text: 'Yes', value: 'yes', checked: false },
        { text: 'No', value: 'no', checked: false },
      ])
    })

    it('should return a list of yes/no options if passed false', () => {
      expect(GovUkRadioGroup.yesNoItems({})).toStrictEqual([
        { text: 'Yes', value: 'yes', checked: false },
        { text: 'No', value: 'no', checked: false },
      ])
    })

    describe('handling checked values', () => {
      it('should flag "yes" option as checked if checked value is true', () => {
        expect(GovUkRadioGroup.yesNoItems({ checkedValue: true })).toStrictEqual([
          { text: 'Yes', value: 'yes', checked: true },
          { text: 'No', value: 'no', checked: false },
        ])
      })

      it('should flag "no" option as checked if checked value is false', () => {
        expect(GovUkRadioGroup.yesNoItems({ checkedValue: false })).toStrictEqual([
          { text: 'Yes', value: 'yes', checked: false },
          { text: 'No', value: 'no', checked: true },
        ])
      })

      it('should not flag an option as checked if checked value is null', () => {
        expect(GovUkRadioGroup.yesNoItems({ checkedValue: null })).toStrictEqual([
          { text: 'Yes', value: 'yes', checked: false },
          { text: 'No', value: 'no', checked: false },
        ])
      })
    })
  })

  describe('valueFromYesOrNoItem', () => {
    it.each([
      ['yes', true],
      ['no', false],
    ])('returns boolean value from selected', (selected: YesOrNo, value: boolean) => {
      const result = GovUkRadioGroup.valueFromYesOrNoItem(selected)
      expect(result).toEqual(value)
    })
  })
})
