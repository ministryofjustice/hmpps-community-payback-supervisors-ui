export interface ProjectAvailability {
  startTime: string
  endTime: string
}

export default class Project {
  constructor(
    public name: string,
    public code: string,
    public availability: ProjectAvailability,
  ) {}
}
