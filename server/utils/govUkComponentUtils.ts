import { GovUkActionItem, GovUkSummaryListItem } from '../@types/user-defined'

export type SummaryListBuildOptions = {
  label: string
  content?: string
  actions?: {
    items: Array<GovUkActionItem>
  }
  contentIsHtml?: boolean
}
export default class GovUKComponentUtils {
  static summaryListRowsWithAndWithoutActions(items: Array<GovUkSummaryListItem>) {
    return items.map(item => {
      if (item.actions?.items?.length > 0) {
        return item
      }
      const classes = [item.classes, 'govuk-summary-list__row--no-actions'].join(' ').trim()

      return { ...item, classes }
    })
  }

  static buildSummaryListItem({
    label,
    content,
    actions,
    contentIsHtml = false,
  }: SummaryListBuildOptions): GovUkSummaryListItem {
    const value = contentIsHtml
      ? {
          html: content,
        }
      : {
          text: content,
        }
    return {
      key: {
        text: label,
      },
      value,
      ...(actions?.items?.length ? { actions } : {}),
    }
  }

  static changeAction(href: string, label: string): GovUkActionItem {
    return {
      href,
      text: 'Change',
      visuallyHiddenText: label.toLowerCase(),
      classes: 'govuk-link--no-visited-state',
    }
  }

  static buildSummaryListItems(
    items: Array<SummaryListBuildOptions>,
    removeEmptyRows: boolean = false,
  ): Array<GovUkSummaryListItem> {
    const itemsToMap = removeEmptyRows ? items.filter(item => item.content) : items
    return itemsToMap.map(this.buildSummaryListItem)
  }
}
