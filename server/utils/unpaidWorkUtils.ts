import { CommonUnpaidWorkDetailsDto } from '../@types/shared'
import DateTimeFormats from './dateTimeUtils'

export interface UnpaidWorkHoursDetails {
  totalHoursOrdered: string
  totalHoursRemaining: string
  totalHoursCredited: string
}

export default class UnpaidWorkUtils {
  static unpaidWorkHoursDetails(details: CommonUnpaidWorkDetailsDto): UnpaidWorkHoursDetails {
    const totalHoursOrdered = DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(details.requiredMinutes)
    const totalHoursCredited = DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(details.completedMinutes)
    const totalHoursRemaining = DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(details.remainingMinutes)

    return {
      totalHoursOrdered,
      totalHoursCredited,
      totalHoursRemaining,
    }
  }

  static unpaidWorkHoursCardList(
    unpaidWorkDetails: CommonUnpaidWorkDetailsDto,
  ): Array<{ key: string; value: string; containerClassList: string; cardClassList?: string }> {
    const formattedHours = this.unpaidWorkHoursDetails(unpaidWorkDetails)

    const containerClassList = 'card-group__item'
    return [
      {
        key: 'Hours remaining',
        value: formattedHours.totalHoursRemaining,
        containerClassList: `${containerClassList}-main`,
        cardClassList: `card--highlight-blue`,
      },
      {
        key: 'Hours ordered',
        value: formattedHours.totalHoursOrdered,
        containerClassList: `${containerClassList}-sub`,
      },
      {
        key: 'Hours credited',
        value: formattedHours.totalHoursCredited,
        containerClassList: `${containerClassList}-sub`,
      },
    ]
  }
}
