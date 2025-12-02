import Page from '../../../page'

export default class LogTimePage extends Page {
  constructor(title: string) {
    super(title)
  }

  clearTime(): void {
    this.getInputByLabel(this.title).clear()
  }

  enterTime(value: string): void {
    this.clearTime()
    this.getInputByLabel(this.title).type(value)
  }

  shouldHaveTimeValue(value: string) {
    this.shouldHaveInputValue(this.title, value)
  }
}
