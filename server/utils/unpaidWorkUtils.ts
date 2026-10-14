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
  ): Array<{ key: string; value: string; classList: string }> {
    const formattedHours = this.unpaidWorkHoursDetails(unpaidWorkDetails)
    return [
      {
        key: 'Hours remaining',
        value: formattedHours.totalHoursRemaining,
        classList: 'card-group__item govuk-grid-column-full',
      },
      {
        key: 'Hours ordered',
        value: formattedHours.totalHoursOrdered,
        classList: 'card-group__item card-group__item-one-half',
      },
      {
        key: 'Hours credited',
        value: formattedHours.totalHoursCredited,
        classList: 'card-group__item card-group__item-one-half',
      },
    ]
  }

  private static totalHoursRemaining(detail: CommonUnpaidWorkDetailsDto) {
    return DateTimeFormats.totalMinutesToHumanReadableHoursAndMinutes(detail.requiredMinutes - detail.completedMinutes)
  }
}
