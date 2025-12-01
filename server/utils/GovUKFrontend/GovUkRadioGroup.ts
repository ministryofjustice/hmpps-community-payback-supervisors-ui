import { GovUkRadioOption, YesOrNo } from '../../@types/user-defined'

export default class GovUkRadioGroup {
  static yesNoItems({ checkedValue }: { checkedValue?: boolean }): GovUkRadioOption[] {
    const options = [
      { text: 'Yes', value: 'yes' },
      { text: 'No', value: 'no' },
    ]

    return options.map(option => ({
      ...option,
      checked: option.value === GovUkRadioGroup.determineCheckedValue(checkedValue),
    }))
  }

  private static determineCheckedValue(value?: boolean): 'yes' | 'no' | null {
    if (value === false) {
      return 'no'
    }

    if (value === true) {
      return 'yes'
    }

    return null
  }

  static valueFromYesOrNoItem(value?: YesOrNo): boolean {
    return value === 'yes'
  }
}
