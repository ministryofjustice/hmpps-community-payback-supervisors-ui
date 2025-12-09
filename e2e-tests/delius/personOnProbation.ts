export default class PersonOnProbation {
  constructor(
    public firstName: string,
    public lastName: string,
    public crn: string,
  ) {}

  public getFullName() {
    return `${this.firstName} ${this.lastName}`
  }
}
