import { GovUkSelectOption } from '../@types/user-defined'

export default class GovUkSelectInput {
  static getOptions = <T>(
    items: Array<T>,
    textKey: keyof T,
    valueKey: keyof T,
    firstOptionText?: string,
    selectedValue?: string,
  ): Array<GovUkSelectOption> => {
    const options = items.map(item => ({
      text: item[textKey].toString(),
      value: item[valueKey].toString(),
      selected: selectedValue === item[valueKey],
    }))

    if (firstOptionText) {
      options.unshift({ text: firstOptionText, value: '', selected: !selectedValue })
    }

    return options
  }
}
