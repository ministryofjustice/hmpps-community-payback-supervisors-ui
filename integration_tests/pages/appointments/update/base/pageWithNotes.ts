import Page from '../../../page'

export default class PageWithNotes extends Page {
  private userInput: string

  constructor(
    title: string,
    private readonly notesLabel: string,
  ) {
    super(title)
  }

  enterNotesWithCharacterLength(characterLength: number): void {
    this.userInput = 'x'.repeat(characterLength)

    // Use 'invoke' instead of 'type' for performance reasons
    this.notesField().invoke('val', this.userInput)
  }

  notesField() {
    return this.getInputByLabel(this.notesLabel)
  }

  shouldShowSubmittedNotes(): void {
    this.notesField().should('have.value', this.userInput)
  }

  checkSensitiveInformation(): void {
    this.getInputByLabel('This information is not to be shared with the person on probation').check()
  }
}
