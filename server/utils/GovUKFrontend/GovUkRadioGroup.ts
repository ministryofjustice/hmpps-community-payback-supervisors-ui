import { GovUkRadioOption, YesOrNo } from '../../@types/user-defined'

export default class GovUkRadioGroup {
  static yesNoItems({ checkedValue }: { checkedValue?: YesOrNo }): GovUkRadioOption[] {
    const options = [
      { text: 'Yes', value: 'yes' },
      { text: 'No', value: 'no' },
    ]

    return options.map(option => ({
      ...option,
      checked: option.value === checkedValue,
    }))
  }

  static determineCheckedValue(value?: boolean): 'yes' | 'no' | null {
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

  static nullableValueFromYesOrNoItem(value?: YesOrNo): boolean | null {
    if (value === 'yes') {
      return true
    }

    if (value === 'no') {
      return false
    }

    return null
  }
}
