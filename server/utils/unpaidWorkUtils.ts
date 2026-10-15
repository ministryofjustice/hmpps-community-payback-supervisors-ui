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
    return [
      {
        key: 'Hours remaining',
        value: formattedHours.totalHoursRemaining,
        containerClassList: 'card-group__item govuk-grid-column-full',
        cardClassList: 'govuk-summary-card card card--highlight-blue',
      },
      {
        key: 'Hours ordered',
        value: formattedHours.totalHoursOrdered,
        containerClassList: 'card-group__item card-group__item-one-half',
        cardClassList: 'govuk-summary-card card',
      },
      {
        key: 'Hours credited',
        value: formattedHours.totalHoursCredited,
        containerClassList: 'card-group__item card-group__item-one-half',
        cardClassList: 'govuk-summary-card card',
      },
    ]
  }

  private static totalHoursRemaining(detail: CommonUnpaidWorkDetailsDto) {
    return DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(detail.requiredMinutes - detail.completedMinutes)
  }
}
