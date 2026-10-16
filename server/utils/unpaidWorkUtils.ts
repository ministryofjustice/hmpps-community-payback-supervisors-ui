import { CommonUnpaidWorkDetailsDto } from '../@types/shared'
import DateTimeFormats from './dateTimeUtils'

export interface UnpaidWorkHoursDetails {
  totalHoursOrdered: string
  totalHoursRemaining?: string
  totalHoursCredited?: string
}

export default class UnpaidWorkUtils {
  static unpaidWorkHoursDetails(details: CommonUnpaidWorkDetailsDto): UnpaidWorkHoursDetails {
    const totalHoursOrdered = DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(details.requiredMinutes)
    const totalHoursCredited = DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(details.completedMinutes)

    return {
      totalHoursOrdered,
      totalHoursCredited,
      totalHoursRemaining: UnpaidWorkUtils.totalHoursRemaining(details),
    }
  }

  static unpaidWorkHoursCardList(
    unpaidWorkDetails: CommonUnpaidWorkDetailsDto,
  ): Array<{ key: string; value: string; containerClassList: string; cardClassList: string }> {
    const formattedHours = this.unpaidWorkHoursDetails(unpaidWorkDetails)

    const containerClassList = 'card-group__item card-group__item'
    const cardClassList = 'govuk-summary-card card'
    return [
      {
        key: 'Hours remaining',
        value: formattedHours.totalHoursRemaining,
        containerClassList: `${containerClassList}-main`,
        cardClassList: `${cardClassList} card--highlight-blue`,
      },
      {
        key: 'Hours ordered',
        value: formattedHours.totalHoursOrdered,
        containerClassList: `${containerClassList}-sub`,
        cardClassList,
      },
      {
        key: 'Hours credited',
        value: formattedHours.totalHoursCredited,
        containerClassList: `${containerClassList}-sub`,
        cardClassList,
      },
    ]
  }

  private static totalHoursRemaining(detail: CommonUnpaidWorkDetailsDto) {
    return DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(detail.requiredMinutes - detail.completedMinutes)
  }
}
